import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/UserProfile.css";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function CourseCalendar() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 2;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;

    const getMyCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/reservationCourses/${user_id}`);
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getMyCourses();
  }, []);

  // convert the timestamp to date
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  }

  // Function to check if a course has ended
  function hasCourseEnded(endDate) {
    const currentDate = new Date();
    return new Date(endDate) < currentDate;
  }

  // Get current courses to display on the current page, sorted by start_date
  const sortedCourses = courses.slice().sort((a, b) => new Date(a.start_date) - new Date(b.end_date));
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Function to handle page change
  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
  }


  return (

    <section id="CourseCalender">
      <div className="container mt-5 mb-3">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="cardCalender">
              <div className="card-header" style={{ backgroundColor: "#06BBCC" }}>
                <h4 className="text-center">موعد الدورات القادمة</h4>
              </div>
              <div className="card-bodyCalender">
                {currentCourses.length === 0 ? (
                  <p className="text-center mt-5">لا توجد مواعيد دورات قريبة حتى الأن ، سارع في حجز دورة و إكتسب المعرفة</p>
                ) : (
                  <div className="list-group">
                    {currentCourses.map((course) => (
                      <>
                        {hasCourseEnded(course.end_date) ? (
                          <div className="list-group-item list-group-item-action" key={course.course_id}>
                            <h5 className="mb-3">{course.course_title}</h5>
                            <p> وصف الدورة :{course.course_brief}</p>
                            <h6 className="mb-3">تاريخ بداية الدورة : من {formatDate(course.start_date)} إلى {formatDate(course.end_date)}</h6>
                            <h6>الوقت: من {course.start_time} إلى {course.end_time}</h6>
                            <h6 >موقع تقديم الكورس: أونلاين </h6>
                            <p className='mt-4' style={{ color: "red" }}>لقد إنتهى موعد تقديم الدورة</p>
                          </div>
                        ) : (
                          <Link
                            target='_blank'
                            key={course.course_id}
                            to={course.connection_channel}
                            className="list-group-item list-group-item-action"
                          >
                            <h5 className="mb-3">{course.course_title}</h5>
                            <p> وصف الدورة :{course.course_brief}</p>
                            <h6 className="mb-3">تاريخ بداية الدورة : من {formatDate(course.start_date)} إلى {formatDate(course.end_date)}</h6>
                            <h6>الوقت: من {course.start_time} إلى {course.end_time}</h6>
                            <h6 >موقع تقديم الكورس: أونلاين </h6>
                            <p className='mt-4' style={{ color: "red" }}>إنقر للبدء</p>
                          </Link>
                        )}
                      </>
                    ))}
                  </div>
                )}


                {/* Pagination for the page */}
                {courses.length > coursesPerPage && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(index + 1)}>
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}



              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseCalendar;