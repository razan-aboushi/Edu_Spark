import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import jwt_decode from 'jwt-decode';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwt_decode(token);
          const user_id = decodedToken.userId;
          const response = await axios.get(`http://localhost:4000/user-profile/${user_id}`);
          // Fill in the name and email with the user's data
          setName(response.data.name);
          setEmail(response.data.email);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getUserProfile();
  }, []);


  // Handle form submittion
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      Swal.fire({
        icon: 'error',
        title: 'الحقول مطلوبة',
        text: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    const newMessage = {
      name: name,
      email: email,
      subject: subject,
      message: message
    };

    axios.post('http://localhost:4000/messages', newMessage)
      .then(response => {
        console.log('Message sent successfully:', response.data);
        Swal.fire({
          icon: 'success',
          title: 'تمت عملية الإرسال',
          text: 'تم إرسال رسالتك بنجاح'
        });
      })
      .catch(error => {
        console.error('Error in sending message:', error);
        Swal.fire({
          icon: 'error',
          title: 'فشل في الإرسال',
          text: 'حدث خطأ أثناء عملية إرسال رسالتك ، من فضلك أعد المحاولة'
        });
      });


    setName("");
    setEmail("");
    setSubject("");
    setMessage("");


  }



  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-3 page-headerContact" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">تواصل معنا</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                    <Link className="text-white" to={"/"}>
                      الرئيسية
                    </Link>
                  </Breadcrumbs>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    الاتصال
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h2 className="mb-5">تواصل معنا لأي استفسار</h2>
        </div>
        <div className="row g-4">
          <div className="col-md-12 wow fadeInUp" data-wow-delay="0.5s">
            <form id="ContactForm" onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="اسمك"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="name">اسمك</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">بريدك الإلكتروني</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      placeholder="الموضوع"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <label htmlFor="subject">الموضوع</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      placeholder="اترك رسالتك هنا"
                      id="message"
                      style={{ height: 150 }}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <label htmlFor="message">الرسالة</label>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    className="btn-primary w-100 py-3"
                    id="contactButton"
                    type="submit"
                  >
                    إرسال الرسالة
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-12 wow fadeInUp" data-wow-delay="0.1s">
            <h5>تواصل معنا</h5>
            <p className="mb-4 fs-5">
              إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، نحن هنا لمساعدتك، لا تتردد في الاتصال بنا الآن!
            </p>
            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary ms-2"
                style={{ width: 50, height: 50, borderRadius: 25 }}
              >
                <i className="fa fa-map-marker-alt text-white" />
              </div>
              <div className="ms-3">
                <h5 className="text-primary">الموقع</h5>
                <p className="mb-0"> شارع المُعز لدين اللَه الفاطمي  ، الزرقاء، الأردن</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary ms-2"
                style={{ width: 50, height: 50, borderRadius: 25 }}
              >
                <i className="fa fa-phone-alt text-white" />
              </div>
              <div className="ms-3">
                <h5 className="text-primary">رقم الهاتف</h5>
                <p className="mb-0"> 780577727 962+</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary ms-2"
                style={{ width: 50, height: 50, borderRadius: 25 }}
              >
                <i className="fa fa-envelope text-white" />
              </div>
              <div className="ms-3">
                <h5 className="text-primary">البريد الإلكتروني</h5>
                <p className="mb-0">EduSpark@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
