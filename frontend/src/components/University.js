import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../css/style.css";
import Breadcrumbs from '@mui/material/Breadcrumbs';

function University() {
  const [universities, setUniversities] = useState([]);


  useEffect(() => {
    getUniversities();
  }, []);

  const getUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:4000/universities');
      setUniversities(response.data);
    }
    catch (error) {
      console.error('Error fetching universities:', error);
    }
  };



  return (
    <div>
      {/* بداية الهيدر */}
      <div className="container-fluid bg-primary py-5 mb-4 page-headerUniversity" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                الجامعات
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    الجامعات                  </li>
                  <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                    <p className="text-white">
                      التصنيفات
                    </p>
                  </Breadcrumbs>
                  
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* نهاية الهيدر */}


      {/* بداية الفئات */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: 600 }}>
            <h4>
              يمكنك رؤية المواد والملخصات المتاحة في كل جامعة
            </h4>
          </div>
          <div className="row g-4">
            {universities.map(university => (
              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
                key={university.university_id}>
                <div className="classes-item text-center">
                  <div className="rounded-circle w-75 mx-auto p-2">

                    <img
                      src={`http://localhost:4000/images/${university.university_image}`}
                      alt="صورة للجامعة"
                      width="65%" height="175px" />
                  </div>

                  <div className="rounded p-4 pt-3 mt-2" style={{ fontSize: "20px" }}>
                    <Link
                      to={`/coursesCategories/${university.university_id}`}>
                      {university.university_name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* نهاية الفئات */}
    </div>
  );
}

export default University;