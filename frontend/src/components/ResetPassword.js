import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

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
          {success && <p className="text-success">{success}</p>}
          {error && <p className="text-danger">{error}</p>}
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
                onChange={handleEmailChange}
              />
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
                onChange={handlePhoneChange}
              />
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
                onChange={handlePasswordChange}
              />
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
                onChange={handleConfirmPasswordChange}
              />
            </div>
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
