import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [subscriberCounts, setSubscriberCounts] = useState({});
  const [subscriberCountSummaries, setSubscriberCountsSummaries] = useState({});

  useEffect(() => {
    getCourses();
    getSummaries();
  }, []);


  // Get courses for the user
  const getCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwt_decode(token);
        const user_id = decodedToken.userId;

        const response = await axios.get(`http://localhost:4000/user-courses/${user_id}`);
        setCourses(response.data);

        // get subscriber counts for each course
        const courseIds = response.data.map(course => course.course_id);
        console.log(courseIds)
        const subscriberCounts = await Promise.all(courseIds.map(async courseId => {
          const subscriberResponse = await axios.get(`http://localhost:4000/courses/${courseId}/subscribers`);
          return {
            courseId,
            subscriberCount: subscriberResponse.data.subscriberCount
          };
        }));

        const subscriberCountMap = {};
        subscriberCounts.forEach(count => {
          subscriberCountMap[count.courseId] = count.subscriberCount;
        });
        setSubscriberCounts(subscriberCountMap);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };



  // get summaries from the databse for the teacher
  const getSummaries = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwt_decode(token);
        const user_id = decodedToken.userId;

        const response = await axios.get(`http://localhost:4000/user-summaries/${user_id}`);
        setSummaries(response.data);

        // Fetch subscriber counts for each summary
        const summaryIds = response.data.map(summary => summary.summary_id);
        const subscriberCounts = await Promise.all(summaryIds.map(async summaryId => {
          const subscriberResponse = await axios.get(`http://localhost:4000/summaries/${summaryId}/subscribers`);
          return {
            summaryId,
            subscriberCount: subscriberResponse.data.subscriberCount
          };
        }));

        const subscriberCountMap = {};
        subscriberCounts.forEach(count => {
          subscriberCountMap[count.summaryId] = count.subscriberCount;
        });
        setSubscriberCountsSummaries(subscriberCountMap);
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };




  // convert the timestamp to date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US');
  };

  // change the color of the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'مقبول':
        return 'green';
      case 'قيد الإنتظار':
        return 'gray';
      case 'مرفوض':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <section id="ManageCourses" className="text-right mt-5">
      <h4 className="text-center">دوراتي المُقدمة</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>

        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              style={{
                width: '300px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                margin: '10px',
                transition: 'box-shadow 0.3s',
              }}
              key={course.course_id}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }} >
              {/* Add the status card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '30px',
                  backgroundColor: getStatusColor(course.course_status),
                  color: 'white',
                }}>
                {course.course_status}
              </div>

              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
                  src={`http://localhost:4000/images/${course.course_image}`}
                  alt="صورة الدورة" width="100%"
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h5 style={{ fontSize: '18px', marginBottom: '10px' }}>{course.course_title}</h5>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                  السعر: {course.course_price === "0" ? (
                    <span style={{ color: 'green' }}>مجاني</span>
                  ) : (
                    <span>{course.course_price} د.أ</span>
                  )}              </p>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>{course.university}</p>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                  عدد المشتركون: {subscriberCounts[course.course_id] || 0}

                </p>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                  وقت البدء: {course.start_time} {'  -  '} وقت الإنتهاء: {course.end_time}
                </p>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                  تاريخ البدء: {formatDate(course.start_date)}
                </p>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                  تاريخ الإنتهاء: {formatDate(course.end_date)}
                </p>
                {course.course_status === 'مرفوض' && (
                  <p style={{ fontSize: '14px', marginBottom: '5px', marginTop: '10px', color: 'red' }}>
                    سبب الرفض: {course.rejection_reason}
                  </p>
                )}
              </div>
            </div>
          ))) : (<div className='mt-3'>لم تقّم بإضافة أيّة دورة حتى الأن</div>)}
      </div>

      {/* Section to display user added summaries */}
      <section className="text-right mt-5 mb-5">
        <h4 className="text-center">مُلخصاتي المُضافة</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {summaries.length > 0 ? (
            summaries.map((summary) => (
              <div
                style={{
                  width: '300px',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  margin: '10px',
                  transition: 'box-shadow 0.3s',
                }}
                key={summary.summary_id}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '30px',
                    backgroundColor: getStatusColor(summary.summary_status),
                    color: 'white',
                  }}>
                  {summary.summary_status}
                </div>


                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
                    src={`http://localhost:4000/images/${summary.summary_image}`}
                    alt="صورة الدورة"
                  />
                </div>

                <div style={{ padding: '20px' }}>
                  <h5 style={{ fontSize: '18px', marginBottom: '10px' }}>{summary.summary_title}</h5>
                  <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                    السعر: {summary.summary_price === "0" ? (
                      <span style={{ color: 'green' }}>مجاني</span>
                    ) : (
                      <span>{summary.summary_price} د.أ</span>
                    )}
                  </p>
                  <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                    عدد المُشترون: {subscriberCountSummaries[summary.summary_id] || 0}
                  </p>
                  <p style={{ fontSize: '14px', marginBottom: '5px' }}>
                    وصف المُلخص : {summary.summary_brief}
                  </p>
                  {summary.summary_status === 'مرفوض' && (
                    <p style={{ fontSize: '14px', marginBottom: '5px', marginTop: '10px', color: 'red' }}>
                      سبب الرفض: {summary.rejection_reason}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>لم تقّم بإضافة أيّة مُلخص حتى الأن</div>
          )}
        </div>
      </section>
    </section>
  );
}

export default ManageCourses;