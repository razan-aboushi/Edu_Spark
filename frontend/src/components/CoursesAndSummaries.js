import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaInfoCircle, FaMoneyBill, FaUser, FaCalendarAlt } from 'react-icons/fa';
import '../css/style.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';


function CoursesAndSummaries() {
  const { university_id, category_id } = useParams();

  const [courses, setCourses] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolledSummaries, setEnrolledSummaries] = useState([]);
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [currentSummaryPage, setCurrentSummaryPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();




  // Get the summaries that the user joined to check if the user join this course before now or not
  useEffect(() => {
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



  // Get the summaries that the user purchase to check if the user buy then before now or not
  useEffect(() => {
    const fetchEnrolledSummaries = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = token ? jwt_decode(token) : null;
      const user_id = decodedToken?.userId;

      try {
        const response = await axios.get(`http://localhost:4000/enrolled-summaries/${user_id}`);
        setEnrolledSummaries(response.data);
      } catch (error) {
        console.log('Error fetching enrolled summaries:', error);
      }
    };

    fetchEnrolledSummaries();
  }, []);




  // useEffect hook to fetch courses based on university and category IDs
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/coursesByCategory/${university_id}/${category_id}`);

        // Filter out courses that have ended
        const currentDate = new Date();
        const activeCourses = response.data.filter(course => new Date(course.end_date) >= currentDate);

        setCourses(activeCourses);
      } catch (error) {
        console.log(error);
      }
    };

    getCourses();
  }, [university_id, category_id]);




  // useEffect hook to fetch summaries based on university and category IDs
  useEffect(() => {
    const getSummaries = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/summariesByCategory/${university_id}/${category_id}`);
        setSummaries(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getSummaries();
  }, [university_id, category_id]);




  const handleCoursePageChange = (pageNumber) => {
    setCurrentCoursePage(pageNumber);
  };

  const handleSummaryPageChange = (pageNumber) => {
    setCurrentSummaryPage(pageNumber);
  };



  const renderItems = (data, currentPage, renderFunction) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex).map(renderFunction);
  };




  // Pagination for the summary
  const totalCoursePages = Math.ceil(courses.length / itemsPerPage);
  const pageNumbersCourses = [];
  for (let r = 1; r <= totalCoursePages; r++) {
    pageNumbersCourses.push(r);
  }


  // Pagination for the summary
  const totalSummaryPages = Math.ceil(summaries.length / itemsPerPage);
  const pageNumbers = [];
  for (let r = 1; r <= totalSummaryPages; r++) {
    pageNumbers.push(r);
  }



  // Handle add summaries or courses to user cart 
  const handleAddToCart = async (item, itemType) => {
    const token = localStorage.getItem('token');


    if (!token) {
      // If the user is not logged in, show a message asking them to log in first.
      Swal.fire({
        title: 'من فضلك ، قُم بتسجيلِ الدخول لتتمكن من الشراء ',
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
      const response = await axios.get(`http://localhost:4000/checkCartItem/${user_id}/${itemType}/${item[`${itemType}_id`]}`);

      if (response.data.exists) {
        Swal.fire({
          title: `هذا ${itemType === "course" ? "الدورة" : "المُلخص"} موجود بالفعل في السلة. يرجى استكمال عملية الدفع.`,
          icon: 'info',
          confirmButtonText: 'متابعة',
        });
      } else {
        const newItem = {
          user_id: user_id,
          [`${itemType}_id`]: item[`${itemType}_id`],
          [`${itemType}_title`]: item[`${itemType}_title`],
          [`${itemType}_price`]: item[`${itemType}_price`],
          [`${itemType}_image`]: item[`${itemType}_image`],
          type: itemType
        };


        await axios.post(`http://localhost:4000/addToCart`, newItem);

        Swal.fire({
          title: `تمت إضافة ${itemType === "course" ? "الدورة" : "المُلخص"} إلى السلة`,
          html: `
            <img src="http://localhost:4000/images/${item[`${itemType}_image`]}" alt="صورة ${itemType}" class="popup-image mb-4" width="265px">
            <p class="popup-title mt-3">${item[`${itemType}_title`]}</p>
            <p class="popup-price">السعر: ${item[`${itemType}_price`] === "0" ? "مجاني" : item[`${itemType}_price`]} د.أ</p>
          `,
          showCancelButton: false,
          confirmButtonText: 'إضافة للسلة',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
        });


      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'حدث خطأ ما!',
      });
    }
  };




  // Function to convert a timestamp to a formatted date string
  const convertDateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };


  // Function to handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
  };



  // Filter courses and summaries based on search query
  const filteredCourses = courses.filter(course =>
    course.course_title.toLowerCase().includes(searchQuery.toLowerCase()) || course.publisher_name.toLowerCase().includes(searchQuery.toLowerCase()));


  const filteredSummaries = summaries.filter(summary =>
    summary.summary_title.toLowerCase().includes(searchQuery.toLowerCase()) || summary.publisher_name.toLowerCase().includes(searchQuery.toLowerCase()));




  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-3 page-headerSummariesCourses" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown"> المُلخصات و الدورات</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item text-white active" aria-current="page"></li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="ابحث عن المُلخصات والدورات..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-center mt-5">الدورات</h3>

      {courses.length === 0 ? (
        <p className="text-center">لا توجد دورات حتى الآن.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          {renderItems(filteredCourses, currentCoursePage, (course) => (
            <div className="courseCat-card p-3 shadow mb-4 m-4 mx-3" key={course.course_id} style={{ width: '400px', height: 'auto' }}>
              <img className="shadow" src={`http://localhost:4000/images/${course.course_image}`} alt="Course" width="100%" height="280px" />
              <h4 className='mt-2'>{course.course_title}</h4>
              <p>{course.course_brief}</p>
              <p>
                <FaMoneyBill className="icon ms-1" />


                السعر: {course.course_price === "0" ? (
                  <span style={{ color: 'green' }}>مجاني</span>
                ) : (
                  <span>{course.course_price} د.أ</span>
                )}


              </p>
              <p>
                <FaCalendarAlt className="icon ms-1" /> التاريخ : {convertDateFormat(course.start_date)} -{' '}
                {convertDateFormat(course.end_date)}
              </p>
              <p>
                <FaUser className="icon ms-1" /> الناشر: {course.publisher_name}
              </p>
              <div className="button-section d-flex justify-content-center">
                <button className="join-course-btn buttonInAddArticle ms-3" onClick={() => handleAddToCart(course, 'course')}
                  disabled={enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id)}>
                  <FaSignInAlt className="button-icon" />
                  {enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id) ? 'تم الإنضمام لها مسبقاَ' : 'الإنضمام للدورة'}
                </button>
                <Link to={`/CourseDetails/${course.course_id}`}>
                  <button className="details-btn buttonInAddArticle">
                    <FaInfoCircle className="button-icon" /> مزيد من التفاصيل
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}


      {totalCoursePages > 1 && (
        <ul className="pagination justify-content-center m-5">
          {pageNumbersCourses.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentCoursePage === pageNumber ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handleCoursePageChange(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      )}



      <h3 className="text-center mt-5">المُلخصات</h3>
      {summaries.length === 0 ? (
        <p className="text-center">لا توجد مُلخصات حتى الآن.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          {renderItems(filteredSummaries, currentSummaryPage, (summary) => (
            <div className="summary-card p-3 shadow m-4 mb-4 mx-3" key={summary.summary_id} style={{ width: '400px', height: 'auto' }}>
              <img className="shadow" src={`http://localhost:4000/images/${summary.summary_image}`} alt="Summary" width="100%" height="280px" />
              <h4 className='mt-2'>{summary.summary_title}</h4>
              <p>{summary.summary_brief}</p>
              <p>
                <FaMoneyBill className="icon ms-1" />
                السعر: {summary.summary_price === "0" ? (
                  <span style={{ color: 'green' }}>مجاني</span>
                ) : (
                  <span>{summary.summary_price} د.أ</span>
                )}            </p>
              <p>
                <FaUser className="icon ms-1" /> الناشر: {summary.publisher_name}
              </p>
              <div className="button-section d-flex justify-content-center">
                <button className="join-course-btn buttonInAddArticle ms-3" onClick={() => handleAddToCart(summary, 'summary')}
                  disabled={enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id)}>
                  <FaMoneyBill className="button-icon" />
                  {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مسبقاً' : 'شراء المُلخص'}
                </button>
                <Link to={`/SummaryDetails/${summary.summary_id}`}>
                  <button className="details-btn buttonInAddArticle">
                    <FaInfoCircle className="button-icon" /> مزيد من التفاصيل
                  </button>

                </Link>
              </div>
            </div>
          ))}
        </div>
      )}



      {totalSummaryPages > 1 && (
        <ul className="pagination justify-content-center">
          {pageNumbers.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentSummaryPage === pageNumber ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handleSummaryPageChange(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      )}


    </div>
  );
}

export default CoursesAndSummaries;