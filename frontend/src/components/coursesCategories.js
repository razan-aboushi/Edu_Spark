import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../css/style.css';


function CoursesCategories() 
{
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { universityId } = useParams();



  useEffect(() => {
    fetchUniversityCategories();
  }, [universityId]);



  const fetchUniversityCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/universities/${universityId}/categories`
      );
      console.log(response);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching university categories:', error);
    }
  };


  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };


  return (
    <div>
      {/* Hero section Start */}
      <div className="container-fluid bg-primary py-5 mb-3 page-headerMajorCatories" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h3 className="display-3 text-white animated slideInDown">
                التخصصات                          </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">

                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* End hero section End */}

      {/* Categories Start */}
      <div className="container-xxl py-5 category">
        <div className="container p-2">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          </div>

          {/* Search Bar */}
          <div className="text-center">
            <input
              type="text"
              placeholder="ابحث عن التخصص..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-control w-50 mx-auto mb-5"
            />
          </div>


          {/* Categories */}
          <div className="row" dir="ltr" mt-4>
            {categories.map(category => (
              category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) && (
                <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={category.category_id}>
                  <div className="cardCategory my-2 wow fadeInUp" data-wow-delay="0.2s">
                    <Link
                      to={`/CoursesAndSummaries/${category.university_id}/${category.category_id}`}
                      className="text-decoration-none" >
                      <img

                        src={`http://localhost:4000/images/${category.category_image}`}
                        className="card-img-top img-fluid"
                        alt={category.category_name}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{category.category_name}</h5>
                      </div>
                    </Link>
                  </div>
                </div>
              )
            ))}
          </div>
          {/* end Categories */}

        </div>
      </div>
      {/* End Category Section */}
    </div>
    
  );
}

export default CoursesCategories;
