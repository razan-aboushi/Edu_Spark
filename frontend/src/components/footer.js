import React from 'react';
import "../css/style.css";
import { Link } from 'react-router-dom';
import logo from '../img/KeepMeOnLogo.png'

function Footer() {


  return (
    <>
      <div dir='ltr'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1435 200">
          <path
            fill="#181D38"
            fillOpacity={1}
            d="M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,160C840,171,960,213,1080,197.3C1200,181,1320,107,1380,69.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
        {/* Footer Start */}
        <footer>
          <div className="container-fluid bg-dark text-light footer">
            <div className="container py-5">
              <div className="row g-5">
                <div className="col-lg-3 col-md-6" style={{ marginTop: "88px" }}>
                  <Link className="btnLinks btn-link" to="/about" target="_blank">
                    معلومات عنا
                  </Link>
                  <Link className="btnLinks btn-link" to="/contact" target="_blank">
                    اتصل بنا
                  </Link>
                  <Link className="btnLinks btn-link" to="/Courses" target="_blank">
                    جميع الدورات
                  </Link>

                </div>
                <div className="col-lg-3 col-md-6 d-flex text-end" style={{ flexDirection: "column" }}>
                  <h4 className="text-white  text-end">روابط سريعة</h4>
                  <Link className="btnLinks btn-link text-right" to="/University" target="_blank">
                    الجامعات
                  </Link>
                  <Link className="btnLinks btn-link" to="/Article" target="_blank">
                    المقالات
                  </Link>
                  <Link className="btnLinks btn-link" to="/Summaries" target="_blank">
                    جميع المُلخصات
                  </Link>
                  <Link className="btnLinks btn-link" to="/faq" target="_blank">
                    الأسئلة الشائعة
                  </Link>
                </div>
                <div className="col-lg-3 col-md-6 d-flex text-end" style={{ flexDirection: "column" }}>
                  <h4 className="text-white mb-3 ">اتصل بنا</h4>
                  <p className="mb-2">
                    الزرقاء ، الأردن
                    <i className="fa fa-map-marker-alt ms-2 " />

                  </p>
                  <p className="mb-2">
                    +962 780577727
                    <i className="fa fa-phone-alt ms-2 " />

                  </p>

                  <p className="mb-2">
                    <a href="mailto:info@EduSpark.com" className="email-link">
                      info@EduSpark.com
                      <i className="fa fa-envelope ms-2" />
                    </a>
                  </p>


                  <div className="pt-2 d-flex text-end" style={{ flexDirection: "row-reverse" }}>
                    <Link
                      className="btnSocial btn-outline-light btn-social"
                      to="https://twitter.com/razanalqadoumi?s=09"
                      target="_blank">
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link
                      className="btnSocial btn-outline-light btn-social"
                      to="https://www.facebook.com/rooza.alqadoumi?mibextid=ZbWKwL"
                      target="_blank">
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link
                      className="btnSocial btn-outline-light btn-social"
                      to="https://instagram.com/razan_alqadoumi?igshid=ZDdkNTZiNTM="
                      target="_blank">
                      <i className="fab fa-instagram" />
                    </Link>
                    <Link
                      className="btnSocial btn-outline-light btn-social"
                      to="https://www.linkedin.com/in/razan-aboushi"
                      target="_blank">
                      <i className="fab fa-linkedin-in" />
                    </Link>
                  </div>
                </div>
                {/* Add the logo here */}
                <div className="col-lg-3 col-md-6 d-flex justify-content-end align-items-center">
                  <img src={logo} alt="Logo" className="footer-logo" width="65%" height="79%" />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="copyright">
                <div className="row">
                  <div className="col-md-9 text-center text-md-end mb-3 mb-md-0">
                    <Link to="/">
                      حقوق الطبع والنشر © EduSpark 2023
                    </Link>
                    {" "}    ،  جميع الحقوق محفوظة. تم تطويره بواسطة{" "}
                    <Link
                      style={{ color: "#06BBCC" }}
                      to="https://github.com/razan-aboushi" target='_blank'
                    >
                      رزان عبوشي
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Footer;