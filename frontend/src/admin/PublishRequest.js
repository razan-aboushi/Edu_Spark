import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/style.css';

function PublishRequest() {
  const [data, setData] = useState([]);

  const handleApprove = async (id) => {
    try {
      // Send approve request to the server
      await axios.put(`http://localhost:4000/summaries/${id}/approveSummary`);

      // Update the data state by removing the approved item
      setData((prevData) => prevData.filter((item) => item.summary_id !== id));

      // Notify the user about the approval
      Swal.fire('تم بنجاح', 'تمت الموافقة على طلب الملخص.', 'success');
    } catch (error) {
      console.log('Error approving request:', error);
      Swal.fire('خطأ', 'فشل في الموافقة على طلب الملخص.', 'error');
    }
  };

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
            return axios
              .put(`http://localhost:4000/summaries/${id}/rejectSummary`, { reason: inputValue })
              .then(() => {
                // Update the data state by removing the rejected item
                setData((prevData) => prevData.filter((item) => item.summary_id !== id));
                return inputValue;
              })
              .catch((error) => {
                console.log('Error rejecting request:', error);
                Swal.showValidationMessage('فشل في رفض طلب الملخص.');
              });
          } else {
            Swal.showValidationMessage('يرجى إدخال سبب الرفض.');
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (reason) {
        // Notify the user about the rejection and provide the reason
        Swal.fire('تم بنجاح', `تم رفض طلب الملخص. السبب: ${reason}`, 'success');
      }
    } catch (error) {
      console.log('Error rejecting request:', error);
      Swal.fire('خطأ', 'فشل في رفض طلب الملخص.', 'error');
    }
  };

  useEffect(() => {
    fetchPendingSummaries();
  }, []);

  const fetchPendingSummaries = async () => {
    try {
      const response = await axios.get('http://localhost:4000/summaries/pending');
      const pendingSummaries = response.data;
      setData(pendingSummaries);
    } catch (error) {
      console.log('Error fetching pending summaries:', error);
    }
  };

  if (!data) {
    return <div>لا توجد ملخصات معلقة.</div>;
  }

  const viewSummary = (fileUrl) => {
    window.open(fileUrl, '_blank');
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
            {data.map((item) => (
              <tr key={item.summary_id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.summary_title}</td>
                <td>{item.summary_brief}</td>
                <td>
                      {item.summary_price === "0" ? (
                        <span style={{ color: 'green' }}>مجاني</span>
                      ) : (
                        <span>{item.summary_price} د.أ</span>
                      )} </td>
                
                <td>
                  <a href="#" onClick={() => viewSummary(`http://localhost:4000/reports/${item.summary_file}`)}>
                    تحميل ملف PDF
                  </a>
                </td>
                <td>
                  <button className="approve-btn btn-primary buttonInAddArticle m-3 ms-3" onClick={() => handleApprove(item.summary_id)}>
                    الموافقة
                  </button>
                  <button className="reject-btn btn-primary buttonInAddArticle m-3" onClick={() => handleReject(item.summary_id)} style={{width:"105px"}}> 
                    رفض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PublishRequest;
