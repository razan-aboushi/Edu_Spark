import React, { useState, useEffect } from 'react';
import { FaSignInAlt, FaInfoCircle, FaMoneyBill, FaUser, FaCalendarAlt, FaSearch } from 'react-icons/fa';
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
  const { user_id } = useParams();




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
        setCourses(response.data);
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

  const navigate = useNavigate();

  const handleContinuePayment = () => {
    navigate('/checkoutPayment');
  };

  const handleAddToCart = (item, itemType) => {
    // Function to handle adding an item to the cart
    // Extracting user ID from the decoded token stored in localStorage
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;

    // Creating a new item object
    const newItem = {
      user_id: user_id,
      [`${itemType}_id`]: item[`${itemType}_id`],
      [`${itemType}_title`]: item[`${itemType}_title`],
      [`${itemType}_price`]: item[`${itemType}_price`],
      [`${itemType}_image`]: item[`${itemType}_image`],
      quantity: 1,
      type: itemType
    };

    // Retrieving existing cart items from localStorage or initializing an empty array
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Checking if the item already exists in the cart
    const existingItemIndex = existingCartItems.findIndex((existingItem) => existingItem[`${itemType}_id`] === newItem[`${itemType}_id`]);

    if (existingItemIndex !== -1) {
      // Item already exists in the cart, display an alert
      Swal.fire({
        title: `هذا ${itemType} موجود بالفعل في السلة. يرجى استكمال عملية الدفع.`,
        icon: 'info',
        confirmButtonText: 'متابعة',
      });
    } else {
      // Item does not exist in the cart, add it to the cart and display an alert
      existingCartItems.push(newItem);
      localStorage.setItem('cartItems', JSON.stringify(existingCartItems));

      Swal.fire({
        title: `تمت إضافة ${itemType.charAt(0).toUpperCase() + itemType.slice(1)} إلى السلة`,
        html: `
          <img src="http://localhost:4000/images/${item[`${itemType}_image`]}" alt="صورة ${itemType}" className="popup-image" width="265px">
          <p className="popup-title">${item[`${itemType}_title`]}</p>
          <p className="popup-price">السعر: ${item[`${itemType}_price`]} د.أ</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'متابعة الدفع',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          handleContinuePayment();
        },
        allowOutsideClick: () => !Swal.isLoading(),
        customClass: {
          confirmButton: 'swal-close-button',
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          localStorage.removeItem('cartItems');
        }
      });
    }
  };

  const convertDateFormate = (timestamp) => {
    // Function to convert a timestamp to a formatted date string
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleSearch = (query) => {
    // Function to handle search query changes
    setSearchQuery(query);
  };

  useEffect(() => {
    // useEffect hook to perform search when the searchQuery state changes
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        console.log('Perform search with query:', searchQuery);
        search();
      }
    }, 100);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const search = async () => {
    // Function to perform the search
    try {
      const response = await axios.get(`http://localhost:4000/search/${searchQuery}`);
      const { courses: searchCourses, summaries: searchSummaries } = response.data;

      setCourses(searchCourses);
      setSummaries(searchSummaries);
    } catch (error) {
      console.log(error);
    }
  };
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
                placeholder="ابحث عن الملخصات والدورات..."
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
          {courses.map((course, index) => (
            <div className="courseCat-card p-3 shadow mb-4 m-4 mx-3" key={index} style={{ width: '400px', height: '640px' }}>
              <img className="shadow" src={`http://localhost:4000/images/${course.course_image}`} alt="Course" width="100%" height="280px" />
              <h4>{course.course_title}</h4>
              <p>{course.course_brief}</p>
              <p>
                <FaMoneyBill className="icon" />


                السعر: {course.course_price === "0" ? (
                  <span style={{ color: 'green' }}>مجاني</span>
                ) : (
                  <span>{course.course_price} د.أ</span>
                )}


              </p>
              <p>
                <FaCalendarAlt className="icon" /> التاريخ : {convertDateFormate(course.start_date)} -{' '}
                {convertDateFormate(course.end_date)}
              </p>
              <p>
                <FaUser className="icon" /> الناشر: {course.publisher_name}
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



      <h3 className="text-center mt-5">المُلخصات</h3>
      {summaries.length === 0 ? (
        <p className="text-center">لا توجد مُلخصات حتى الآن.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center mt-5">
          {summaries.map((summary, index) => (
            <div className="summary-card p-3 shadow m-4 mb-4 mx-3" key={index} style={{ width: '400px', height: '650px' }}>
              <img className="shadow" src={`http://localhost:4000/images/${summary.summary_image}`} alt="Summary" width="100%" height="280px" />
              <h4>{summary.summary_title}</h4>
              <p>{summary.summary_brief}</p>
              <p>
                <FaMoneyBill className="icon" />
                السعر: {summary.summary_price === "0" ? (
                  <span style={{ color: 'green' }}>مجاني</span>
                ) : (
                  <span>{summary.summary_price} د.أ</span>
                )}            </p>
              <p>
                <FaUser className="icon" /> الناشر: {summary.publisher_name}
              </p>
              <div className="button-section d-flex justify-content-center">
                <button className="join-course-btn buttonInAddArticle ms-3" onClick={() => handleAddToCart(summary, 'summary')}
                 disabled={enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id)}> 
                  <FaMoneyBill className="button-icon" /> 
                  {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مسبقاً' :  'شراء المُلخص'}
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

    </div>
  );
}

export default CoursesAndSummaries;
