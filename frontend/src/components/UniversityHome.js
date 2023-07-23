import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


function UniversityHome()
 {
  const [universities, setUniversities] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:4000/universities')
      .then(response => {
        setUniversities(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  
  return (
    <section className="ftco-section mb-5" dir="ltr" style={{ marginTop: "120px" }}>
      <div className="container">
        <div className="row">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3 mb-5">
              الجامعات
            </h6>
          </div>
          <div className="col-md-12">
            <OwlCarousel
              className="featured-carousel owl-theme"
              items={4}
              loop
              nav
              autoplay
              autoplayTimeout={4000}
              margin={20}
              responsive={{
                0: { items: 1 },
                768: { items: 3 },
                992: { items: 4 }
              }}
            >
                                   
              {universities.map(university => (
                <div className="item" key={university.university_id}>
                  <div className="work">
                    <div
                      className="img d-flex align-items-center justify-content-center rounded"
                      style={{ backgroundImage: `url(http://localhost:4000/images/${university.university_image})` }}
                      >
                      <Link
                        to={`/coursesCategories/${university.university_id}`}
                        className="icon d-flex align-items-center justify-content-center"
                      >
                        <span className="bi bi-search" />
                      </Link>
                    </div>
                    <div className="text pt-3 w-100 text-center">
                      <h5>
                      <Link
                      to={`/coursesCategories/${university.university_id}`}
                    >
                      {university.university_name}
                    </Link>
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UniversityHome;
