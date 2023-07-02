import React from 'react';
import "../css/style.css";
import { Link } from 'react-router-dom';

function Error404() {
  return (
    <div className="error-container">
      <img
        className="error-image"
        src={`https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?w=2000`}
        alt="Error 404"
      />
      <h1 className="error-text mb-5">أووبس! الصفحة غير موجودة</h1>
      <Link to="/">  <button className='buttonInAddArticle'>
        العودة للصفحة الرئيسية
      </button>
      </Link>
    </div>
  );
}

export default Error404;
