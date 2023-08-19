import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/style.css';

function PublishRequest()
 {
  const [data, setData] = useState([]);


// Handle when the admin approve the summary
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:4000/summaries/${id}/approveSummary`);

      // Update the data state by removing the approved item "summary"
      setData((prevData) => prevData.filter((item) => item.summary_id !== id));

      Swal.fire('تم بنجاح', 'تمت الموافقة على طلب المُلخص.', 'success');
    }
     catch (error) {
      console.log('Error approving request:', error);
      Swal.fire('خطأ', 'فشل في الموافقة على طلب المُلخص.', 'error');
    }
  };


  // Handle when the admin reject the summary
  const handleReject = async (id) => {
    try {
      // Prompt the admin to enter the reason for rejection
      const { value: reason } = await Swal.fire({
        title: 'أدخل سبب رفض المُلخص:',
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
            return axios.put(`http://localhost:4000/summaries/${id}/rejectSummary`, { reason: inputValue }).then(() => {
                // Update the data state by removing the rejected item "summary"
                setData((prevData) => prevData.filter((item) => item.summary_id !== id));
                return inputValue;
              }).catch((error) => {
                console.log('Error rejecting request:', error);
                Swal.showValidationMessage('فشل في رفض طلب المُلخص.');
              });
          } else {
            Swal.showValidationMessage('يرجى إدخال سبب الرفض.');
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (reason) {
        Swal.fire('تم بنجاح', `تم رفض طلب الملخص. السبب: ${reason}`, 'success');
      }
    } catch (error) {
      console.log('Error rejecting request:', error);
      Swal.fire('خطأ', 'فشل في رفض طلب الملخص.', 'error');
    }
  };

  
  useEffect(() => {
    getPendingSummaries();
  }, []);

  
  // Get the the summaries that have the pending status
  const getPendingSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:4000/summaries/pending');
      const pendingSummaries = response.data;
      setData(pendingSummaries);
    } catch (error) {
      console.log('Error fetching pending summaries:', error);
    }
  };

 

  // Open the PDF summary in the new tab
  const viewSummary = (fileUrl) => {
    window.open(fileUrl);
  };



  return (
    <div className="text-center mt-4 d-flex justify-content-center">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>اسم الملخص</th>
              <th>الوصف</th>
              <th>السعر</th>
              <th>المُلخص</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>

            {data.length === 0 ? (

              <div className='text-center mt-5'>لا توجد طلبات مُلخصات مُعلقة حتى الأن</div>) 
              :
              (data.map((item) => (
                  <tr key={item.summary_id}>
                    <td className='text-end'>{item.name}</td>
                    <td className='text-end'>{item.email}</td>
                    <td className='text-end'>{item.summary_title}</td>
                    <td className='text-end'>{item.summary_brief}</td>
                    <td>
                      {item.summary_price === "0" ? (
                        <span style={{ color: 'green' }}>مجاني</span>
                      ) : (
                        <span>{item.summary_price} د.أ</span>
                      )} </td>

                    <td>
                      <a onClick={() => viewSummary(`http://localhost:4000/reports/${item.summary_file}`)} style={{ cursor: "pointer" }}>
                        تحميل ملف PDF
                      </a>
                    </td>
                    <td>
                      <button className="approve-btn btn-primary buttonInAddArticle m-3 ms-3" onClick={() => handleApprove(item.summary_id)}>
                        الموافقة
                      </button>
                      <button className="reject-btn btn-primary buttonInAddArticle m-3" onClick={() => handleReject(item.summary_id)} style={{ width: "105px" }}>
                        رفض
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

export default PublishRequest;