import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CategoriesInHome() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleClickCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:4000/categories/${categoryId}/summaries`);
      // Handle the fetched summaries data as needed
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-xxl py-5 category" style={{ marginTop: "70px" }}>
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
            فئات التخصصات
          </h6>
        </div>
        <div className="row g-3 mt-3">
          <div className="col-lg-7 col-md-6">
            <div className="row g-3">
              {categories.slice(0, 3).map((category) => (
                <div
                  key={category.category_id}
                  className="col-lg-12 col-md-12 wow zoomIn"
                  data-wow-delay="0.1s"
                >
                  <Link
                    className="position-relative d-block overflow-hidden"
                    to={`/coursesCategories/${category.category_id}`}
                    onClick={() => handleClickCategory(category.category_id)}
                  >
                    <img className="img-fluid" src={category.category_image} alt="صورة" />
                    <div
                      className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                      style={{ margin: 1 }}
                    >
                      <h5 className="m-0">{category.category_name}</h5>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-lg-5 col-md-6 wow zoomIn"
            data-wow-delay="0.7s"
            style={{ minHeight: 350 }}
          >
            <Link
              className="position-relative d-block h-100 overflow-hidden"
              to={`/coursesCategories/${categories[3]?.category_id}`}
              onClick={() => handleClickCategory(categories[3]?.category_id)}
            >
              <img
                className="img-fluid position-absolute w-100 h-100"
                src={categories[3]?.category_image}
                alt="صورة"
                style={{ objectFit: "cover" }}
              />
              <div
                className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3"
                style={{ margin: 1 }}
              >
                <h5 className="m-0">{categories[3]?.category_name}</h5>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesInHome;
