import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import "../css/UserProfile.css";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function CourseCalendar() {

  const [courses, setCourses] = useState([]);
  const user_id = useParams();



  // To get the data from the Database
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




  return (
    <section id="CourseCalender">
      <div className="container  mt-5 mb-3">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="cardCalender">
              <div className="card-header" style={{ backgroundColor: "#06BBCC" }}>
                <h4 className="text-center">موعد الدورات القادمة</h4>
              </div>
              <div className="card-bodyCalender">
                <div className="list-group">
                  {courses.map((course) => (
                    <Link target='_blank'
                      key={course.course_id}
                      to={course.connection_channel}
                      className="list-group-item list-group-item-action"
                    >
                      <h5 className="mb-3">{course.course_title}</h5>
                      <p> وصف الدورة :{course.course_brief}</p>
                      <h6 className="mb-3">تاريخ بداية الدورة : من  {formatDate(course.start_date)}  إلى  {formatDate(course.end_date)}</h6>
                      <h6>الوقت: من   {course.start_time} إلى {course.end_time}</h6>
                      <h6 >موقع تقديم الكورس: أونلاين </h6>

                      <p className='mt-4' style={{color:"red"}}>إنقر للبدء</p>

                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseCalendar;
