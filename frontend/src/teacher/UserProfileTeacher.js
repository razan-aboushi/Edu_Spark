import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';
import '../css/UserProfile.css';

import UserProfile from '../student/UserProfile';
import CourseSummaryForm from './CourseSummaryFormAdd';
import EditProfileSection from '../student/EditProfileSection';
import ManageCourses from './ManageCourses';
import CourseCalendar from '../student/CourseCalendar';
import ListTodos from '../components/ListTodos';
import SummariesBuy from '../student/SummariesBuy';

function UserProfileTeacher()
 {
  const [activeSection, setActiveSection] = useState('profile');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsNavbarOpen(false);
    localStorage.setItem('activeTab', section);
  };


  const handleNavbarToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  useEffect(() => {
    const activeTabFromLocalStorage = localStorage.getItem('activeTab');
    if (activeTabFromLocalStorage) {
      setActiveSection(activeTabFromLocalStorage);
    } else {
      setActiveSection(activeTabFromLocalStorage);
    }
  }, []);



  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">

          <button
            type="button"
            className="navbar-toggler me-4"
            onClick={handleNavbarToggle}
          >
            <span className="navbar-toggler-icon pointer-link" />
          </button>
          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
            
            <div className="navbar-nav ms-auto p-4 p-lg-0">


            <Link
                to="/"
                className={`nav-item pointer-link nav-link scrollto ${activeSection === null ? 'active' : ''}`}
              >
                الصفحة الرئيسية
              </Link>


              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'todo-list' ? 'active' : ''}`}
                onClick={() => handleSectionClick('todo-list')}
              >
                قائمة المهام
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'add-course' ? 'active' : ''}`}
                onClick={() => handleSectionClick('add-course')}
              >
                إضافة دورة أو ملخص
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'summary-buy' ? 'active' : ''}`}
                onClick={() => handleSectionClick('summary-buy')}
              >
                مُلخصاتي المُشتراة
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'manage-courses' ? 'active' : ''}`}
                onClick={() => handleSectionClick('manage-courses')}
              >
                دوراتي المُقدمة
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'course-calendar' ? 'active' : ''}`}
                onClick={() => handleSectionClick('course-calendar')}
              >
                تواريخ دوراتي
              </span>

              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'edit-profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('edit-profile')}
              >
                تعديل الملف الشخصي
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('profile')}
              >
                الملف الشخصي
              </span>
            


            </div>
          </div>
        </nav>
      </header>
      <main>
        {activeSection === 'profile' && <UserProfile />}
        {activeSection === 'edit-profile' && <EditProfileSection />}
        {activeSection === 'summary-buy' && <SummariesBuy />}
        {activeSection === 'todo-list' && (
          <>
            <ListTodos />
          </>
        )}
        {activeSection === 'add-course' && <CourseSummaryForm />}
        {activeSection === 'manage-courses' && <ManageCourses />}
        {activeSection === 'course-calendar' && <CourseCalendar />}
      </main>
    </div>
  );
}

export default UserProfileTeacher;
