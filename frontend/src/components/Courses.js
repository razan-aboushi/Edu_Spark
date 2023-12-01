import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Swal  from 'sweetalert2';
import jwt_decode from 'jwt-decode';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [universities, setUniversities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;


  useEffect(() => {
    getUniversities();
    handleInputChange();
    fetchEnrolledCourses();

  }, []);


  // get the enrolled courses for the user to check if he gets this course before now or not
    const fetchEnrolledCourses = async () => {

      try {
        const response = await axios.get(`http://localhost:4000/enrolled-courses/${user_id}`);
        setEnrolledCourses(response.data);
      } catch (error) {
        console.log('Error fetching enrolled courses:', error);
      }
    };


  // Get the universities in dropdown list
  const getUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:4000/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };



  // Handle when inputs in filters change
  const handleInputChange = (event = {}) => {
    const { name, value } = event.target || {};

    if (name === 'course_university') {
      setUniversityFilter(value);

      const universityId = parseInt(value);
      axios.get(`http://localhost:4000/universities/${universityId}/categories`).then((response) => {
        setCategories(response.data);
      }).catch((error) => {
        console.error(error);
      });
    }

    if (name === 'category') {
      setCategoryFilter(value);
    }
  };


  // get all courses
  useEffect(() => {
    axios.get('http://localhost:4000/courses').then((response) => {
      setCourses(response.data);
    }).catch((error) => {
      console.error('Error fetching courses:', error);
    });
  }, []);


  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // convert the date from the timestamp to normal date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  };



  // Handle add the course to cart for the user to get it and complete checkOut
  const handleAddToCart = async (course) => {

    if (!token) {
      // If the user is not logged in, show a pop-up message asking them to log in first.
      Swal.fire({
        title: 'من فضلك ، قُم بتسجيل الدخول لتتمكن من التسجيلِ في الدورة',
        text: 'هل ترغب في تسجيل الدخول الآن؟',
        icon: 'info',
        confirmButtonText: 'تسجيل الدخول',
        showCancelButton: true,
        cancelButtonText: 'إلغاء',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/LogIn");
        }
      });

      return;
    }

    try {
      // Check if the course already exists in the cart table
      const response = await axios.get(`http://localhost:4000/cartCourse/${user_id}/${course.course_id}`);
      if (response.data.exists) {
        Swal.fire({
          title: 'الدورة موجود بالفعل بالسلة',
          icon: 'info',
          confirmButtonText: 'موافق',
        });
        return;
      }


      // Send a request to the server to add the course to the cart table
      await axios.post('http://localhost:4000/cartCourse', {
        user_id: user_id,
        course_id: course.course_id,
        course_title: course.course_title,
        course_price: course.course_price,
        course_image: course.course_image,
        type: 'course'
      });


      Swal.fire({
        title: 'تمت إضافة الدورة إلى السلة',
        html: `
          <img src="http://localhost:4000/images/${course.course_image}" alt=${course.course_title} class="popup-image" width="265px">
          <p class="popup-title">عنوان الدورة: ${course.course_title}</p>
          <p class="popup-price">السعر: ${course.course_price === "0" ? "مجاني" : `${course.course_price} د.أ`}</p>
          `,
        showCancelButton: true,
        confirmButtonText: 'موافق',
        cancelButtonText: 'إلغاء',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        customClass: {
          confirmButton: 'swal-close-button',
        },
      }).then(async (result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Remove the cart items from the server if the user cancels the payment
          await axios.delete(`http://localhost:4000/cartItemCourse/${user_id}/${course.course_id}`);

          Swal.fire({
            title: 'تم إلغاءالطلب بنجاح',
            icon: 'success',
            confirmButtonText: 'موافق',
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };


  // Make the pagination for this page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // To loop on the courses and number of pages
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const pageNumbers = [];
  for (let r = 1; r <= totalPages; r++) {
    pageNumbers.push(r);
  }


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  // get all courses
  useEffect(() => {
    axios.get('http://localhost:4000/filtered-courses', {
      params: {
        searchTerm,
        universityFilter,
        categoryFilter,
      },
    }).then((response) => {
      setCourses(response.data);
    }).catch((error) => {
      console.error('Error fetching courses:', error);
    });
  }, [searchTerm, universityFilter, categoryFilter]);


  return (
    <>
      <div className="container-fluid bg-primary py-5 mb-5 page-headerCourses" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">الدورات</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    الدورات
                  </li>
                  <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                    <p className="text-white">
                      التصنيفات
                    </p>
                  </Breadcrumbs>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-4">
        <div className="row justify-content-between">
          <div className="col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="ابحث عن اسم الدورة أو الناشر"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <div className="col-lg-4">
            <select
              className="form-select"
              name="course_university"
              value={universityFilter}
              onChange={handleInputChange}>
              <option value="">كل الجامعات</option>
              {universities.map((university) => (
                <option key={university.university_id} value={university.university_id}>
                  {university.university_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-4">
            <select
              className="form-select"
              name="category"
              value={categoryFilter}
              onChange={handleInputChange}>
              <option value="">كل التخصصات</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.category_id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))
              ) : (
                <option value=""> " إختر جامعة " تحميل التخصصات...</option>
              )}
            </select>
          </div>
        </div>
      </div>


      <div className="container-fluid py-5">
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {currentCourses.length > 0 ? (
              currentCourses.map((course) => (
                <div className="col mb-4 shadow" key={course.course_id}>
                  <div className="course-item bg-light shadow-sm rounded">
                    <div className="position-relative overflow-hidden">
                      <img src={`http://localhost:4000/images/${course.course_image}`} alt={course.course_title} style={{ width: "100%", height: "250px" }} />
                    </div>
                    <div className="text-left p-4 pb-0">
                      <h5 className="mb-4">{course.course_title}</h5>
                      <p className="mb-2 text-right">
                        السعر: {course.course_price === "0" ? (
                          <span style={{ color: 'green' }}>مجاني</span>
                        ) : (
                          <span>{course.course_price} د.أ</span>
                        )}
                      </p>
                      <p className="mb-4">{course.course_brief}</p>
                      <div>
                        <small className="text-muted">
                          تاريخ الدورة:
                          <i className="fa fa-clock me-2 ms-1" />
                          من {formatDate(course.start_date)}
                          <i className="fa fa-clock me-2 ms-1" />
                          إلى {formatDate(course.end_date)}
                        </small>
                      </div>
                      <div className="d-flex justify-content-start mt-3 mb-2">
                        <small className="text-muted">
                          <i className="fa fa-graduation-cap me-2 ms-1" />
                          {course.university_name}
                        </small>
                        <small className="text-muted">
                          <i className="fa fa-tag me-2 ms-1" />
                          {course.category_name}
                        </small>
                      </div>
                      <div className="d-flex border-top">
                        <small className="flex-fill text-center border-end py-2 mt-2">
                          <i className="fa fa-user-tie text-primary me-2 ms-1" />
                          {course.publisher_name}
                        </small>
                      </div>
                    </div>
                    <div className="p-4 pt-0 d-flex justify-content-center card-footer">
                      <Link to={`/CourseDetails/${course.course_id}`} className="btn-primary my-button  ms-2 mt-3">
                        المزيد عن الدورة
                      </Link>

                        <button
                          className="btn-primary my-button mt-3"
                          onClick={() => handleAddToCart(course)}
                          disabled={enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id)}>
                          {enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id) ? 'لقد تم الإضمام لها مسبقاً' : 'الإنضمام للدورة'}
                        </button>
                    </div>
                  </div>
                </div>
              ))) : (<div className='mt-5 text-center'>
                لا يوجد دورات في هذا التخصص لحد الأن
              </div>)}
          </div>
        </div>
      </div>


      <div className="d-flex justify-content-center">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            {currentCourses.length > 0 ? pageNumbers.map((pageNumber) => (
              <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            )): null}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Courses;