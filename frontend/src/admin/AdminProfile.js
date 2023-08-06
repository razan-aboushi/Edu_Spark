import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "../css/style.css";
import bcrypt from 'bcryptjs';
import jwt_decode from 'jwt-decode';

function AdminProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);


  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;
  const user_id = decodedToken?.userId;




  useEffect(() => {
    fetchData();
  }, []);


  // Get the admin profile data
  async function fetchData() {

    try {
      const response = await axios.get(`http://localhost:4000/adminData/${user_id}`);
      const data = response.data;

      setName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phone_number);
      setPassword(data.password);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  // Handle edit and save the admin profile changes
  async function handleSave() {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedProfile = {
      name,
      email,
      phone_number,
      password: hashedPassword,
    };


    // Perform save action using Axios
    axios.put(`http://localhost:4000/adminDataUpdate/${user_id}`, updatedProfile).then((response) => {
      console.log('Profile updated successfully:', response.data);

      // Show success message
      Swal.fire({
        title: 'تم الحفظ',
        text: 'تم حفظ معلومات الملف الشخصي بنجاح!',
        icon: 'success',
        confirmButtonText: 'حسنًا',
        customClass: {
          confirmButton: 'edit-button save-button',
        },
      });

      setIsEditMode(false);

    }).catch((error) => {
      console.error('Error updating profile:', error);
    });
  }



  function handleEdit() {
    Swal.fire({
      title: 'تأكيد التعديل',
      text: 'هل أنت متأكد أنك تريد تعديل معلومات الملف الشخصي؟',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'إلغاء',
      confirmButtonText: 'تعديل',
      reverseButtons: true,
      customClass: {
        confirmButton: 'edit-button save-button',
        cancelButton: 'edit-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditMode(true);
      }
    });
  }


  return (
    <div className="center-containerAdmin">
      <div className="profile-form">
        <div className="form-groupAdmin">

        </div>
        <div className="form-groupAdmin">
          <label className='LabelAdminProfile' htmlFor="fullName">الإسم الكامل</label>
          <input className='inputAdminProfile'
            type="text"
            id="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditMode}
          />
        </div>
        <div className="form-groupAdmin">
          <label className='LabelAdminProfile' htmlFor="email">البريد الإلكتروني</label>
          <input className='inputAdminProfile'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled />
        </div>
        <div className="form-groupAdmin">
          <label className='LabelAdminProfile' htmlFor="phoneNumber">رقم الهاتف</label>
          <input className='inputAdminProfile'
            type="tel"
            id="phoneNumber"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!isEditMode} />
        </div>
        <div className="form-groupAdmin">
          <label className='LabelAdminProfile' htmlFor="password">الرقم السري</label>
          <input className='inputAdminProfile'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditMode} />
        </div>

        {isEditMode ? (
          <button className="edit-button save-button" onClick={handleSave}>حفظ</button>
        ) : (
          <button className="edit-button save-button" onClick={handleEdit}>تعديل</button>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;