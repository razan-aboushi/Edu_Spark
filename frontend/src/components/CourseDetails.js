import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUniversity, FaDollarSign, FaInfoCircle, FaCalendarAlt, FaUser, FaUserFriends, FaEnvelope, FaFacebook, FaLinkedin, FaArtstation, } from 'react-icons/fa';
import axios from 'axios';
import '../css/style.css';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

function CourseDetails() {
  const [course, setCourse] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { course_id } = useParams();

  const navigate = useNavigate();



  // get enrolled courses
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




  // Handle add the course to cart
  const handleAddToCart = async (course) => {
    const token = localStorage.getItem('token');

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
          <img src="http://localhost:4000/images/${course.course_image}" alt="course Image" className="popup-image" width="265px">
          <p className="popup-title">عنوان الدورة: ${course.course_title}</p>
          <p className="popup-price">السعر: ${course.course_price === "0" ? "مجاني" : `${course.course_price} د.أ`}</p>
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

  // get the course details and the count or number of subscribers in this course
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:4000/courses/${course_id}`);
        setCourse(courseResponse.data);

        const subscriberResponse = await axios.get(`http://localhost:4000/courses/${course_id}/subscribers`);
        setSubscriberCount(subscriberResponse.data.subscriberCount);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [course_id]);


  if (!course) {
    return <div className='m-5'>في إنتظار تحميل تفاصيل الدورة ، إنتظر قليلاً من فضلك ...</div>;
  }

  const startDate = new Date(course.start_date).toLocaleDateString();
  const endDate = new Date(course.end_date).toLocaleDateString();

  return (
    <div className="course-card-grid d-flex justify-content-center">
      <Card className="course-card p-1">
        <Card.Img
          src={`http://localhost:4000/images/${course.course_image}`}
          alt="Course Image"
          style={{
            width: "100%",
            backgroundSize: "cover",
            height: "390px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" 
          }}
        />
        <Card.Body className="course-body p-3 m-0">
          <Card.Title className="course-title">{course.course_title}</Card.Title>
          <Card.Text className="course-publisher">
            <FaUser /> الناشر: {course.course_publisher}
          </Card.Text>
          <Card.Text className="course-university">
            <FaUniversity /> الجامعة: {course.university_name}
          </Card.Text>
          <Card.Text className="course-category">
            التخصص: {course.category_name}
          </Card.Text>
          <Card.Text className="course-price">
            <FaDollarSign /> السعر: {course.course_price === "0" ? (
              <span style={{ color: 'green' }}>مجاني</span>
            ) : (
              <span>
                {course.course_price} د.أ
              </span>
            )}
          </Card.Text>
          <Card.Text className="course-date">
            <FaCalendarAlt /> تاريخ الدورة: {startDate} - {endDate}
          </Card.Text>
          <Card.Text className="course-date">
            <FaCalendarAlt /> وقت الدورة: {course.start_time} - {course.end_time}
          </Card.Text>
          <Card.Text className="course-subscribers">
            <FaUserFriends /> عدد المشتركين: {subscriberCount}
          </Card.Text>
          <Card.Text className="course-subscribers mb-3">

            <FaInfoCircle /> نوع الدورة: {course.course_type}
          </Card.Text>
          <div className="course-description-wrapper">
            <Card.Text className="course-description">
              <span>  <FaArtstation /> وصف الدورة : {course.course_description}</span>
            </Card.Text>
          </div>
          <div className="social-icons mt-5">
            تواصل معي من خلال  :
            <a href={`mailto:${course.email}`}>
              <FaEnvelope style={{ fontSize: '25px' }} />
            </a>
            <a href={course.facebook_link}>
              <FaFacebook style={{ fontSize: '25px' }} />
            </a>
            <a href={course.linkedin_link}>
              <FaLinkedin style={{ fontSize: '25px' }} />
            </a>
          </div>
          <button
            className="join-button mt-4"
            onClick={() => handleAddToCart(course)}
            disabled={enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id)}
          >
            {enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id) ? 'تم الإنضمام لها مسبقاً' : 'الإنضمام للدورة'}
          </button>
        </Card.Body>

      </Card>
    </div>


  );
}

export default CourseDetails;