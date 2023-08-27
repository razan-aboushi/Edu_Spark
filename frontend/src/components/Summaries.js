import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import axios from 'axios';
import '../css/style.css';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

function Summaries() {
  const [summaries, setSummaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [universityFilter, setUniversityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [universities, setUniversities] = useState([]);
  const [enrolledSummaries, setEnrolledSummaries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [summariesPerPage] = useState(6);
  const navigate = useNavigate();


  useEffect(() => {
    getUniversities();
  }, []);

  useEffect(() => {
    handleInputChange();
  }, []);




  // Get the summaries that the user byu to check if the user buy it before now or not
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



  // Get the universities in dropdown list
  const getUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:4000/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };



  // Handle the change of the dropdown list of the university and category
  const handleInputChange = (event = {}) => {
    const { name, value } = event.target || {};

    if (name === 'summary_university') {
      setUniversityFilter(value);

      const universityId = parseInt(value);
      axios.get(`http://localhost:4000/universities/${universityId}/categories`).then((response) => {
        setCategories(response.data);
      }).catch((error) => {
        console.error(error);
      });
    }

    if (name === 'category') {
      setCategoryFilter(value);
    }
  };


  // Get all summaries in the summary page
  useEffect(() => {
    const getSummaries = async () => {
      try {
        const response = await axios.get('http://localhost:4000/summaries');
        setSummaries(response.data);
      } catch (error) {
        console.error('Error fetching summaries:', error);
      }
    };

    getSummaries();
  }, []);




  // Make filters on the summaries
  const filteredSummaries = summaries.filter((summary) => {

    const matchName = summary.summary_title && summary.summary_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPublisher = summary.summary_publisher && summary.summary_publisher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUniversity = universityFilter === '' || summary.university_id === parseInt(universityFilter);
    const matchCategory = summary.category_name.toLowerCase().includes(categoryFilter.toLowerCase());

    return (matchName || matchPublisher) && matchUniversity && (matchCategory || categoryFilter === '');
  });



  // Render the summaries in the page based on pagination
  const indexOfLastSummary = currentPage * summariesPerPage;
  const indexOfFirstSummary = indexOfLastSummary - summariesPerPage;
  const currentSummaries = filteredSummaries.slice(indexOfFirstSummary, indexOfLastSummary);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };




  // Handle add to cart function
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
          <img src="http://localhost:4000/images/${summary.summary_image}" alt="Summary Image" className="popup-image mb-5" width="265px">
          <p className="popup-title mt-3">عنوان الملخص: ${summary.summary_title}</p>
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


  // Mathe the page numbers for pagination
  const pageNumbers = [];
  for (let r = 1; r <= Math.ceil(filteredSummaries.length / summariesPerPage); r++) {
    pageNumbers.push(r);
  }


  return (
    <div>
      {/* Header Start */}
      <div className="container-fluid bg-primary py-5 mb-5 page-headerSummary" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">المُلخصات</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    المُلخصات
                  </li>
                  <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                    <Link className="text-white">
                      التصنيفات
                    </Link>
                  </Breadcrumbs>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}


      {/* Search Bar and Filters */}
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="ابحث بإسم المُلخص أو الناشر"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="col-lg-4">
            <select
              className="form-select"
              name="summary_university"
              value={universityFilter}
              onChange={handleInputChange}>
              <option value="">كل الجامعات</option>
              {universities.map((university) => (
                <option key={university.university_id} value={university.university_id}>
                  {university.university_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-4">
            <select
              className="form-select"
              name="category"
              value={categoryFilter}
              onChange={handleInputChange}>
              <option value="">كل التخصصات</option>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.category_id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))
              ) : (
                <option value=""> "إختر جامعة " تحميل التخصصات...</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Summaries */}
      <div className="container">
        <div className="row">
          {currentSummaries.length > 0 ? (
            currentSummaries.map((summary) => (
              <div className="col-lg-4 col-md-6 col-sm-12 mt-3" key={summary.summary_id}>
                <div className="cardSummaries">
                  <img
                    src={`http://localhost:4000/images/${summary.summary_image}`}
                    className="card-img-top shadow"
                    alt="Summary" width="100%" height="265px"
                  />
                  <div className="card-body text-right p-0">
                    <h5 className="card-title">{summary.summary_title}</h5>
                    <p className="card-text">{summary.summary_brief}</p>
                    <ul className="list-group list-group-flush p-0">
                      <li className="list-group-item" id="priceOfSum">
                        <i className="bi bi-cash-stack ms-2"></i>


                        السعر: {summary.summary_price === "0" ? (
                          <span style={{ color: 'green' }}>مجاني</span>
                        ) : (
                          <span>{summary.summary_price} د.أ</span>
                        )}

                      </li>

                      <li className="list-group-item">
                        <i className="bi bi-bookmark-check ms-2"></i>
                        التخصص: {summary.category_name}
                      </li>
                      <li className="list-group-item">
                        <i className="bi bi-building ms-2"></i>
                        الجامعة: {summary.university_name}
                      </li>
                      <li className="list-group-item">
                        <i className="bi bi-person ms-2"></i>
                        الناشر: {summary.summary_publisher}
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer mt-3">
                    <Link className="btn btn-primary ms-3" to={`/SummaryDetails/${summary.summary_id}`}>
                      عرض التفاصيل
                    </Link>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAddToCart(summary)}
                      disabled={enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id)}>
                      {enrolledSummaries.some((enrolledSummaries) => enrolledSummaries.summary_id === summary.summary_id) ? 'لقد تمَّ شرائهُ مسبقاً' : 'شراء المُلخص'}
                    </button>
                  </div>
                </div>
              </div>
            ))) : (<div className='mt-5 text-center'>  لا يوجد مُلخصات في هذا التخصص لحد الأن  </div>)}
        </div>
      </div>


      {/* Pagination */}
      {summaries.length > summariesPerPage && (
        <div className="d-flex justify-content-center">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              {pageNumbers.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}


export default Summaries;