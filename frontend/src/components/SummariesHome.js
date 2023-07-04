import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';


function SummariesHome() {
  const [summaries, setSummaries] = useState([]);
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
    axios
      .get('http://localhost:4000/summaries/latest')
      .then(response => {
        setSummaries(response.data);
      })
      .catch(error => {
        console.error('Error fetching summaries:', error);
      });
  }, []);



  const navigate = useNavigate();

  // const handleContinuePayment = () => {
  //   navigate('/checkoutPayment');
  // };




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
    <div className="container mb-5" style={{ marginTop: '150px' }}>
      {/* Render summaries */}
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
          الملخصات الدراسية
        </h6>
      </div>
      <div className="row mt-5">
        {summaries.map(summary => (
          <div className="col-lg-4 col-md-6" key={summary.summary_id}>
            {/* Render summary details */}
            <div className="cardSum" style={{ width: "100%", height: "680px" }}>
              <Link to="/Summaries" className="icon d-flex align-items-center justify-content-center">
                <img
                  src={`http://localhost:4000/images/${summary.summary_image}`}
                  className="card-img-top"
                  alt="صورة الملخص" width="100%" height="280px"
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{summary.summary_title}</h5>
                <p className="card-text">{summary.summary_brief}</p>
                <ul className="list-group list-group-flush">
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
                    {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مسبقاً' : 'شراء المُلخص'}
                  </button>
                  <Link to={`/SummaryDetails/${summary.summary_id}`}>
                    <button className="btn-primary my-button me-1"> تفاصيل أكثر</button>
                  </Link>

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
