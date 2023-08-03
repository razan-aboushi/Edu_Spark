import React, { useState } from 'react';
import '../css/style.css';
import classNames from 'classnames';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddArticleForm() 
{
  const [articleData, setArticleData] = useState({
    article_title: '',
    article_brief: '',
    article_content: '',
    article_image: null
  });


  // Handle input changes and update the articleData state
  function handleInputChange(event) 
  {
    const { name, value } = event.target;
    setArticleData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }



  // Handle image changes and update the articleData state
  function handleImageChange(event) {
    const files = event.target.files;
    const file = files[0];
    setArticleData((prevState) => ({
      ...prevState,
      article_image: file,
    }));
  }



  // Submit the article
  async function onSubmit(event) 
  {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('article_title', articleData.article_title);
      formData.append('article_brief', articleData.article_brief);
      formData.append('article_content', articleData.article_content);
      formData.append('article_image', articleData.article_image);

      // Make a POST request to add the article
      await axios.post('http://localhost:4000/AddArticle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message
      Swal.fire('نجاح', 'تمت إضافة المقال بنجاح!', 'success');

      // Clear the form data
      setArticleData({
        article_title: '',
        article_brief: '',
        article_content: '',
        article_image: null,
      });
    } catch (error) {
      // Show error message
      Swal.fire('خطأ', 'فشل في إضافة المقال', 'error');
    }
  }


  // Save the article draft
  function saveDraft() 
  {
    localStorage.setItem('articleDraft', JSON.stringify(articleData));
    Swal.fire('نجاح', 'تم حفظ المقال المسودة بنجاح!', 'success');
  }


  // Load the saved article draft
  function loadDraft() 
  {
    const savedDraft = localStorage.getItem('articleDraft');
    if (savedDraft) 
    {
      setArticleData(JSON.parse(savedDraft));
      Swal.fire('نجاح', 'تم استعادة المقال المسودة بنجاح!', 'success');
    } else {
      Swal.fire('خطأ', 'لا توجد مقالة مسودة محفوظة', 'error');
    }
  }




  return (
    <div className={classNames('text-center', 'fadeInUp', 'mt-5', 'mb-5')} data-wow-delay="0.1s">
      <form
        id="formAddArticle"
        onSubmit={onSubmit}
        className={classNames('form-container', 'custom-form')}
        style={{ width: '100%', maxWidth: '750px', padding: '20px', margin: '0 auto' }}
      >
        <div className="form-group">
          <label htmlFor="title" className="mt-3 mb-3">
            العنوان:
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="article_title"
            value={articleData.article_title}
            onChange={handleInputChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="description" className="mt-3 mb-3">
            الوصف:
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            name="article_brief"
            value={articleData.article_brief}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="mt-3 mb-3">
            المحتوى:
          </label>
          <textarea
            className="form-control"
            id="content"
            rows="10"
            name="article_content"
            value={articleData.article_content}
            onChange={handleInputChange}
          />

        </div>
        <div className="form-group mt-3">
          <label htmlFor="images" className="me-2 mt-3 mb-3">
            الصور:
          </label>
          <input
            type="file"
            className="form-control-file"
            id="images"
            multiple
            name="article_image"
            onChange={handleImageChange}
          />
        </div>
        <div className="button-container mt-3 text-center">
          <button type="submit" className="btn-primary buttonInAddArticle">
            نشر
          </button>
          <button type="button" className="btn-secondary buttonInAddArticle me-2" onClick={saveDraft}>
            حفظ كمسودة
          </button>
          <button type="button" className="btn-secondary buttonInAddArticle me-2" onClick={loadDraft}>
            استعادة المسودة
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddArticleForm;
