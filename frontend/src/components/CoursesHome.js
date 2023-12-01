import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

function CoursesHome() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();


  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;




  useEffect(() => {
    // get the latest three courses
    axios.get('http://localhost:4000/courses/latestHome').then(response => {
      setCourses(response.data);
    }).catch(error => {
      console.error(error);
    });


    // get enrolled courses to check if the user register in it or not
    const fetchEnrolledCourses = async () => {

      try {
        const response = await axios.get(`http://localhost:4000/enrolled-courses/${user_id}`);
        setEnrolledCourses(response.data);
      } catch (error) {
        console.log('Error fetching enrolled courses:', error);
      }
    };

    fetchEnrolledCourses();
  }, [user_id]);


  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  };


  // Handle add course to cart
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
      console.log(response);
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
          <img src="http://localhost:4000/images/${course.course_image}" alt="course Image" class="popup-image" width="265px">
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





  return (
    <div className="container py-5 mt-5" style={{ marginTop: '100px' }}>
      {/* Render courses */}
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
          الدورات الدراسية
        </h6>
      </div>
      <div className="d-flex row g-3 justify-content-center mt-3">
        {courses.map(course => (
          <div
            className="col-lg-4 col-md-6 course-card wow fadeInUp"
            data-wow-delay="0.1s"
            key={course.course_id}>
            <div className="course-item bg-light">
              <div className="position-relative overflow-hidden">
                <img
                  className="course-image"
                  src={`http://localhost:4000/images/${course.course_image}`}
                  alt="صورة الدورة الدراسية" width="100%"  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}/>
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