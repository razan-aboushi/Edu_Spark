import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import {HashLink} from 'react-router-hash-link';
import axios from 'axios';
import "../css/style.css";

function Article() {
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [commentsCountFetched, setCommentsCountFetched] = useState(false);
    const articlesPerPage = 6;


    // Get the current page's articles
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);


    // Function to handle page change in the pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


// handle the search input when searching for article title or brief
    const handleSearch = async (e) => {
        const searchValue = e.target.value;
        setSearchQuery(searchValue);

        try {
            const response = await axios.get('http://localhost:4000/filtered-articles', {
                params: {
                    searchTerm: searchValue,
                },
            });

            setFilteredArticles(response.data.articles);
        } catch (error) {
            console.error('Error fetching filtered articles:', error);
        }

        setCurrentPage(1);
    };


    // get the count of the comments for each article
    useEffect(() => {
        const fetchCommentsCount = async () => {
            try {
                const articleIds = articles.map((article) => article.article_id);
                const response = await axios.post('http://localhost:4000/comments/count', {articleId: articleIds});

                const commentsCountMap = response.data.commentsCountMap;
                const updatedArticles = articles.map((article) => ({
                    ...article,
                    comments: commentsCountMap[article.article_id] || 0
                }));

                setArticles(updatedArticles);
                setFilteredArticles(updatedArticles);
                setCommentsCountFetched(true);
            } catch (error) {
                console.error('Error fetching comments count:', error);
            }
        };

        if (articles.length > 0 && !commentsCountFetched) {
            fetchCommentsCount();
        }
    }, [articles, commentsCountFetched]);


    // get all articles in the article page
    useEffect(() => {
        const getArticles = async () => {
            try {
                const response = await axios.get('http://localhost:4000/articles');
                const fetchedArticles = response.data.articles;
                setArticles(fetchedArticles);
                setFilteredArticles(fetchedArticles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        getArticles();
    }, []);


    // convert the date from the timestamp to date
    const convertTimestampToDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };


    // Calculate the total number of pages and make the pagination
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const pageNumbers = [];
    for (let r = 1; r <= totalPages; r++) {
        pageNumbers.push(r);
    }


    return (
        <div style={{overflow: "hidden"}}>
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
                                        المقالات
                                    </li>
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
                                onChange={handleSearch}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Search */}


            {/* Article posts list */}
            <div className="row gy-4 posts-list">
                {currentArticles.map((article) => (
                    <div className="col-lg-6 col-md-12 shadow border border-dark" key={article.article_id}>
                        <article className="d-flex flex-column">
                            <div className="post-img">
                                <img src={`http://localhost:4000/images/${article.article_image}`} alt="صورة المقالة"
                                     className="img-fluid" width="100%" height="290px"/>
                            </div>
                            <h2 className="title">{article.article_title}</h2>
                            <div className="meta-top">
                                <ul>
                                    <li className="d-flex align-items-center">
                                        <i className="bi bi-clock ms-2"/>
                                        <time dateTime={article.created_at}>
                                            {convertTimestampToDate(article.created_at)}
                                        </time>
                                    </li>
                                    <li className="d-flex align-items-center">
                                        <i className="bi bi-chat-dots ms-2"/>
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
            <div className="d-flex justify-content-center mt-5">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {pageNumbers.map((pageNumber) => (
                            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNumber)}>
                                    {pageNumber}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {/* End Article pagination */}
        </div>
    );
}


export default Article;