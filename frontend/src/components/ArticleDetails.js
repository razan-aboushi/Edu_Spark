import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../css/style.css";

function ArticleDetails() 
{
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [showComments, setShowComments] = useState(false);

  const { article_id } = useParams();
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken ? decodedToken.userId : null;


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




  // Toggle the display of comments
  const toggleComments = () => {
    setShowComments(!showComments);
  };




  // Function to delete a comment
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/comments/${commentId}`);
      // Refresh the comments after deletion
      getComments();
      Swal.fire('نجاح', 'تم حذف التعليق بنجاح!', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      Swal.fire('خطأ', 'حدث خطأ أثناء حذف التعليق.', 'error');
    }
  };

  // Function to edit a comment
  const editComment = async (commentId, updatedContent) => {
    try {
      await axios.put(`http://localhost:4000/comments/${commentId}`, {
        comment_content: updatedContent,
      });
      // Refresh the comments after editing
      getComments();
      Swal.fire('نجاح', 'تم تعديل التعليق بنجاح!', 'success');
    } catch (error) {
      console.error('Error editing comment:', error);
      Swal.fire('خطأ', 'حدث خطأ أثناء تعديل التعليق.', 'error');
    }
  };


  

  if (!article) {
    return <div className='m-5'>جارٍ تحميل المقالات...</div>;
  }


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
                                 {comment.name}{" "}
                                  {user_id === comment.user_id && (
                                    <div className="dropdown d-inline">
                                      <button
                                        className="btn btn-link btn-sm dropdown-toggle"
                                        type="button"
                                        id={`commentDropdown${comment.comment_id}`}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      ></button>
                                      <ul
                                        className="dropdown-menu"
                                        aria-labelledby={`commentDropdown${comment.comment_id}`}
                                      >
                                        <li>
                                          <button
                                            className="dropdown-item text-center"
                                            onClick={() => {
                                              Swal.fire({
                                                title: 'تعديل التعليق',
                                                input: 'textarea',
                                                inputValue: comment.comment_content,
                                                showCancelButton: true,
                                                confirmButtonText: 'حفظ',
                                                cancelButtonText: 'إلغاء',
                                              }).then((result) => {
                                                if (result.isConfirmed) {
                                                  const updatedContent = result.value;
                                                  editComment(comment.comment_id, updatedContent);
                                                }
                                              });
                                            }}
                                          >
                                            تعديل
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            className="dropdown-item text-center"
                                            onClick={() => {
                                              Swal.fire({
                                                title: 'حذف التعليق',
                                                text: 'هل أنت متأكد أنك تريد حذف هذا التعليق؟',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonText: 'حذف',
                                                cancelButtonText: 'إلغاء',
                                              }).then((result) => {
                                                if (result.isConfirmed) {
                                                  deleteComment(comment.comment_id);
                                                }
                                              });
                                            }}
                                          >
                                            حذف
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
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
                    <h5 className='mb-4'>اترك تعليقًا</h5>

                    <form onSubmit={handleCommentSubmit}>

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
