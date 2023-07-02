import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/UserProfile.css";
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function FinancialDues() {
  const [transferData, setTransferData] = useState([]);

  const { user_id } = useParams();

  useEffect(() => {
    fetchTransferData();
  }, []);

  const fetchTransferData = async () => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? jwt_decode(token) : null;
    const user_id = decodedToken?.userId;

    try {
      const response = await axios.get(`http://localhost:4000/transfers/${user_id}`);
      const data = response.data;
      setTransferData(data);
    } catch (error) {
      console.log('Error fetching transfer data:', error);
    }
  };

const convertDateFormate = (timestamp)=>{

const date = new Date(timestamp);
return date.toLocaleDateString();
}


  return (
    <section className="container" id="MyFinancialDues">
      <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
        <h6 className="section-title bg-white text-center text-primary px-3 mt-5 mb-4">
          قائمة بالتحويلات المالية
        </h6>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered" aria-label="listOfTransfer">
          <thead>
            <tr style={{backgroundColor:"#06BBCC" , textAlign:"center"}}>
              <th>الإسم</th>
              <th>رقم المنتج</th>
              <th>المبلغ</th>
              <th>التاريخ</th>
              <th>عنوان الدورة</th>
              <th>عنوان الملخص</th>
            </tr>
          </thead>
          <tbody>
            {transferData.map((transfer) => (
              <tr key={transfer.transaction_id}>
                <td>{transfer.name}</td>
                <td>{transfer.summary_id}</td>
                <td>{transfer.amount} د.أ</td>
                <td>{convertDateFormate(transfer.enrollment_date)}</td>
                <td>{transfer.course_title}</td>
                <td>{transfer.summary_title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default FinancialDues;
