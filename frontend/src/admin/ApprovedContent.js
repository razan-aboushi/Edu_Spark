import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/style.css";


function ApprovedContent() {
  const [activeTab, setActiveTab] = useState(1);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [approvedSummaries, setApprovedSummaries] = useState([]);
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [currentSummaryPage, setCurrentSummaryPage] = useState(1);
  const itemsPerPage = 8;


  useEffect(() => {
    // get approved courses
    axios.get('http://localhost:4000/approvedCourses').then(response => {
      setApprovedCourses(response.data);
    }).catch(error => {
      console.log(error);
    });

    // get approved summaries
    axios.get('http://localhost:4000/approvedSummaries').then(response => {
      setApprovedSummaries(response.data);
    }).catch(error => {
      console.log(error);
    });
  }, []);

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleCoursePageChange = (pageNumber) => {
    setCurrentCoursePage(pageNumber);
  };

  const handleSummaryPageChange = (pageNumber) => {
    setCurrentSummaryPage(pageNumber);
  };

  const renderItems = (data, currentPage, renderFunction) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex).map(renderFunction);
  };


  // Pagination for the summary
  const totalCoursePages = Math.ceil(approvedCourses.length / itemsPerPage);
  const pageNumbersCourses = [];
  for (let r = 1; r <= totalCoursePages; r++) {
    pageNumbersCourses.push(r);
  }


  // Pagination for the summary
  const totalSummaryPages = Math.ceil(approvedSummaries.length / itemsPerPage);
  const pageNumbers = [];
  for (let r = 1; r <= totalSummaryPages; r++) {
    pageNumbers.push(r);
  }


  return (
    <div className="container mt-5 text-center mb-5" style={{ borderRadius: "5px" }}>
      <div className="tabs mb-4" style={{ fontSize: "18px", fontWeight: "bold" }}>
        <button
          className={`tabApproved mt-2 ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => handleTabChange(1)}>
          الدورات المعتمدة
        </button>
        <button
          className={`tabApproved mt-2 ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => handleTabChange(2)}>
          المُلخصات المعتمدة
        </button>
      </div>

      <div className="content">
        {activeTab === 1 && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>عنوان الدورة</th>
                <th>موجز الدورة</th>
              </tr>
            </thead>
            <tbody>
              {renderItems(approvedCourses, currentCoursePage, course => (
                <tr key={course.course_id}>
                  <td>{course.name}</td>
                  <td>{course.course_title}</td>
                  <td>{course.course_brief}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 2 && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>عنوان المُلخص</th>
                <th>موجز المُلخص</th>
              </tr>
            </thead>
            <tbody>
              {renderItems(approvedSummaries, currentSummaryPage, summary => (
                <tr key={summary.summary_id}>
                  <td>{summary.name}</td>
                  <td>{summary.summary_title}</td>
                  <td>{summary.summary_brief}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {activeTab === 1 && totalCoursePages > 1 && (
        <ul className="pagination justify-content-center">
          {pageNumbersCourses.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentCoursePage === pageNumber ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handleCoursePageChange(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      )}


      {activeTab === 2 && totalSummaryPages > 1 && (
        <ul className="pagination justify-content-center">
          {pageNumbers.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${currentSummaryPage === pageNumber ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handleSummaryPageChange(pageNumber)}>
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default ApprovedContent;