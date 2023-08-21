import React, { useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddArticleForm() 
{
  const [articleData, setArticleData] = useState({
    article_title: '',
    article_brief: '',
    article_content: '',
    article_content2: '',
    article_image: null
  });


  // Handle input changes and update the articleData state
  function handleInputChange(event) {
    const { name, value } = event.target;

    setArticleData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  }



  // Handle image changes and update the article Data state
  function handleImageChange(event) {
    const files = event.target.files;
    const file = files[0];
    setArticleData((prevState) => ({
      ...prevState,
      article_image: file,
    }));
  }



  // Submit the article "Add new article"
  async function onSubmit(event) {
    event.preventDefault();

    // Show a confirmation modal before submitting
    const confirmResult = await Swal.fire({
      title: 'تأكيد الإضافة',
      text: 'هل أنت متأكد أنك تريد إضافة المقالة؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم, أضف المقالة',
      cancelButtonText: 'لا, إلغاء',
    });

    if (confirmResult.isConfirmed) {
      try {
        const formData = new FormData();
        formData.append('article_title', articleData.article_title);
        formData.append('article_brief', articleData.article_brief);
        formData.append('article_content', articleData.article_content);
        formData.append('article_content2', articleData.article_content2);
        formData.append('article_image', articleData.article_image);

        await axios.post('http://localhost:4000/AddArticle', formData);

        // Show success message
        Swal.fire('نجاح', 'تمت إضافة المقالة بنجاح!', 'success');

        // Clear the form data "Reset the form"
        setArticleData({
          article_title: '',
          article_brief: '',
          article_content: '',
          article_content2: '',
          article_image: null,
        });
      } catch (error) {
        // Show error message
        Swal.fire('خطأ', 'فشل في إضافة المقالة', 'error');
      }
    }
  }



  // Save the article draft
  function saveDraft() {
    localStorage.setItem('articleDraft', JSON.stringify(articleData));
    Swal.fire('نجاح', 'تم حفظ المقالة المسودة بنجاح!', 'success');
  }


  // Load the saved article draft
  function loadDraft() {
    const savedDraft = localStorage.getItem('articleDraft');
    if (savedDraft) {
      setArticleData(JSON.parse(savedDraft));
      Swal.fire('نجاح', 'تم استعادة المقالة المسودة بنجاح!', 'success');
    } else {
      Swal.fire('خطأ', 'لا توجد مقالة مسودة محفوظة', 'error');
    }
  }



  return (
    <div className='text-center fadeInUp mt-5 mb-5' data-wow-delay="0.1s">
      <form
        id="formAddArticle"
        onSubmit={onSubmit}
        className='form-container custom-form'
        style={{ width: '100%', maxWidth: '750px', padding: '20px', margin: '0 auto' }}>
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
            onChange={handleInputChange} />
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
            onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="mt-3 mb-3">
            الفقرة الأولى:
          </label>
          <textarea
            className="form-control"
            id="content"
            rows="7"
            name="article_content"
            value={articleData.article_content}
            onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="content1" className="mt-3 mb-3">
            الفقرة الثانية:
          </label>
          <textarea
            className="form-control"
            id="content1"
            rows="7"
            name="article_content2"
            value={articleData.article_content2}
            onChange={handleInputChange} />
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
            onChange={handleImageChange} />
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