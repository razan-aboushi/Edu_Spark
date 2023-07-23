import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/style.css";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { HashLink } from 'react-router-hash-link';
import axios from 'axios';

function Article()
 {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [commentsCountFetched, setCommentsCountFetched] = useState(false);



  // Number of articles per page
  const articlesPerPage = 6;

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Get the current page's articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  // handle the search input
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);


    if (searchValue.trim() === '') {
      setFilteredArticles(articles);
    } else {
      // Filter articles based on search query
      const filteredArticles = articles.filter(
        (article) =>
          (article.article_title && article.article_title.toLowerCase().includes(searchValue.toLowerCase())) ||
          (article.article_brief && article.article_brief.toLowerCase().includes(searchValue.toLowerCase()))
      );

      setFilteredArticles(filteredArticles);
    }

    setCurrentPage(1);
  };




  // get the count of the comments for each article
  useEffect(() => {
    const getCommentsCount = async () => {
      try {
        const articleId = articles.map((article) => article.article_id);
        const response = await axios.post('http://localhost:4000/comments/count', { articleId });
        const commentsCountMap = response.data.commentsCountMap;

        const updatedArticles = articles.map((article) => ({
          ...article,
          comments: commentsCountMap[article.article_id] || 0,
        }));

        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles);
        setCommentsCountFetched(true);
      } catch (error) {
        console.error('Error fetching comments count:', error);
      }
    };

    if (articles.length > 0 && !commentsCountFetched) {
      getCommentsCount();
    }
  }, [articles, commentsCountFetched]);



  // get all articles 
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/articles');
        const fetchedArticles = response.data.articles;
        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);




  // convert the date from the timestamp to date
  const convertTimestampTOdate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };



  return (
    <div style={{ overflow: "hidden" }} >
      {/* Header Start */}
      <div className="container-fluid bg-primary py-5 mb-5 page-headerBlog" dir="ltr">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                المقالات
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    مقالات
                  </li>
                  <Breadcrumbs aria-label="breadcrumb" className="breadcrumb-item">
                    <Link className="text-white">
                      التصنيفات                    </Link>
                  </Breadcrumbs>

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
      {/* Header End */}


      {/* Search */}
      <div className="container mb-5">
        <div className="row justify-content-center mb-3">
          <div className="col-lg-6 col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={handleSearch}
              />

            </div>
          </div>
        </div>
      </div>
      {/* End Search */}


      {/* Article posts list */}
      <div className="row gy-4 posts-list">
        {currentArticles.map((article) => (
          <div className="col-lg-6 col-md-12" key={article.article_id}>
            <article className="d-flex flex-column">
              <div className="post-img">
                <img src={`http://localhost:4000/images/${article.article_image}`} alt="an image" className="img-fluid" width="100%" height="290px" />
              </div>
              <h2 className="title">{article.article_title}</h2>
              <div className="meta-top">
                <ul>
                  <li className="d-flex align-items-center">
                    <i className="bi bi-clock ms-2" />
                    <time dateTime={article.created_at}>
                      {convertTimestampTOdate(article.created_at)}
                    </time>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="bi bi-chat-dots ms-2" />
                    <Link to="#"> {article.comments} تعليقات </Link>
                  </li>
                </ul>
              </div>
              <div className="content">
                <p>{article.article_brief}</p>
              </div>
              <div className="ButtonSearch mt-auto align-self-start mt-5">
                <HashLink to={`/ArticleDetails/${article.article_id}`}>إقرأ المزيد</HashLink>
              </div>
            </article>
          </div>
        ))}
      </div>
      {/* End Article posts list */}

      {/* Article pagination */}
      <div className="blog-pagination">
        <ul className="justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
              <Link to="#" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* End Article pagination */}
    </div>
  );
}

export default Article;
