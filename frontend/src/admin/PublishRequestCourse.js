import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/style.css';

function PublishRequestCourse() {
  const [data, setData] = useState([]);


  
  // Handle when the admin approve the course
  const handleApprove = async (id) => {
    try {
      // Send approve request to the server
      await axios.put(`http://localhost:4000/courses/${id}/approveCourse`);

      // Update the data state by removing the approved item
      setData((prevData) => prevData.filter((item) => item.course_id !== id));

      // Notify the user about the approval
      Swal.fire('تم بنجاح', 'تمت الموافقة على طلب الدورة.', 'success');
    } catch (error) {
      console.log('Error approving request:', error);
      Swal.fire('خطأ', 'فشل في الموافقة على طلب الدورة.', 'error');
    }
  };


  // Handle when the admin reject the course
  const handleReject = async (id) => {
    try {
      // Prompt the admin to enter the reason for rejection
      const { value: reason } = await Swal.fire({
        title: 'أدخل سبب الرفض:',
        input: 'text',
        inputPlaceholder: 'أدخل السبب هنا...',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'رفض',
        showLoaderOnConfirm: true,
        preConfirm: (inputValue) => {
          if (inputValue) {
            // Send reject request to the server with the reason
            return axios.put(`http://localhost:4000/courses/${id}/rejectCourse`, { reason: inputValue }).then(() => {
              // Update the data state by removing the rejected item
              setData((prevData) => prevData.filter((item) => item.course_id !== id));
              return inputValue;
            }).catch((error) => {
              console.log('Error rejecting request:', error);
              Swal.showValidationMessage('فشل في رفض طلب الدورة.');
            });
          } else {
            Swal.showValidationMessage('يرجى إدخال سبب الرفض.');
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (reason) {
        // Notify the user about the rejection and provide the reason
        Swal.fire('تم بنجاح', `تم رفض طلب الدورة. السبب: ${reason}`, 'success');
      }
    } catch (error) {
      console.log('Error rejecting request:', error);
      Swal.fire('خطأ', 'فشل في رفض طلب الدورة.', 'error');
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  // get the courses that have the pending status
  const fetchPendingCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/courses/pending');
      const pendingCourses = response.data;
      setData(pendingCourses);
    } catch (error) {
      console.log('Error fetching pending courses:', error);
    }
  };

  if (!data) {
    return <div>لا توجد دورات مُعلقة.</div>;
  }

  return (
    <div className="text-center mt-4 d-flex justify-content-center">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>عنوان الدورة "الكورس"</th>
              <th>الوصف</th>
              <th>السعر</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (<div className='text-center mt-5'>لا توجد طلبات دورات مُعلقة حتى الأن</div>
            ) : (
              data.map((item) => (
                <tr key={item.course_id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.course_title}</td>
                  <td>{item.course_description}</td>
                  <td>
                    {item.course_price === "0" ? (
                      <span style={{ color: 'green' }}>مجاني</span>
                    ) : (
                      <span>{item.course_price} د.أ</span>
                    )} </td>

                  <td>
                    <button className="approve-btn btn-primary buttonInAddArticle m-3 ms-3" onClick={() => handleApprove(item.course_id)}>
                      الموافقة
                    </button>
                    <button className="reject-btn btn-primary buttonInAddArticle m-3" onClick={() => handleReject(item.course_id)} style={{ width: "105px" }}>
                      الرفض
                    </button>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PublishRequestCourse;