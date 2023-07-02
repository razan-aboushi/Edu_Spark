import React from 'react';
import "../css/style.css";

function Error404() {
  return (
    <div className="error-container">
      <img
        className="error-image"
        src={`https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?w=2000`}
        alt="Error 404"
      />
      <h1 className="error-text">أووبس! الصفحة غير موجودة</h1>
    </div>
  );
}

export default Error404;
