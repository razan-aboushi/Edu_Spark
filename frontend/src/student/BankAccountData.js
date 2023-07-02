import React, { useState,useEffect } from 'react';
import '../css/UserProfile.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import bcrypt from 'bcryptjs';
import {useParams } from 'react-router-dom';

function BankAccountData() {
  const [fullName, setFullName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cvc, setCvc] = useState('');


  const { user_id } = useParams();


  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwt_decode(token);
          const user_id = decodedToken.userId;
          const response = await axios.get(`http://localhost:4000/user-profile/${user_id}`);
          // Fill in the name and email with the user's data
          setFullName(response.data.name);
          
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getUserProfile();
  }, []);









  function handleFullNameChange(event) {
    setFullName(event.target.value);
  }

  function handleAccountNumberChange(event) {
    setAccountNumber(event.target.value);
  }


  function handleCvcChange(event) {
    setCvc(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!fullName || !accountNumber || !cvc) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        text: 'الرجاء تعبئة جميع الحقول المطلوبة',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'موافق',
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const user_id = decodedToken.userId;
      console.log(user_id);

      // Encrypt the account number and CVC
      const encryptedAccountNumber = bcrypt.hashSync(accountNumber, 10);
      const encryptedCvc = bcrypt.hashSync(cvc, 10);

      // Display security message to the user
      Swal.fire({
        icon: 'info',
        title: 'تنبيه!',
        text: 'جميع المعلومات المدخلة ستتم معالجتها بشكل آمن ومُشفر.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'موافق',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`http://localhost:4000/UsersBankAccountsData/${user_id}`, {
              fullName,
              accountNumber: encryptedAccountNumber,
              cvc: encryptedCvc,

            })
            .then((response) => {
              // Handle the response from the server
              Swal.fire({
                icon: 'success',
                title: 'تم الحفظ!',
                text: 'تم حفظ المعلومات بنجاح!',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'موافق',
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    }

    // Reset the input fields after submitting
    setFullName('');
    setAccountNumber('');
  }

  return (
    <section className="container" id="BankAccountInfo">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="cardBank">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title bg-white text-center text-primary px-3 mt-5">
                أضف معلوماتك البنكية
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullname" className="mb-2">
                    إسمك الكامل على البطاقة :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    placeholder="أدخل إسمك الكامل على لبطاقة"
                    value={fullName}
                    onChange={handleFullNameChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accountNumber" className="mb-2 mt-2">
                    رقم حسابك البنكي أبآن "IBAN":
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="accountNumber"
                    placeholder="JO37 ARAB 1180 0000 0011 8267 0035 00"
                    value={accountNumber}
                    onChange={handleAccountNumberChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvc" className="mb-2 mt-2">
                    أدخل رقم ال cvc :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cvc"
                    placeholder="111"
                    value={cvc}
                    onChange={handleCvcChange}
                  />
                </div>

                <button type="submit" className="bttn  mt-3" id="saveBankInfo" style={{ backgroundColor: "#06BBCC" }}>
                  حفظ المعلومات
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BankAccountData;
