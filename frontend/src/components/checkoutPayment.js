import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

function CheckoutPayment() {
  const [tab, setTab] = useState('creditCard');
  const [focus, setFocus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [summariesId, setSummariesId] = useState([]);
  const [coursesId, setCoursesId] = useState([]);


  const [formData, setFormData] = useState({
    cvv: '',
    expiry: '',
    name: '',
    number: ''
  });

  const [phone_number, setFormDataOrange] = useState([]);


  useEffect(() => {
    // Check if the user is logged in
    const userLoggedIn = checkUserLoggedIn();
    setIsLoggedIn(userLoggedIn);
  }, []);

  // Function to check if the user is logged in
  function checkUserLoggedIn() {
    const token = localStorage.getItem('token');
    return token;
  }


  // get the user data to auto fill the phone number
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwt_decode(token);
          const user_id = decodedToken.userId;
          const response = await axios.get(`http://localhost:4000/user-profile/${user_id}`);
          // Fill in the phone number with the user's data
          setFormDataOrange(response.data.phone_number);

        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getUserProfile();
  }, []);




  // get the cart items in the cart
  async function fetchCartItems() {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = token ? jwt_decode(token) : null;
      const user_id = decodedToken?.userId;

      const response = await axios.get(`http://localhost:4000/getAllCartItems/${user_id}`);
      const cartItems = response.data;

      const transformedCartItems = cartItems.map(item => {
        if (item.course_id) {
          return {
            id: item.course_id,
            title: item.course_title,
            price: item.course_price,
            type: 'course'
          };
        } else {
          return {
            id: item.summary_id,
            title: item.summary_title,
            price: item.summary_price,
            type: 'summary'
          };
        }
      });

      setCartItems(transformedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }

  useEffect(() => {
    fetchCartItems();
  }, []);




  // Calculate sub-total
  const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
  // Calculate fees (15%)
  const fees = subtotal * 0.15;
  const total = subtotal + fees;





  // Handle the credit card form submit
  function handleFormSubmit(event) {
    event.preventDefault();

    if (!formData.number || !formData.name || !formData.expiry || !formData.cvv) {
      // Display an error message if any required fields are missing
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'يرجى ملء جميع الحقول المطلوبة',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate the expiration date
    const currentDate = new Date();
    const expiryParts = formData.expiry.split('/');
    const expiryMonth = parseInt(expiryParts[0]);
    const expiryYear = parseInt(expiryParts[1]);

    if (
      isNaN(expiryMonth) ||
      isNaN(expiryYear) ||
      expiryMonth < 1 ||
      expiryMonth > 12 ||
      expiryYear < currentDate.getFullYear() ||
      (expiryYear === currentDate.getFullYear() && expiryMonth < currentDate.getMonth() + 1)
    ) {
      // Display an error message for invalid expiration date
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'تاريخ الإنتهاء غير صالح',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    Swal.fire({
      title: 'تأكيد الطلب',
      text: `هل أنت متأكد أنك ترغب في متابعة عملية الدفع؟ المبلغ الإجمالي: ${total}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، استمر في الدفع',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        const summariesId = cartItems.filter((item) => item.type === 'summary').map((item) => item.id);

        const coursesId = cartItems.filter((item) => item.type === 'course').map((item) => item.id);

        setSummariesId(summariesId);
        setCoursesId(coursesId);

        const token = localStorage.getItem('token');
        const decodedToken = token ? jwt_decode(token) : null;
        const user_id = decodedToken?.userId;

        // Retrieve payment method ID based on the slug
        axios.get('http://localhost:4000/getPaymentMethodId', {
          params: {
            paymentMethodName: 'credit-card'
          }
        }).then((response) => {
          const payment_methods_id = response.data.id;

          // Insert transaction into the database
          axios.post(`http://localhost:4000/insertTransaction/${user_id}`, {
            payment_methods_id: payment_methods_id,
            date: new Date(),
            user_id: user_id,
            amount: total
          }).then((response) => {
            // Handle success response
            console.log(response.data);
          }).catch((error) => {
            // Handle error
            console.error(error);
          });

          // Send summariesId to backend to store in the summary enrollment table
          axios.post(`http://localhost:4000/storeSummariesEnrollment/${user_id}`, {
            summariesId: summariesId,
          }).then((response) => {
            // Handle success response
            console.log(response.data);
          }).catch((error) => {
            // Handle error
            console.error(error);
          });

          // Send coursesId to backend to store in the course enrollment table
          axios.post(`http://localhost:4000/storeCoursesEnrollment/${user_id}`, {
            coursesId: coursesId
          }).then((response) => {
            // Handle success response
            console.log(response.data);
          }).catch((error) => {
            // Handle error
            console.error(error);
          });

          // Display a success message
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'تمت عملية الدفع بنجاح ، إذهب إلى حسابك الشخصي ستجده هناك',
            showConfirmButton: false,
            timer: 3000,
          });

          // Clear the cart items from the database
          axios.delete(`http://localhost:4000/clearCartItems/${user_id}`).then((response) => {
            // Handle success response
            console.log(response.data);
            setCartItems([]);

          }).catch((error) => {
            // Handle error
            console.error(error);
          });

        }).catch((error) => {
          // Handle error
          console.error(error);
        });
      }
    });

    setFormData({
      cvv: '',
      expiry: '',
      name: '',
      number: ''
    });

  }




  // handle the orange money payment
  function handleOrangeMoneyFormSubmit(event) {
    event.preventDefault();

    setFormDataOrange(phone_number);
    // Check if all required fields are filled
    if (!phone_number) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'يرجى ملء جميع الحقول المطلوبة',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validate phone number format (10 digits starting with "07")
    const phone_numberRegex = /^07\d{8}$/;
    if (!phone_numberRegex.test(phone_number)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'رقم الهاتف يجب أن يبدأ بـ 07 ويحتوي على 10 أرقام',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    Swal.fire({
      title: 'تأكيد الطلب',
      text: `هل أنت متأكد أنك ترغب في المتابعة مع عملية الدفع؟ المبلغ الإجمالي: ${total}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، تابع للدفع',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        const summariesId = cartItems.filter((item) => item.type === 'summary').map((item) => item.id);

        const coursesId = cartItems.filter((item) => item.type === 'course').map((item) => item.id);

        setSummariesId(summariesId);
        setCoursesId(coursesId);
        const token = localStorage.getItem('token');
        const decodedToken = token ? jwt_decode(token) : null;
        const user_id = decodedToken?.userId;

        // Retrieve payment method ID based on the slug
        axios.get('http://localhost:4000/getPaymentMethodId', {
          params: {
            paymentMethodName: 'orange-money',
          },
        }).then((response) => {
          const payment_methods_id = response.data.id;
          console.log(payment_methods_id);
          // Insert transaction into the database
          axios.post(`http://localhost:4000/insertTransaction/${user_id}`, {
            payment_methods_id: payment_methods_id,
            date: new Date(),
            user_id: user_id,
            amount: total,
          }).then((response) => {
            // Handle success response
            console.log(response.data);
          }).catch((error) => {
            // Handle error
            console.error(error);
          });

          // Send summariesId to backend to store in the summary enrollment table
          axios.post(`http://localhost:4000/storeSummariesEnrollment/${user_id}`,
            {
              summariesId: summariesId
            }).then((response) => {
              // Handle success response
              console.log(response.data);
            }).catch((error) => {
              // Handle error
              console.error(error);
            });

          // Send coursesId to backend to store in the course enrollment table
          axios.post(`http://localhost:4000/storeCoursesEnrollment/${user_id}`,
            {
              coursesId: coursesId,
            }
          ).then((response) => {
            // Handle success response
            console.log(response.data);
          }).catch((error) => {
            // Handle error
            console.error(error);
          });


          // Display a success message
          Swal.fire({
            position: 'center',
            icon: 'success',
            title:
              'تمت عملية الدفع بنجاح ، إذهب إلى حسابك الشخصي ستجده هناك',
            showConfirmButton: false,
            timer: 3000,
          });


          // Clear the cart items from the database
          axios.delete(`http://localhost:4000/clearCartItems/${user_id}`).then((response) => {
            // Handle success response
            console.log(response.data);
            setCartItems([]);

          }).catch((error) => {
            // Handle error
            console.error(error);
          });



        }).catch((error) => {
          console.error(error);
          // Handle error
        });
      }
    });

    setFormDataOrange('');
  }



  // Values for the cards form
  function handleInputChangePayment(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  }



  // Handle tab change
  function handleTabChange(tab) {
    setTab(tab);
  }



  // Function to remove an item from the cart
  function removeItemFromCart(itemId) {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);

    const token = localStorage.getItem('token');
    const decodedToken = jwt_decode(token);
    const user_id = decodedToken.userId;

    // Make a DELETE request to remove the item from the database
    axios.delete(`http://localhost:4000/removeCartItemsFromCart/${user_id}/${itemId}`).then((response) => {
      console.log(response.data);
      fetchCartItems();

    }).catch((error) => {
      console.error(error);
    });

  }



  return (
    <>

      <div style={{ marginBottom: "150px" }}>
        {/* Header Start */}
        <div className="container-fluid bg-primary py-5 page-headerPayment" dir="ltr">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  عملية الدفع
                </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">

                    <li
                      className="breadcrumb-item text-white active"
                      aria-current="page">
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* Header End */}


        {/* Cart section */}
        {cartItems.length > 0 ? (
          <section className="h-100 h-custom" style={{ backgroundColor: "#ffffff" }}>
            <div className="container py-4 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col">
                  <div className="card123">
                    <div className="cardPayment-body p-0">
                      <div className="row">
                        <div className="col-lg-12">
                          <h5 className="mb-3">
                            <Link to={"/Summaries/#"} className="text-body">
                              <i className="fas fa-long-arrow-alt-left me-2 ms-2" />
                              استمر في مشاهدة المزيد من الملخصات
                            </Link>
                          </h5>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                              <p className="mb-1"> عربة التسوق : </p>
                            </div>
                          </div>

                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="d-flex flex-column mb-2 shadow p-4"
                              style={{
                                borderRadius: "30px",
                                width: "100%",
                                maxWidth: "400px",
                                margin: "20px",
                                transition: "width 0.3s",
                              }}>
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>
                                  <p>{item.title}</p>
                                </strong>
                                <span style={{ color: "red", cursor: "pointer" }} onClick={() => removeItemFromCart(item.id)}>
                                  X
                                </span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p>{item.price} JD</p>
                                </div>
                              </div>
                            </div>))}

                          <div className="row mt-4">
                            <div className="col-lg-12">
                              <div className="cardPay shadow">
                                <div className="card-body p-4">
                                  <h4>تفاصيل الدفع:</h4>
                                  <p>المجموع الفرعي: {parseFloat(subtotal).toFixed(1)} JD</p>
                                  <p>إجمالي المبلغ: {parseFloat(total).toFixed(1)} JD</p>
                                  <p>
                                    سيتم إضافة رسوم رمزية "15%" ستكون شاملة ضريبة القيمة المضافة نشكر تعاونكم.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="empty-cart text-center mt-5 mb-5">
            <p className='mb-5'>

              <img src="https://shaguf.com/site/assets/img/empty-cart.svg" alt="cart" width="300px" />


            </p>
            <p> عربةِ تسوقِكَ فارغة ، سارع في شراءِ             <Link to="/summaries" className='fw-bold'> مُلخص </Link> 
              أو الإنضمام              <Link to="/Courses" className='fw-bold'>لدورة</Link> الأن
              </p>
            <p>
              إستمر في التعلم و إحصل على المعرفة و الدرجات العالية	&hearts;

            </p>

          </div>
        )}
      </div>



      {/* Payment form  */}
      {!isLoggedIn ? (
        <div className='d-flex justify-content-center'>
          <button className="checkout-btn buttonInAddArticle mt-3 fa-solid fa-book-open-reader" onClick={() =>
            Swal.fire({
              title: 'قم بعملية تسجيل الدخول لتستمر في عمليتي الشراء و الدفع',
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'تمتلك حساب ؟',
              cancelButtonText: 'ليس لديك حساب ؟',
              allowOutsideClick: false,
              showCloseButton: true
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = '/login';
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = '/signup';
              }
            })
          }>
            قم بتسجيل الدخول لبدء الحصول على موادك
          </button>

        </div>
      ) : (
        <>
          {cartItems.length > 0 ? (
            <section className="h-100 h-custom" style={{ backgroundColor: "#ffffff" }}>
              <div className="container py-4 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-md-8 mx-auto">
                    <h6 className="text-center fw-bold mb-3 mt-2">
                      يمكنك إتمام عملية الدفع من خلال إحدى طرق الدفع التالية
                    </h6>
                    <div className="btn-group d-flex justify-content-center">
                      <button
                        className="PayTab btn-primary p-2 m-2"
                        onClick={() => handleTabChange("creditCard")}>

                        بطاقة الماستر أو  بطاقة الفيزا
                      </button>

                      <button
                        className="PayTab btn-primary p-2 m-2"
                        onClick={() => handleTabChange("orangeMoney")}>

                        محفظة أورانج
                      </button>
                    </div>

                    <div className="mt-3">
                      {tab === "creditCard" && (
                        <div className="cardPayment">
                          <div className="card-body">
                            <Cards
                              cvv={formData.cvv}
                              expiry={formData.expiry}
                              name={formData.name}
                              number={formData.number}
                              focused={focus}
                            />
                            <form onSubmit={handleFormSubmit} id="cardForm">
                              <input type='hidden' name="payment_method" value="credit-card" />
                              <div className="mb-3">
                                <label className="form-label">رقم البطاقة</label>
                                <input
                                  className="form-control"
                                  type="tel"
                                  name="number"
                                  placeholder="رقم البطاقة"
                                  value={formData.number}
                                  minLength="16"
                                  maxLength="16"
                                  onChange={handleInputChangePayment}
                                  onFocus={(e) => setFocus(e.target.name)}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">إسم صاحب البطاقة</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="name"
                                  placeholder="رزان عبوشي"
                                  value={formData.name}
                                  pattern="[A-Za-zء-ي\s]+"
                                  title="يرجى إدخال أحرف فقط"
                                  onChange={handleInputChangePayment}
                                  onFocus={(e) => setFocus(e.target.name)}
                                />
                              </div>
                              <div className="row mb-3">
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                  <label className="form-label">تاريخ إنتهاء البطاقة (MM/YYYY)</label>
                                  <input
                                    type="tel"
                                    name="expiry"
                                    className="form-control"
                                    placeholder="Expiration Date (MM/YYYY)"
                                    maxLength="7"
                                    pattern="(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})"
                                    onChange={handleInputChangePayment}
                                    onFocus={(e) => setFocus(e.target.name)}
                                    required
                                  />


                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                  <label className="form-label">CVV</label>
                                  <input
                                    className="form-control"
                                    type="tel"
                                    name="cvv"
                                    placeholder="CVV"
                                    value={formData.cvv}
                                    minLength="3"
                                    maxLength="3"
                                    onChange={handleInputChangePayment}
                                    onFocus={(e) => setFocus(e.target.name)}
                                  />
                                </div>
                              </div>

                              <button
                                type="submit"
                                className="btn-dark PayNow mt-3 col-12 p-2">
                                ادفع الآن
                              </button>
                            </form>
                          </div>
                        </div>

                      )}
                      {/* Orange money */}
                      {tab === "orangeMoney" && (
                        <div className="cardPayment">
                          <div className="card-body">
                            <h6 className="text-center">الدفع عن طريق محفظة أورانج  </h6>

                            <form onSubmit={handleOrangeMoneyFormSubmit}>
                              <div className="mb-3">
                                <label className="form-label">رقم الهاتف</label>
                                <input type='hidden' name="payment_method" value="orange-money" />

                                <input
                                  className="form-control"
                                  type="text"
                                  name="phone_number"
                                  placeholder="أدخل رقم هاتفك"
                                  value={phone_number}
                                  onChange={(e) => setFormDataOrange(e.target.value)}
                                />
                              </div>

                              <div className="mb-3">
                                <label className="form-label">المبلغ</label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="amount"
                                  placeholder="المبلغ الذي ستقوم بدفعه"
                                  value={total}
                                  required
                                  disabled
                                />

                              </div>

                              <button
                                type="submit"
                                className="btn-dark PayNow mt-3 col-12 p-2">
                                ادفع الآن
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                      {/* End payment by Orange */}
                    </div>
                  </div>
                </div>
              </div>
            </section >
          ) : null}

        </>

      )}

    </>

  )
}
export default CheckoutPayment;