import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import "../css/UserProfile.css";
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

function EditProfileSection() {
  const [userProfile, setUserProfile] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [emailError, setEmailError] = useState('');
  const { user_id } = useParams();
  // To get the user data
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
          const decodedToken = jwt_decode(token);
          console.log(decodedToken);
          const user_id = decodedToken.userId;
          console.log(user_id);
          const response = await axios.get(`http://localhost:4000/user-profile/${user_id}`);

          const passwordFromInput = password;

          // Decrypt the password
          const decryptedPassword = await bcrypt.compare(passwordFromInput, response.data.password);

          const formattedProfile = {
            ...response.data,
            birthdate: response.data.birthdate ? new Date(response.data.birthdate).toISOString().slice(0, 10) : '',
            password: decryptedPassword ? passwordFromInput : '',
          };

          setUserProfile(formattedProfile);
          setName(formattedProfile.name);
          setPhoneNumber(formattedProfile.phone_number);
          setBirthdate(formattedProfile.birthdate);
          setPassword(formattedProfile.password);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getUserProfile();
  }, []);




  const handleUpdateProfile = async () => {


    try {
      const response = await axios.get('http://localhost:4000/getAllUserInfoData');
      const users = response.data;
      console.log(users);

      // Show a confirmation pop-up message
      Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل ترغب في تحديث ملفك الشخصي؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا',
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updatedUserData = {
            name,
            phone_number,
            birthdate,
          };

          if (password) {
            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            updatedUserData.password = encryptedPassword;
          }

          const token = localStorage.getItem('token');
          console.log(token);
          if (token) {
            const decodedToken = jwt_decode(token);
            console.log(decodedToken);
            const user_id = decodedToken.userId;
            console.log(user_id);

            axios
              .put(`http://localhost:4000/userUpdateInfo/${user_id}`, updatedUserData)
              .then((response) => {
                Swal.fire('نجاح', 'تم تحديث الملف الشخصي بنجاح!', 'success');
              })
              .catch((error) => {
                console.error('حدث خطأ أثناء تحديث ملف المستخدم:', error);
                Swal.fire('خطأ', 'فشل تحديث الملف الشخصي.', 'error');
              });
          }
        }

      
      });
    } catch (error) {
      console.error('An error occurred while getting the user data:', error);
    }
  };


  const handleCancel = () => {
    // Reset the form fields
    setName(userProfile.name);
    setPhoneNumber(userProfile.phone_number);
    setBirthdate(userProfile.birthdate);
    setPassword(userProfile.password);
  };

  return (
    <>
      <section id="EditProfile" className="text-right mt-5">
        <div className="container">
          <div className="row gutters d-flex justify-content-center">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
              <div className="cardImage">
                <div
                  className="rounded-top text-white d-flex flex-row"
                  style={{ backgroundColor: "#06BBCC", height: 200 }}
                >
                  <div
                    className="ms-4 mt-5 d-flex flex-column"
                    style={{ width: 150 }}
                  ></div>
                  <div className="ms-2" style={{ marginTop: 130 }}>
                    إسمك هنا
                    <h5>{name}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row gutters d-flex justify-content-center">
            <div className="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-10">
              <div className="card11">
                <div className="card-body">
                  <div className="row gutters justify-content-center">
                    <div className="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-12">
                      <form id="EditProfileForm" className="mt-4">
                        <div className="form-groupAdd">
                          <label htmlFor="FullUname" className="text-left">
                            الإسم الكامل
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="FullUname"
                            placeholder="إسمك"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                       

                        <div className="form-groupAdd">
                          <label htmlFor="phone" className="text-left">
                            رقم الهاتف
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            placeholder="70577727 962+"
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                        <div className="form-groupAdd">
                          <label htmlFor="birthdate" className="text-left">
                            تاريخ الميلاد
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="birthdate"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                          />
                        </div>
                        <div className="form-groupAdd">
                          <label htmlFor="password" className="text-left">
                            كلمة المرور
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="أدخل كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        <div className="text-right mt-5 d-flex justify-content-center">
                          <button
                            type="button"
                            id="update-button"
                            name="submit"
                            className="btn btn-primary mb-2 me-4 ms-2"
                            onClick={handleUpdateProfile}
                            style={{ minWidth: 120 }}
                          >
                            تحديث
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditProfileSection;
