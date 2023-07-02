import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FaUniversity, FaDollarSign, FaInfoCircle, FaEnvelope, FaFacebook, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/style.css';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';




function SummaryDetails() {
  const [summary, setSummary] = useState(null);
  const { summaryId } = useParams();
  const [enrolledSummaries, setEnrolledSummaries] = useState([]);
  const { user_id } = useParams();






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











  useEffect(() => {
    const getSummaryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/summariesDetails/${summaryId}`);
        console.log(response);
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary details:', error);
      }
    };

    getSummaryDetails();
  }, []);

  const navigate = useNavigate();

  const handleContinuePayment = () => {
    navigate('/checkoutPayment');
  };




  const handleAddToCart = (summary) => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;
    // Use the user_id to save the summary to the user's cart
    const newItem = {
      user_id: user_id,
      summary_id: summary.summary_id,
      summary_title: summary.summary_title,
      summary_price: summary.summary_price,
      summary_image: summary.summary_image,
      quantity: 1,
      type: 'summary'
    };

    // Get the existing cart items from local storage or initialize an empty array
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Check if the current summary already exists in the cart
    const existingItemIndex = existingCartItems.findIndex((item) => item.summary_id === summary.summary_id);

    if (existingItemIndex !== -1) {
      // If the item already exists, show a message that it is already in the cart
      Swal.fire({
        title: 'هذا المُلخص موجود بالفعل في السلة، تأكد من استكمال عملية الدفع',
        icon: 'info',
        confirmButtonText: 'متابعة',
      });
    } else {
      // If the item doesn't exist, add it to the cart with a quantity of 1
      existingCartItems.push(newItem);

      // Store the updated cart items back to local storage
      localStorage.setItem('cartItems', JSON.stringify(existingCartItems));

      Swal.fire({
        title: 'تمت إضافة المُلخص إلى السلة',
        html: `
            <img src="http://localhost:4000/images/${summary.summary_image}" alt="Summary Image" className="popup-image" width="265px">
            <p className="popup-title">عنوان الملخص: ${summary.summary_title}</p>
            <p className="popup-price">السعر: ${summary.summary_price} JD</p>
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






  if (!summary) {
    return <div className="m-5">في إنتظار تحميل تفاصيل الملخص، إنتظر قليلاً من فضلك ...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="course-card p-1">
        <Row>
          <Col md={8}>
            <Card.Body className="summaryDe-body ">
              <Card.Title className="course-title">{summary.summary_title}</Card.Title>
              <Card.Text className="course-publisher">
                <FaInfoCircle /> الناشر: {summary.summary_publisher}
              </Card.Text>
              <Card.Text className="course-university">
                <FaUniversity /> الجامعة: {summary.university_name}
              </Card.Text>
              <Card.Text className="course-category">التخصص: {summary.category_name}</Card.Text>
              <Card.Text className="course-price">
                <FaDollarSign /> السعر: {summary.summary_price === "0" ? (
                  <span style={{ color: 'green' }}>مجاني</span>
                ) : (
                  <span>
                    {summary.summary_price} د.أ
                  </span>
                )}
              </Card.Text>
              <div className="course-description-wrapper">
                <Card.Text className="course-description">
                  <p>{summary.summary_description}</p>
                </Card.Text>
              </div>
              <div className="social-icons">
                تواصل معي من خلال : 
                <a href={`mailto:${summary.email}`}>
                  <FaEnvelope style={{ fontSize: '25px' }} />
                </a>
                <a href={summary.facebook_link}>
                  <FaFacebook style={{ fontSize: '25px' }} />
                </a>
                <a href={summary.linkedin_link}>
                  <FaLinkedin style={{ fontSize: '25px' }} />
                </a>
              </div>
              <button className="join-button mt-5" onClick={() => handleAddToCart(summary)}
                 disabled={enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id)}> 
                 {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مسبقاً' :  'شراء المُلخص'}
              </button>
            </Card.Body>
          </Col>
          <Col md={4}>
            <Card.Img
              src={`http://localhost:4000/images/${summary.summary_image}`}
              alt="Course Image"
              className="course-image"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default SummaryDetails;
