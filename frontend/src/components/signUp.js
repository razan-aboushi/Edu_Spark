import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';


function SignUp({ fetchUserData }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    gender: '',
    phone_number: '',
    birthdate: '',
    password: '',
    role: '',
    re_pass: '',
    agreeTerm: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();




  // Handle form sign up submit
  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:4000/SignUpRegister', {
          name: values.name,
          email: values.email,
          gender: values.gender,
          phone_number: values.phone_number,
          birthdate: values.birthdate,
          password: values.password,
          role: parseInt(values.role),
        });

        const data = response.data;

        if (data.error) {
          if (data.error === 'Email already exists') {
            setErrors({ email: 'Email already exists' });
          } else {
            setErrors({ general: 'Error registering user' });
          }
        }

        else {

          const { token } = response.data;
          localStorage.setItem('token', token);


          if (values.role === '3') {
            navigate('/UserProfileTeacher');
          } else if (values.role === '2') {
            navigate('/UserProfileStudent');
          } else if (values.role === '1') {
            navigate('/AdminSideBar');
          }
          fetchUserData();

        }
      } catch (error) {
        console.error('Error registering user:', error);
        setErrors({ general: 'Error registering user' });
      }
    }
  }


  useEffect(() => {
    // Fetch the email of the users from the database to check if is exists or not
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/usersEmailCheck');
        const userData = response.data;
        // Check if email exists in the fetched data
        const emailExists = userData.some(user => user.email === values.email);
        if (emailExists) {
          setErrors({ email: 'البريد الإلكتروني موجود من قبل' });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (values.email) {
      fetchData();
    }
  }, [values.email]);




  // Form validation
  function validateForm(data) {
    const errors = {};

    if (!data.name) {
      errors.name = 'الاسم مطلوب';
    } else if (data.name.length < 6) {
      errors.name = 'الاسم يجب أن يتكون على الأقل من 6 أحرف';
    }

    if (!data.email) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'صيغة البريد الإلكتروني غير صالحة';
    }

    if (!data.phone_number) {
      errors.phone_number = 'رقم الهاتف مطلوب';
    } else if (!/^\d{10}$/.test(data.phone_number)) {
      errors.phone_number = 'يجب أن يحتوي رقم الهاتف على 10 أرقام';
    }

    if (!data.birthdate) {
      errors.birthdate = 'تاريخ الميلاد مطلوب';
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(data.birthdate);
      if (selectedDate > currentDate) {
        errors.birthdate = 'تاريخ الميلاد غير صالح';
      }
    }

    if (!data.gender) {
      errors.gender = 'نوع الجنس مطلوب';
    }
    if (!data.role) {
      errors.role = 'نوع المستخدم مطلوب';
    }

    if (!data.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(data.password)) {
      errors.password = ' يجب أن تحتوي كلمة المرور على الأقل على 8 أحرف بالإضافة لوجود حرف كبير و أحرف صغيرة و رقم من ضمنها';
    }

    if (data.password !== data.re_pass) {
      errors.re_pass = 'كلمة المرور غير متطابقة';
    }

    if (!data.agreeTerm) {
      errors.agreeTerm = 'يجب الموافقة على الشروط والأحكام';
    }

    return errors;
  }




  return (
    <div className="main mt-5">
      <section className="signup">
        <div className="containerSignUp p-3">
          <div className="row signup-content p-3 me-1 ">
            <div className="col-12 col-md-6 mt-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="صورة تسجيل الدخول"
              />
            </div>
            <div className="col-lg-6 col-12">
              <form method="POST" className="register-form ms-5" id="registerForm" onSubmit={handleSubmit}>
                <div className="form-group12 mb-3">
                  <label htmlFor="name">
                    <i className="zmdi zmdi-account material-icons-name" />
                    الاسم الكامل
                  </label>
                  <input
                    className="signUpInput"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="اسمك الكامل"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group12 mb-3">
                  <label htmlFor="email">
                    <i className="zmdi zmdi-email" /> البريد الإلكتروني
                  </label>
                  <input
                    className="signUpInput"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="بريدك الإلكتروني: example@gmail.com"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group12 mb-3">
                  <label htmlFor="phoneNumber">
                    <i className="zmdi zmdi-phone" />
                    رقم الهاتف
                  </label>
                  <input
                    className="signUpInput"
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder={"0780577727"}
                    value={values.phone_number}
                    onChange={(e) => setValues({ ...values, phone_number: e.target.value })}
                  />
                  {errors.phone_number && <span className="error">{errors.phone_number}</span>}
                </div>

                <div className="form-group12 mb-3">
                  <label htmlFor="BirthOfDate">
                    <i className="zmdi zmdi-gender" /> تاريخ الميلاد
                  </label>
                  <input
                    className="signUpInput text-end"
                    type="date"
                    name="BirthOfDate"
                    id="BirthOfDate"
                    value={values.birthdate}
                    onChange={(e) => setValues({ ...values, birthdate: e.target.value })}
                  />
                  {errors.birthdate && <span className="error">{errors.birthdate}</span>}
                </div>

                {/* Other form fields */}
                <div className="form-group12 mb-3">
                  <label htmlFor="gender" className="me-3">
                    <i className="zmdi zmdi-gender" /> الجنس
                  </label>
                  <input
                    className="signUpInput"
                    type="radio"
                    name="gender"
                    id="gender1"
                    value="male"
                    checked={values.gender === "male"}
                    onChange={(e) => setValues({ ...values, gender: e.target.value })}
                  />{" "}
                  ذكر
                  <input
                    className="signUpInput"
                    type="radio"
                    name="gender"
                    id="gender2"
                    value="female"
                    checked={values.gender === "female"}
                    onChange={(e) => setValues({ ...values, gender: e.target.value })}
                  />{" "}
                  أنثى
                </div>
                {errors.gender && <span className="error mb-4">{errors.gender}</span>}

                <div className="form-group12 mb-3">
                  <label htmlFor="role" className="me-3">
                    <i className="zmdi zmdi-account-box text-left" /> نوع المستخدم
                  </label>
                  <select
                    className="signUpInputType"
                    name="role"
                    id="role"
                    style={{ width: "100%" }}
                    value={values.role}
                    onChange={(e) => setValues({ ...values, role: e.target.value })}>
                    <option value="">اختر نوع المستخدم</option>
                    <option value="3">المعلم</option>
                    <option value="2">الطالب</option>
                  </select>
                  {errors.role && <span className="error">{errors.role}</span>}
                </div>

                <div className="form-group12 mb-3">
                  <label htmlFor="pass">
                    <i className="zmdi zmdi-lock" />
                    كلمة المرور
                  </label>
                  <input
                    className="signUpInput"
                    type="password"
                    name="pass"
                    id="pass"
                    placeholder="كلمة المرور"
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })} />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>

                <div className="form-group12 mb-3">
                  <label htmlFor="re-pass">
                    <i className="zmdi zmdi-lock-outline" />
                    تأكيد كلمة المرور
                  </label>
                  <input
                    className="signUpInput"
                    type="password"
                    name="re_pass"
                    id="re_pass"
                    placeholder="أعد إدخال كلمة المرور"
                    value={values.re_pass}
                    onChange={(e) => setValues({ ...values, re_pass: e.target.value })} />
                  {errors.re_pass && <span className="error">{errors.re_pass}</span>}
                </div>

                {/* Terms of Service */}
                <div className="form-group12 mb-3">
                  <input
                    type="checkbox"
                    name="agree-term"
                    id="agree-term"
                    className="agree-term"
                    checked={values.agreeTerm}
                    onChange={(e) => setValues({ ...values, agreeTerm: e.target.checked })} />
                  <label className="signUpInput me-2" htmlFor="agree-term">
                    <span>
                      <span />
                    </span>
                    أوافق على{" "}
                    <Link to="/TermsOfService" target="_blank" className="term-service">
                      الشروط والأحكام
                    </Link>
                  </label>
                  {errors.agreeTerm && <div className="error mt-2 mb-4">{errors.agreeTerm}</div>}
                </div>

                <div className="form-group12 mb-3">
                  <input
                    type="submit"
                    name="submit"
                    id="submit"
                    className="form-submit btn btn-primary"
                    value="تسجيل" />
                </div>

                <div className="ms-3 term-service">

                  لديك حساب بالفعل؟
                  <HashLink to="/login#login" className='me-1'>
                    تسجيل الدخول
                  </HashLink>


                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;