import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUniversity,
  FaDollarSign,
  FaInfoCircle,
  FaCalendarAlt,
  FaUserFriends,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
} from 'react-icons/fa';
import axios from 'axios';
import '../css/style.css';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';


const CourseDetails = () => {
  const [course, setCourse] = useState([]);
  const { course_id } = useParams();
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user_id } = useParams();


  const navigate = useNavigate();






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










  // Add course to item , but after log in the website


  const handleAddToCart = async (course) => {
    const token = localStorage.getItem('token');
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
        type:'course'
      });

      Swal.fire({
        title: 'تمت إضافة الدورة إلى السلة',
        html: `
          <img src="http://localhost:4000/images/${course.course_image}" alt="course Image" className="popup-image" width="265px">
          <p className="popup-title">عنوان الدورة: ${course.course_title}</p>
          <p className="popup-price">السعر: ${course.course_price} JD</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'متابعة الدفع',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        customClass: {
          confirmButton: 'swal-close-button',
        },
      }).then(async (result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Remove the cart items from the server if the user cancels the payment
          await axios.delete(`http://localhost:4000/cart/${user_id}/${course.course_id}`);

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
    <div className="d-flex justify-content-center align-items-center">
      <Card className="course-card p-1">
        <Row>
          <Col md={8}>
            <Card.Body className="course-body p-3 m-0">
              <Card.Title className="course-title">{course.course_title}</Card.Title>
              <Card.Text className="course-publisher">
                <FaInfoCircle /> الناشر: {course.course_publisher}
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
                <FaUserFriends /> عدد المشتركين :
                {subscriberCount}
              </Card.Text>
              <div className="course-description-wrapper">
                <Card.Text className="course-description">
                  <p>{course.course_description}</p>
                </Card.Text>
              </div>
              <div className="social-icons">
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
              <button className="join-button mt-4" onClick={() => handleAddToCart(course)}
                disabled={enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id)}

              >
                {enrolledCourses.some((enrolledCourse) => enrolledCourse.course_id === course.course_id) ? 'تم الإنضمام لها مسبقاَ' : 'الإنضمام للدورة'}
              </button>
            </Card.Body>
          </Col>
          <Col md={4}>
            <Card.Img
              src={`http://localhost:4000/images/${course.course_image}`}
              alt="Course Image"
              className="course-image"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CourseDetails;
