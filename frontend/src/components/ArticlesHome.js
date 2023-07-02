import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import axios from 'axios';

function ArticlesHome() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function getSomeArticles() {
      try {
        const response = await axios.get('http://localhost:4000/articlesHomePage');
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    }

    getSomeArticles();
  }, []);

  // Function to convert timestamp to date format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3 mb-5">
            مقالات متنوعة
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
            {articles.length > 0 ? (
              articles.map((article) => (
                <div className="item" key={article.article_id}>
                  <div className="work">                                                                         
                    <div className="img d-flex align-items-center justify-content-center rounded" style={{ backgroundImage:`url(http://localhost:4000/images/${article.article_image})` }}>
                      <Link to={`/ArticleDetails/${article.article_id}`} className="icon d-flex align-items-center justify-content-center">
                        <span className="bi bi-search" />
                      </Link>
                    </div>
                    <div className="text pt-3 w-100 text-center">
                      <h5>
                        <Link to={`/ArticleDetails/${article.article_id}`}>{article.article_title}</Link>
                      </h5>
                      <p>{article.article_brief}</p>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>Loading articles...</div>
            )}
          </OwlCarousel>
        </div>
      </div>
    </div>
  );
}

export default ArticlesHome;
