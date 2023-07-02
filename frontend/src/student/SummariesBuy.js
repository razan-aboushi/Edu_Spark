import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/style.css';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function SummariesBuy() {
  const [summaries, setSummaries] = useState([]);
  const { user_id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;

    const getSummaries = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/buySummaries/${user_id}`);
        setSummaries(response.data);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب الملخصات:', error);
      }
    };

    getSummaries();
  }, [user_id]);

  const handleDownload = (summaryFile) => {
    if (summaryFile) {
      const fileUrl = `http://localhost:4000/reports/${summaryFile}`;
      window.open(fileUrl, "_blank");
    }
  };

  if (summaries.length === 0) {
    return (
      <div className="summary-cards-container" style={{ marginTop: "200px" }}>
        <div className="no-summaries-message">
          <p>لا توجد مُلخصات مشتراة حتى الأن، سارع في الحصول على واحد و قُد تُعلمك نحو الأفضل.</p>
        </div>
      </div>
    );
  }

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="summary-cards-container">
      {summaries.map((summary) => (
        <div className="summary-cardBuy" key={summary.summary_id}>
          <img src={`http://localhost:4000/images/${summary.summary_image}`} alt={summary.summary_title} className="summaryBuy-image" />
          <h3 className="summaryBuy-title">{summary.summary_title}</h3>
          <p className="summaryBuy-brief">{summary.summary_brief}</p>
          <p className="purchase-date">تم الشراء في تاريخ: {convertTimestampToDate(summary.purchaseDate)}</p>
          <button className="downloadSummary-button" onClick={() => handleDownload(summary.summary_file)}>
            تحميل الملخص
          </button>
        </div>
      ))}
    </div>
  );
}

export default SummariesBuy;
