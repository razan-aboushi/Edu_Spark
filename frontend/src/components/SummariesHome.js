import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from "react-router-hash-link";
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';


function SummariesHome() {
  const [summaries, setSummaries] = useState([]);
  const [enrolledSummaries, setEnrolledSummaries] = useState([]);
  const navigate = useNavigate();


  // Get the enrolled summaries to check if the user buy the summary before now or not
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




  // Get the latest summaries added in the website
  useEffect(() => {
    axios.get('http://localhost:4000/summaries/latest').then(response => {
      setSummaries(response.data);
    }).catch(error => {
      console.error('Error fetching summaries:', error);
    });
  }, []);




  // Handle add to cart function
  const handleAddToCart = async (summary) => {
    const token = localStorage.getItem('token');


    if (!token) {
      // If the user is not logged in, show a message asking them to log in first.
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
          title: 'المُلخص موجود بالفعل بالسلة',
          icon: 'info',
          confirmButtonText: 'موافق',
        });
        return;
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
          <img src="http://localhost:4000/images/${summary.summary_image}" alt="Summary" className="popup-image" width="265px">
          <p className="popup-title">عنوان المُلخص: ${summary.summary_title}</p>
          <p className="popup-price">السعر: ${summary.summary_price === "0" ? "مجاني" : `${summary.summary_price} د.أ`}</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'موافق',
        cancelButtonText: 'إلغاء',

        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        customClass: {
          confirmButton: 'swal-close-button',
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          // Remove the cart items if the user cancels the payment
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




  return (
    <div className="container mb-5" style={{ marginTop: '120px' }}>
      {/* Render summaries */}
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
          المُلخصات الدراسية
        </h6>
      </div>
      <div className="row mt-5">
        {summaries.map(summary => (
          <div className="col-lg-4 col-md-6 mb-3" key={summary.summary_id}>
            {/* Render summary details */}
            <div className="cardSum">
              <Link to="/Summaries" className="icon d-flex align-items-center justify-content-center">
                <img
                  src={`http://localhost:4000/images/${summary.summary_image}`}
                  className="card-img-top"
                  alt="صورة المُلخص" width="100%" height="280px" />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{summary.summary_title}</h5>
                <p className="card-text">{summary.summary_brief}</p>
                <ul className="list-group1 list-group-flush">
                  <li className="list-group-item" id="priceOfSum">
                    السعر: {summary.summary_price === "0" ? (
                      <span style={{ color: 'green' }}>مجاني</span>
                    ) : (
                      <span>{summary.summary_price} د.أ</span>
                    )}                  </li>
                  <li className="list-group-item">التخصص: {summary.category_name}</li>
                  <li className="list-group-item">الجامعة: {summary.university_name}</li>
                  <li className="list-group-item">الناشر: {summary.summary_publisher}</li>
                </ul>
                <div className="card-footer">
                  <button className="btn-primary my-button me-1" onClick={() => handleAddToCart(summary)}

                    disabled={enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id)}>
                    {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مُسبقاً' : 'شراء المُلخص'}
                  </button>

                  <HashLink to={`/SummaryDetails/${summary.summary_id}`}>
                    <button className="btn-primary my-button me-1"> تفاصيل أكثر</button>
                  </HashLink>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummariesHome;