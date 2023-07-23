import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';


function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(9);
  const [universities, setUniversities] = useState([]);
  const [categories, setCategories] = useState([]);
  const { universityId } = useParams();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const { user_id } = useParams();


  useEffect(() => {
    getUniversities();
  }, []);

  useEffect(() => {
    handleInputChange();
  }, [universityId]);

  const getUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:4000/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };


  useEffect(() => {
    // Fetch enrolled courses
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = token ? jwt_decode(token) : null;
      const user_id = decodedToken?.userId;

      try {
        const response = await axios.get(`http://localhost:4000/enrolled-courses/${user_id}`);
        setEnrolledCourses(response.data);
      } catch (error) {
        console.log('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, []);




  const handleInputChange = (event = {}) => {
    const { name, value } = event.target || {};

    if (name === 'course_university') {
      setUniversityFilter(value);

      const universityId = parseInt(value);
      axios.get(`http://localhost:4000/universities/${universityId}/categories`)
        .then((response) => {
          console.log(response)
          setCategories(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (name === 'category') {
      setCategoryFilter(value);
    }
  };


  useEffect(() => {
    axios
      .get('http://localhost:4000/courses')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchName = course.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPublisher = course.publisher_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUniversity = universityFilter === '' || course.university_id === parseInt(universityFilter);
    const matchCategory = course.category_name.toLowerCase().includes(categoryFilter.toLowerCase());

    return (matchName || matchPublisher) && matchUniversity && (matchCategory || categoryFilter === '');
  });



  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUniversityFilterChange = (e) => {
    setUniversityFilter(e.target.value);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCourses.length / coursesPerPage); i++) {
    pageNumbers.push(i);
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  };

  const navigate = useNavigate();



  const handleAddToCart = async (course) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // If the user is not logged in, show a pop-up message asking them to log in first.
      Swal.fire({
        title: 'سجل الدخول لتتمكن من التسجيل في الدورة',
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


    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;

    try {
      // Check if the course already exists in the cart table
      const response = await axios.get(`http://localhost:4000/cartCourse/${user_id}/${course.course_id}`);
      console.log(response);
      if (response.data.exists) {
        Swal.fire({
          title: 'الدورة موجود بالفعل بالسلة',
          icon: 'info',
          confirmButtonText: 'موافق',
        });
        return; // Exit the function if the course is already in the cart
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
          <img src="http://localhost:4000/images/${course.course_image}" alt="course Image" className="popup-image" width="265px">
          <p className="popup-title">عنوان الدورة: ${course.course_title}</p>
          <p className="popup-price">السعر: ${course.course_price} JD</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'موافق',
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
            title: 'تم إلغاء الطلب بنجاح',
            icon: 'success',
            confirmButtonText: 'موافق',
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };



  const shouldDisplayPagination = filteredCourses.length > coursesPerPage;



  return (
    <>
      {/* Header Start */}
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
                    <Link className="text-white">
                      التصنيفات
                    </Link>
                  </Breadcrumbs>
                  <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                    <Link className="text-white" to="/">
                      الصفحة الرئيسية
                    </Link>
                  </Breadcrumbs>


                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}
      {/* Filter and Search Bar */}
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
              onChange={handleInputChange}
            >
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
              onChange={handleInputChange}
            >
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

      {/* Courses section Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {filteredCourses.map((course) => (
              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
                key={course.course_id}
              >
                <div className="course-item bg-light shadow-sm rounded">
                  <div className="position-relative overflow-hidden">
                    <img className="img-fluid" src={`http://localhost:4000/images/${course.course_image}`} alt="an image of course" />
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
                    <Link>
                      <button className="btn-primary my-button mt-3" id="download-btn me-1" onClick={() => handleAddToCart(course)}
                        disabled={enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id)} >
                        {enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id) ? 'تم الإنضمام لها مسبقاَ' : 'الإنضمام للدورة'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Courses section End */}


      {/* Pagination Start */}
      {shouldDisplayPagination && (
        <div className="container mt-5">
          <ul className="pagination justify-content-center">
            {pageNumbers.map((number) => (
              <li
                key={number}
                className={`page-item ${currentPage === number ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(number)}
                  style={{ borderRadius: "80%", paddingLeft: "15px", paddingRight: "15px" }}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Pagination End */}
    </>
  );
}

export default Courses;
