import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

function CoursesHome() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const { user_id } = useParams();
  useEffect(() => {
    // Fetch latest courses
    axios
      .get('http://localhost:4000/courses/latest')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error(error);
      });


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

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  };

  const navigate = useNavigate();

  // const handleContinuePayment = () => {
  //   navigate('/checkoutPayment');
  // };

  const handleAddToCart = (course) => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;

    // Use the user_id to save the course to the user's cart
    const newItem = {
      user_id: user_id,
      course_id: course.course_id,
      course_title: course.course_title,
      course_price: course.course_price,
      course_image: course.course_image,
      quantity: 1,
      type: 'course'
    };

    // Get the existing cart items from local storage or initialize an empty array
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the current course already exists in the cart
    const existingItemIndex = existingCartItems.findIndex((item) => item.course_id === course.course_id);

    if (existingItemIndex !== -1) {
      // If the item already exists, show a message that it is already in the cart
      Swal.fire({
        title: 'هذه الدورة موجودة بالفعل في السلة و لقد تم الإنضمام لها مسبقًا، تأكد من استكمال عملية الدفع',
        icon: 'info',
        confirmButtonText: 'متابعة',
      });
    } else {
      // If the item doesn't exist, add it to the cart with a quantity of 1
      existingCartItems.push(newItem);

      // Store the updated cart items back to local storage
      localStorage.setItem('cartItems', JSON.stringify(existingCartItems));

      Swal.fire({
        title: 'تمت إضافة الدورة إلى السلة',
        html: `
          <img src="http://localhost:4000/images/${course.course_image}" alt="Summary Image" className="popup-image" width="265px">
          <p className="popup-title">عنوان الدورة: ${course.course_title}</p>
          <p className="popup-price">السعر: ${course.course_price} JD</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'متابعة الدفع',
        showLoaderOnConfirm: true,
        // preConfirm: () => {
        //   handleContinuePayment();
        // },
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

  return (
    <div className="container py-5 mt-5" style={{ marginTop: '70px' }}>
      {/* Render courses */}
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
          الدورات الدراسية
        </h6>
      </div>
      <div className="row g-4 justify-content-center mt-3">
        {courses.map(course => (
          <div
            className="col-lg-4 col-md-6 course-card wow fadeInUp"
            data-wow-delay="0.1s"
            key={course.course_id}
          >
            <div className="course-item bg-light">
              <div className="position-relative overflow-hidden">
                <img
                  className="img-fluid course-image"
                  src={`http://localhost:4000/images/${course.course_image}`}
                  alt="صورة الدورة الدراسية"
                />
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
              </div>
              <div className="d-flex border-top">
                <small className="flex-fill text-center border-end py-2 mt-2">
                  <i className="fa fa-user-tie text-primary me-2 ms-1" />
                  {course.course_publisher}
                </small>
              </div>
              <div className="card-footer">
                <button
                  className="btn-primary my-button"
                  id="download-btn me-1"
                  onClick={() => handleAddToCart(course)}
                  disabled={enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id)}
                >
                  {enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id) ? 'تم الإنضمام لها مسبقاَ' : 'الإنضمام للدورة'}
                </button>


                <HashLink to={`/CourseDetails/${course.course_id}`}>
                  <button className="btn-primary my-button me-1 ms-1">
                    تفاصيل أكثر
                  </button>
                </HashLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesHome;
