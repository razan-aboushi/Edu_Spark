import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../css/style.css";

function ArticleDetails() {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { article_id } = useParams();
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken ? decodedToken.userId : null;
  const [showComments, setShowComments] = useState(false); // New state variable


  // get article by article id to display it here in the article details page
  const getArticleDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/articles/${article_id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  useEffect(() => {
    getArticleDetails();
  }, [article_id]);


  // get all the comments that related to sepsific article
  const getComments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/articles/${article_id}/comments`);
      console.log(response);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    getComments();
  }, [article_id]);



  // get the user data " to get the user id , name and email"
  useEffect(() => {
    if (user_id) {
      const getUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/user-profile/${user_id}`);
          console.log(response);

          // to auto fill the user name and email in the add comments form
          setName(response.data.name);
          setEmail(response.data.email);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      getUserData();
    }
  }, [user_id]);



  // handle the comment form when submitting
  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!user_id) {
      // User is not logged in, show a message to prompt login
      Swal.fire({
        title: 'تسجيل الدخول مطلوب',
        text: 'يجب عليك تسجيل الدخول لكتابة تعليق.',
        icon: 'warning',
        confirmButtonText: 'تسجيل الدخول',
        cancelButtonText: 'إلغاء',
        showCancelButton: true,
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';

        }
      });

      return;
    }

    // Display confirmation dialog
    Swal.fire({
      title: 'إرسال التعليق',
      text: 'هل أنت متأكد أنك تريد إرسال هذا التعليق؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'إرسال',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        submitComment();
      }
    });
  };

  // when submit the comment 
  const submitComment = async () => {
    try {
      await axios.post('http://localhost:4000/comments', {
        comment_content: message,
        user_id: user_id,
        article_id: article_id,
      });

      // Clear the comment form
      setName('');
      setEmail('');
      setMessage('');

      // Refresh the comments
      getComments();

      // Show success message
      Swal.fire('نجاح', 'تم إرسال التعليق بنجاح!', 'success');
    } catch (error) {
      console.error('Error posting comment:', error);

      // Show error message
      Swal.fire('خطأ', 'حدث خطأ أثناء إرسال التعليق.', 'error');
    }
  };

  // to convert the date from the timestamp format to normal date
  const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // just when you click on the rply for any comment , you will make tag for this person as @user1 or @user2
  const handleReplyClick = (commentId) => {
    // Update the message with the reply format
    const replyFormat = `@user${commentId} `;
    setMessage(replyFormat);
  };

  if (!article) {
    return <div className='m-5'>جارٍ التحميل...</div>;
  }

  // Toggle the display of comments
  const toggleComments = () => {
    setShowComments(!showComments);
  };


  return (
    <>
      <div>
        {/* بداية الهيدر */}
        <div className="container-fluid bg-primary py-5 mb-5 page-headerArticleDetails" dir="ltr">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-10 text-center">
                <h1 className="display-3 text-white animated slideInDown">
                  تفاصيل المقالة
                </h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">

                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* نهاية الهيدر */}

        <main>
          <section id="blog" className="blog">
            <div className="container" data-aos="fade-up">
              <div className="row g-5">
                <div className="col-lg-9">
                  <article className="blog-details">
                    <div className="post-img">
                      <img src={`http://localhost:4000/images/${article.article_image}`}
                        alt="صورة"
                        className="img-fluid"
                      />
                    </div>
                    <h4 className="title">{article.article_title}</h4>
                    <div className="meta-top">
                      {article.article_brief}
                    </div>
                    <div className="content">
                      {article.article_content}
                    </div>
                  </article>
                  {/* نهاية مقالة المدونة */}








                  <div className="comments">
                    <h5 className="comments-count">{comments.length} تعليقات</h5>
                    {showComments && (
                      comments.length > 0 ? (

                      comments.map((comment) => (
                        <div key={comment.comment_id} className="comment">
                          <div className="d-flex">
                           
                            <div>
                              <h5>
                                <Link to="">{comment.name}</Link>{" "}
                                <Link
                                  to="#"
                                  className="reply"
                                  onClick={() => handleReplyClick(comment.comment_id)}
                                >
                                  <i className="bi bi-reply-fill" />
                                  الرد
                                </Link>
                              </h5>
                              <time dateTime={comment.date}>
                                {formatTimestampToDate(comment.date)}
                              </time>
                              <p>{comment.comment_content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                      ) : (
                        <div className="no-comments">لا يوجد تعليقات حتى الآن. بادر بإبداء رأيك!</div>
                      )
                      
                    )}

                  </div>

                  <div className="toggle-comments mt-4 mb-4">
                    <button className="btn btn-primary" onClick={toggleComments}>
                      {showComments ? 'تقليل عرض التعليقات' : 'عرض التعليقات'}
                    </button>
                  </div>






                  <div className="reply-form mt-5">
                    <h5>اترك تعليقًا</h5>
                    <p>
                      لن يتم نشر عنوان بريدك الإلكتروني. هذه الحقول مطلوبة.
                    </p>
                    <form onSubmit={handleCommentSubmit}>
                      <div className="row">
                        {user_id ? (
                          <>
                            <div className="col-md-6 form-group mb-2">
                              <input
                                name="name"
                                type="text"
                                id="responderName"
                                className="form-control"
                                placeholder="اسمك"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6 form-group">
                              <input
                                name="email"
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                              />
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className="form-group mt-2">
                        <textarea
                          name="message"
                          id="message"
                          className="form-control mb-4"
                          placeholder="اكتب تعليقًا هنا..."
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="text-end">
                        <button type="submit" className="btn btn-primary">
                          إرسال التعليق
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* نهاية المحتوى الرئيسي */}
      </div>
    </>
  );
}

export default ArticleDetails;
