import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../css/style.css";
import about from "../img/about.jpg";
import Breadcrumbs from '@mui/material/Breadcrumbs';

function About() {
  const [aboutUsData, setAboutUsData] = useState({});
  const [visionData, setVisionData] = useState({});
  const [missionData, setMissionData] = useState({});



  useEffect(() => {
    const getAboutData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/aboutUsGet');
        setAboutUsData(response.data);
        setVisionData(response.data);
        setMissionData(response.data);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getAboutData();
  }, []);




  return (

    <>
      {/* Header Start */}

      <div>
        <div className="container-fluid bg-primary py-5 mb-5 page-headerAbout" dir="ltr">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  معلومات عنا            </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                  <li
                      className="breadcrumb-item text-white active"
                      aria-current="page">
                      معلومات عنا
                    </li>
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                      <Link className="text-white" to={"/"}>
                        الصفحة الرئيسية
                      </Link>
                    </Breadcrumbs>
                  
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Header End */}


      {/* Features Start */}
      <div className="container-xxl py-5 mt-5">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3 mb-5">
            المميزات
          </h6>
        </div>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x bi bi-book text-primary mb-4" />
                  <h5 className="mb-3">الكورسات و الملخصات</h5>
                  <p>
                    ملخصات سلسة ومنظمة لموادك الجامعية.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-globe text-primary mb-4" />
                  <h5 className="mb-3">مراجعات عبر الإنترنت</h5>
                  <p>
                    يقوم زملائك في الجامعة بتقديم مراجعات للمواد المختلفة
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-home text-primary mb-4" />
                  <h5 className="mb-3">المقالات</h5>
                  <p>
                    أنها تحتوي على مواضيع مختلفة تهم الطلاب في
                    الجوانب العلمية والعملية
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-book-open text-primary mb-4" />
                  <h5 className="mb-3">المواد الجامعية</h5>
                  <p>إشتري الملخصات و الكتب الجامعية بأسعار مميزة عبر الإنرنت</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features End */}


      {/* About Start */}
      <div>
        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-5">
              <div
                className="col-lg-6 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ minHeight: 400 }}>
                <div className="position-relative h-100">
                  <img
                    className="img-fluid position-absolute w-100 h-100"
                    src={about}
                    alt="صورة عنا"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                <h1 className="mb-4">{aboutUsData.aboutus_title}</h1>
                <p className="mb-4">
                  {aboutUsData.aboutpargraph1}
                </p>
                <p className="mb-4">
                  {aboutUsData.aboutpargraph2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Start of mission and vision section */}
      <div className="hmv-box">
        <div className="container">
          <div className="row  justify-content-end">
            <div className="col-lg-6 col-md-6 col-12 mb-2">
              <div className="inner-hmv">
                <div className="icon-box-hmv">
                  <i className="bi bi-journal-bookmark-fill" />
                </div>
                <h3>{visionData.vision_title}</h3>
                <div className="tr-pa">ر</div>
                <p>
                  {visionData.vision}
                </p>
              </div>
            </div>
            <div className=" col-lg-6 col-md-6 col-12 mb-2">
              <div className="inner-hmv">
                <div className="icon-box-hmv">
                  <i className="bi bi-emoji-laughing" />
                </div>
                <h3>{missionData.mission_title}</h3>
                <div className="tr-pa">م</div>
                <p>
                  {missionData.mission}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End of mission and vision section */}
    </>
  )
}

export default About;