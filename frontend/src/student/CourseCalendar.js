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
        

        const currentDate = new Date();
        
        const sortedCourses = response.data.sort((a, b) => {
          if (new Date(a.start_date) > currentDate && new Date(b.start_date) > currentDate) {
            return new Date(a.start_date) - new Date(b.start_date); // Sort upcoming courses by start_date
          } else if (new Date(a.start_date) <= currentDate && new Date(b.start_date) > currentDate) {
            return 1; // Move ongoing courses to the end
          } else if (new Date(a.start_date) > currentDate && new Date(b.start_date) <= currentDate) {
            return -1; // Move upcoming courses to the beginning
          } else {
            return new Date(b.start_date) - new Date(a.start_date); // Sort ongoing courses by start_date
          }
        });

        setCourses(sortedCourses);

      } catch (error) {
        console.error(error);
      }
    };

    getMyCourses();
  }, []);


  // Convert the timestamp date to normal date
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  }

  // Check if the course end by compare its date with the current date
  function hasCourseEnded(endDate) {
    const currentDate = new Date();
    return new Date(endDate) < currentDate;
  }

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);


  // Make the pagination
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }


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
                  <p className="text-center mt-5">لا توجد مواعيد دورات قريبة حتى الأن، سارع في حجز دورة و اكتسب المعرفة</p>
                ) : (
                  <div className="list-group">
                    {currentCourses.map((course) => (
                      <div
                        className={`list-group-item list-group-item-action ${hasCourseEnded(course.end_date) ? 'ended-course' : ''}`}
                        key={course.course_id}
                      >
                        {hasCourseEnded(course.end_date) ? (
                          // Render ended course details
                          <>
                            <h5 className="mb-3">{course.course_title}</h5>
                            <p>وصف الدورة: {course.course_brief}</p>
                            <h6 className="mb-3">تاريخ بداية الدورة: من {formatDate(course.start_date)} إلى {formatDate(course.end_date)}</h6>
                            <h6>الوقت: من {course.start_time} إلى {course.end_time}</h6>
                            <h6>موقع تقديم الكورس: أونلاين</h6>
                            <p className='mt-4' style={{ color: "red" }}>لقد انتهى موعد تقديم الدورة</p>
                          </>
                        ) : (
                          // Render ongoing course details
                          <Link
                            target='_blank'
                            key={course.course_id}
                            to={course.connection_channel}
                            className="list-group-item list-group-item-action"
                          >
                            <h5 className="mb-3">{course.course_title}</h5>
                            <p>وصف الدورة: {course.course_brief}</p>
                            <h6 className="mb-3">تاريخ بداية الدورة: من {formatDate(course.start_date)} إلى {formatDate(course.end_date)}</h6>
                            <h6>الوقت: من {course.start_time} إلى {course.end_time}</h6>
                            <h6>موقع تقديم الكورس: أونلاين</h6>
                            <p className='mt-4' style={{ color: "red" }}>انقر للبدء</p>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {courses.length > coursesPerPage && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      {pageNumbers.map((pageNumber) => (
                        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(pageNumber)}>
                            {pageNumber}
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