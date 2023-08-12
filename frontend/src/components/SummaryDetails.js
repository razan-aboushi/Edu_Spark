import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaUniversity, FaDollarSign, FaInfoCircle, FaEnvelope, FaFacebook, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/style.css';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';



function SummaryDetails()
 {
  const [summary, setSummary] = useState(null);
  const [enrolledSummaries, setEnrolledSummaries] = useState([]);
  const { summaryId } = useParams();
  const navigate = useNavigate();


// get the summary from the summary enrollment table to check if the user buy this summary before now or nots the 
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



// Get the summary details
  useEffect(() => {
    const getSummaryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/summariesDetails/${summaryId}`);
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary details:', error);
      }
    };

    getSummaryDetails();
  }, [summaryId]);




  const handleAddToCart = async (summary) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // If the user is not logged in, show a pop-up message asking them to log in first.
      Swal.fire({
        title: 'من فضلك ، قُم بتسجيل الدخول لتتمكن من شراءِ المُلخص ',
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
        // Check if the summary already exists in the cart table
        const response = await axios.get(`http://localhost:4000/cart/${user_id}/${summary.summary_id}`);
        if (response.data.exists) {
          Swal.fire({
            title: 'الملخص موجود بالفعل بالسلة',
            icon: 'info',
            confirmButtonText: 'موافق',
          });
          return; // Exit the function if the summary is already in the cart
        }


        // Send a request to the server to add the summary to the cart table
        await axios.post('http://localhost:4000/cart', {
          user_id: user_id,
          summary_id: summary.summary_id,
          summary_title: summary.summary_title,
          summary_price: summary.summary_price,
          summary_image: summary.summary_image,
          type: 'summary'
        });


        Swal.fire({
          title: 'تمت إضافة المُلخص إلى السلة',
          html: `
          <img src="http://localhost:4000/images/${summary.summary_image}" alt="Summary Image" className="popup-image" width="265px">
          <p className="popup-title">عنوان الملخص: ${summary.summary_title}</p>
          <p className="popup-price">السعر: ${summary.summary_price} JD</p>
        `,
          showCancelButton: true,
          confirmButtonText: 'موافق',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
          customClass: {
            confirmButton: 'swal-close-button',
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            // Remove the cart items from the server if the user cancels the payment
            axios.delete(`http://localhost:4000/cartSummary/${user_id}/${summary.summary_id}`);


          }
        });
      
      } catch (error) {
        console.error('Error adding summary to cart:', error);
        Swal.fire({
          title: 'حدث خطأ أثناء إضافة المُلخص إلى السلة',
          icon: 'error',
          confirmButtonText: 'محاولة مرة أخرى',
        });
      }
    };




    if (!summary) 
    {
      return <div className="m-5">في إنتظار تحميل تفاصيل المُلخص، إنتظر قليلاً من فضلك ...</div>;
    }


    return (
      <div className="summary-card-grid d-flex justify-content-center">
      <Card className="course-card p-1">
      <Card.Img
          src={`http://localhost:4000/images/${summary.summary_image}`}
          alt="Course Image"
          className="course-image"  style={{width:"100%" , backgroundSize:"cover" ,height:"390px"}}
        />
        <Card.Body className="summaryDe-body">
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
              <span>{summary.summary_description}</span>
            </Card.Text>
          </div>
          <div className="social-icons mt-3">
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
          <button
            className="join-button mt-4"
            onClick={() => handleAddToCart(summary)}
            disabled={enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id)}>
            {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مسبقاً' : 'شراء المُلخص'}
          </button>
        </Card.Body>
        
      </Card>
    </div>
    
    );
  }

  export default SummaryDetails;