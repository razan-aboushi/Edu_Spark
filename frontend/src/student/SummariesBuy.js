import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/style.css';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function SummariesBuy() {
  const [summaries, setSummaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 
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

  // Calculate the indexes of the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = summaries.slice(indexOfFirstItem, indexOfLastItem);

  // Change the current page number
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // to open the pdf file
  const handleDownload = (summaryFile) => {
    if (summaryFile) {
      const fileUrl = `http://localhost:4000/reports/${summaryFile}`;
      window.open(fileUrl);
    }
  };

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className='text-center'>
        <h6 className="section-title bg-white text-center text-primary px-3 mt-5">
          "مُلخصاتي"
        </h6>
      </div>

      {currentItems.length === 0 ? (
        <div className="summary-cards-container" style={{ marginTop: "100px" }}>
          <div className="no-summaries-message">
            <p>لا توجد مُلخصات مُشتراة حتى الأن، سارع في الحصول على واحد و قُد تُعلمك نحو الأفضل.</p>
          </div>
        </div>
      ) : (
        <div className="summary-cards-container">
          {currentItems.map((summary) => (
            <div className="summary-cardBuy" key={summary.summary_id}>
              <img src={`http://localhost:4000/images/${summary.summary_image}`} alt={summary.summary_title} className="summaryBuy-image" />
              <h3 className="summaryBuy-title">{summary.summary_title}</h3>
              <p className="summaryBuy-brief">{summary.summary_brief}</p>
              <p className="purchase-date">تم الشراء في تاريخ: {convertTimestampToDate(summary.purchaseDate)}</p>
              <button className="downloadSummary-button" onClick={() => handleDownload(summary.summary_file)}>
                تحميل المُلخص
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {summaries.length > itemsPerPage && (
        <ul className="pagination">
          {Array.from({ length: Math.ceil(summaries.length / itemsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default SummariesBuy;