import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/style.css';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPasswordHash = localStorage.getItem('password');

    if (savedEmail && savedPasswordHash) {
      setEmail(savedEmail);
      setPassword('');
      setRememberMe(true);
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });

      if (response.status === 200) {
        const data = response.data;
        console.log(data);

        if (rememberMe) {
          const passwordHash = await bcrypt.hash(password, 10);
          localStorage.setItem('email', email);
          localStorage.setItem('password', passwordHash);
        }

        const { role } = response.data;
        console.log(response.data);

        // save the token in local storage
        const { token } = response.data;
        localStorage.setItem('token', token);
        console.log(token);


        console.log(role);
        if (role === 1) {
          navigate('/AdminSideBar');
        } else if (role === 2) {
          navigate('/UserProfileStudent');
        } else if (role === 3) {
          navigate('/UserProfileTeacher');
        }

        window.location.reload();

      } else {
        const errorData = response.data;
        setError(errorData.error);
      }
    } catch (error) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور الصحيحين');
      console.error(error);
    }

  };

  return (
    <section className="vh-100" style={{ marginTop: '80px' }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="صورة تسجيل الدخول"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={handleSubmit}>
              {/* حقل البريد الإلكتروني */}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">
                  عنوان البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email1"
                  name="email"
                  className="form-control p-3 form-control-lg"
                  placeholder="أدخل عنوان بريد إلكتروني صحيح"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              {/* حقل كلمة المرور */}
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password1">
                  كلمة المرور
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password1"
                    name="name"
                    className="form-control p-3 form-control-lg"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    className="btn btn-outline-secondary" style={{ borderRadius: "5px" }}
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                {/* خانة الاختيار */}
                <div className="form-check mb-0">
                  <label className="form-check-label" htmlFor="form2Example3">
                    تذكرني
                  </label>
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="form2Example3"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                </div>
                <Link to="/ResetPassword" className="text-body">
                  هل نسيت كلمة المرور؟
                </Link>
              </div>

              <div className="text-center text-lg-end mt-4 pt-2">
                {error && <p className="text-danger mb-3">{error}</p>} {/* Error message */}

                <button
                  className="btnr btn-lg"
                  id="loginButton"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  type="submit"
                >
                  تسجيل الدخول
                </button>

                <div className="divider align-items-center my-4">
                  <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0">أو</p>
                  </div>
                  <div className="bttso d-flex flex-row align-items-center justify-content-center justify-content-lg-center">
                    <p className="lead fw-bold mb-2 me-3 ">تسجيل الدخول باستخدام</p>
                  </div>

                  <div className="bttso d-flex flex-row align-items-center justify-content-center">
                    <button
                      style={{ width: '35px', height: '35px', borderRadius: '10px' }}
                      type="button"
                      className="btn-primary btn-floating mx-1"
                    >
                      <i className="fab fa-facebook-f" />
                    </button>
                    <button
                      style={{ width: '35px', height: '35px', borderRadius: '10px' }}
                      type="button"
                      className="btn-primary btn-floating mx-1"
                    >
                      <i className="fab fa-google" />
                    </button>

                  </div>
                </div>

                <div className="text-right mt-5">
                  <p>
                    ليس لديك حساب؟
                    <HashLink to="/signUp" className="fw-bold" activeClassName="">
                      {' '}
                      سجّل الآن
                    </HashLink>
                  </p>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogIn;
