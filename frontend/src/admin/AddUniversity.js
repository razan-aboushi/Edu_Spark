import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

function AddUniversity() {
  const [universityName, setUniversityName] = useState('');
  const [universityImage, setUniversityImage] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetchUniversities();
  }, []);


  const checkIfUniversityExists = (name) => {
    return universities.some((university) => university.university_name === name);
  };



  const fetchUniversities = () => {
    axios
      .get('http://localhost:4000/universities')
      .then((response) => {
        setUniversities(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ في الخادم الداخلي',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      });
  };

  const handleUniversityNameChange = (event) => {
    setUniversityName(event.target.value);
  };

  const handleUniversityImageChange = (event) => {
    const file = event.target.files[0];
    setUniversityImage(file);
  };

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleCategoryImageChange = (event) => {
    const file = event.target.files[0];
    setCategoryImage(file);
  };

  const handleUniversitySelect = (event) => {
    setSelectedUniversity(event.target.value);
  };


  // add university
  const handleSubmitUniversity = (event) => {
    event.preventDefault();
  
    if (universityName.trim() === '') {
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى إدخال اسم الجامعة',
        icon: 'error',
        confirmButtonText: 'موافق',
      });
      return;
    }
  
    if (checkIfUniversityExists(universityName)) {
      Swal.fire({
        title: 'خطأ',
        text: 'اسم الجامعة موجود بالفعل',
        icon: 'error',
        confirmButtonText: 'موافق',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('university_name', universityName);
    formData.append('university_image', universityImage);
  
    axios
      .post('http://localhost:4000/add-university', formData)
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          title: 'نجاح',
          text: 'تمت إضافة الجامعة بنجاح',
          icon: 'success',
          confirmButtonText: 'موافق',
        });
        setUniversityName('');
        setUniversityImage(null);
        fetchUniversities(); // Fetch updated list of universities
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ في الخادم الداخلي',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      });
  };
  

  const handleSubmitCategory = (event) => {
    event.preventDefault();

    if (categoryName.trim() === '' || !categoryImage || selectedUniversity.trim() === '') {
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى إضافة التخصص واختيار الجامعة',
        icon: 'error',
        confirmButtonText: 'موافق',
      });
      return;
    }

    const formData = new FormData();
    formData.append('category_name', categoryName);
    formData.append('category_image', categoryImage);
    formData.append('university_id', selectedUniversity);

    axios
      .post('http://localhost:4000/add-category', formData)
      .then((response) => {
        console.log(response.data);
        Swal.fire({
          title: 'نجاح',
          text: 'تمت إضافة التخصص بنجاح',
          icon: 'success',
          confirmButtonText: 'موافق',
        });
        setCategoryName('');
        setCategoryImage(null);
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          title: 'خطأ',
          text: 'حدث خطأ في الخادم الداخلي',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      });
  };

  return (
    <div className="add-university-container mt-5">
      <h4 className="text-center">أدخل ما ترغب بإضافته</h4>
      <form onSubmit={handleSubmitUniversity}>
        <div className="form-field mt-3 mb-2">
          <label htmlFor="universityName">اسم الجامعة:</label>
          <input
            type="text"
            id="universityName"
            value={universityName}
            onChange={handleUniversityNameChange}
            className="input-field"
            placeholder="أدخل اسم الجامعة"
          />
        </div>
        <div className="form-field mt-3 mb-2">
          <label htmlFor="universityImage">صورة الجامعة:</label>
          <input
            type="file"
            id="universityImage"
            name="university_image"
            onChange={handleUniversityImageChange}
            className="input-field"
          />
        </div>
        <button className="btn-primary buttonInAddArticle" type="submit">
          إضافة
        </button>
      </form>
      <br />
      <hr />
      <br />
      <form onSubmit={handleSubmitCategory}>
        <div className="form-field mt-3 mb-2">
          <label htmlFor="categoryName">اسم التخصص:</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={handleCategoryNameChange}
            className="input-field"
            placeholder="أدخل اسم التخصص"
          />
        </div>
        <div className="form-field">
          <label htmlFor="categoryImage">صورة التخصص:</label>
          <input
            type="file"
            id="categoryImage"
            onChange={handleCategoryImageChange}
            className="input-field"
          />
        </div>
        <div className="form-field mt-3">
          <label htmlFor="universitySelect">الجامعة:</label>
          <select
            id="universitySelect"
            value={selectedUniversity}
            onChange={handleUniversitySelect}
            className="input-field"
          >
            <option value="">اختر الجامعة</option>
            {universities.map((university) => (
              <option key={university.university_id} value={university.university_id}>
                {university.university_name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-primary buttonInAddArticle" type="submit">
          إضافة
        </button>
      </form>
    </div>
  );
}

export default AddUniversity;
