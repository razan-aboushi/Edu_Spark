import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

function ResetPassword()
 {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');





  // Handle submit the form for reset password
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين.');
      return;
    }

    try {
      // Perform backend API request to check email and phone number existence
      const response = await axios.post('http://localhost:4000/check-user-existence', {
        email,
        phone,
      });

      if (response.data.exists) {
        // User exists in the database, proceed with password reset
        const hashedPassword = await bcrypt.hash(password, 10);
        const resetResponse = await axios.post('http://localhost:4000/reset-password', {
          email,
          phone,
          password: hashedPassword,
        });

        if (resetResponse.status === 200) {
          setSuccess('تم إعادة تعيين كلمة المرور بنجاح!');
        } else {
          setError('فشلت عملية إعادة تعيين كلمة المرور.');
        }
      } else {
        setError('البريد الإلكتروني أو رقم الهاتف غير موجودين الرجاء التأكد منهما ثم إعادة المحاولة.');
      }
    } catch (error) {
      setError('حدث خطأ أثناء إعادة تعيين كلمة المرور.');
      console.error(error);
    }
  };



  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">إعادة تعيين كلمة المرور</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني:</label>
              <input
                type="email"
                id="email"
                className="form-control mb-4"
                style={{ width: '100%' }}
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(event)=> setEmail(event.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف:</label>
              <input
                type="text"
                id="phone"
                className="form-control mb-4"
                style={{ width: '100%' }}
                placeholder="أدخل رقم الهاتف"
                value={phone}
                onChange={(event)=>setPhone(event.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="password">كلمة المرور الجديدة:</label>
              <input
                type="password"
                id="password"
                className="form-control mb-4"
                style={{ width: '100%' }}
                placeholder="أدخل كلمة المرور الجديدة"
                value={password}
                onChange={(event)=>setPassword(event.target.value)}/>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">تأكيد كلمة المرور:</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control mb-4"
                style={{ width: '100%' }}
                placeholder="أدخل تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(event)=>setConfirmPassword(event.target.value)}/>
            </div>

            {success && <p className="text-success text-center mt-3">{success}</p>}
            {error && <p className="text-danger text-center mt-3">{error}</p>}

            <div className="text-center">
              <button type="submit" className="btn btn-primary rounded-pill">
                إعادة تعيين كلمة المرور
              </button>
            </div>

          </form>

          <p className="mt-3 text-center">
            <Link to="/login">تسجيل الدخول</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;