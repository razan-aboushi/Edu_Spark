import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApprovedContent() 
 {
  const [activeTab, setActiveTab] = useState(1);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [approvedSummaries, setApprovedSummaries] = useState([]);

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

  return (
    <div className="container mt-5 text-center mb-5" style={{ borderRadius: "5px" }}>
      <div className="tabs mb-4" style={{ fontSize: "18px", fontWeight: "bold" }}>
        <button
          className={`tab mt-2 shadow ms-5 ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => handleTabChange(1)} style={{border:"1px solid gray", padding:"15px" , borderRadius:"15px"}}>
          الدورات المعتمدة
        </button>
        <button
          className={`tab shadow mt-2 ${activeTab === 2 ? 'active' : ''}`} style={{border:"1px solid gray", padding:"15px" , borderRadius:"15px"}}
          onClick={() => handleTabChange(2)}>
          المُلخصات المعتمدة
        </button>
      </div>

      <div className="content">
        {activeTab === 1 && (
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>عنوان الدورة</th>
                <th>ملخص الدورة</th>
              </tr>
            </thead>
            <tbody>
              {approvedCourses.map(course => (
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
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>عنوان المُلخص</th>
                <th>موجز المُلخص</th>
              </tr>
            </thead>
            <tbody>
              {approvedSummaries.map(summary => (
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
    </div>
  );
}

export default ApprovedContent;