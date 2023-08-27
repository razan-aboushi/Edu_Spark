import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';
import '../css/UserProfile.css';


import UserProfile from './UserProfile';
import EditProfileSection from './EditProfileSection';
import CourseCalendar from './CourseCalendar';
import ListTodos from '../components/ListTodos';
import SummariesBuy from './SummariesBuy';

function UserProfileStudent() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);



  // get active tab from the local storage
  useEffect(() => {
    const activeTabFromLocalStorage = localStorage.getItem('activeTab');
    if (activeTabFromLocalStorage) 
    {
      setActiveSection(activeTabFromLocalStorage);
    } else {
      setActiveSection(activeSection);
    }
  }, [activeSection]);



  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsNavbarOpen(false);
    localStorage.setItem('activeTab', section);
  };



  return (
    <div>
      <header>
        {/* Navigation bar */}
        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
          {/* Navigation links */}

          <button type="button" className="navbar-toggler me-4" onClick={()=>setIsNavbarOpen(!isNavbarOpen)}>
            <span className="navbar-toggler-icon pointer-link" />
          </button>
          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
            <div className="navbar-nav ms-auto p-4 p-lg-0">

              <Link to="/" className="nav-item nav-link scrollto" style={{color:"#06BBCC "}}>
                الصفحة الرئيسية
              </Link>

              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'todo-list' ? 'active' : ''}`}
                onClick={() => handleSectionClick('todo-list')}>
                قائمة المهام
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'summary-buy' ? 'active' : ''}`}
                onClick={() => handleSectionClick('summary-buy')}>
                المُلخصات المُشتراة
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'course-calendar' ? 'active' : ''}`}
                onClick={() => handleSectionClick('course-calendar')}>
                تواريخ دوراتي
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'edit-profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('edit-profile')}>
                تعديل الملف الشخصي
              </span>
              <span
                className={`nav-item pointer-link nav-link scrollto ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('profile')}>
                الملف الشخصي
              </span>


            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main>
        {/* Render the active section */}
        {activeSection === 'profile' && <UserProfile />}
        {activeSection === 'edit-profile' && <EditProfileSection />}
        {activeSection === 'todo-list' && <ListTodos />}
        {activeSection === 'course-calendar' && <CourseCalendar />}
        {activeSection === 'summary-buy' && <SummariesBuy />}

      </main>
    </div>
  );
}

export default UserProfileStudent;
