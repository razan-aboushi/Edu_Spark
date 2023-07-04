import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';
import '../css/UserProfile.css';
import axios from 'axios';

import UserProfile from './UserProfile';
import EditProfileSection from './EditProfileSection';
import BankAccountData from './BankAccountData';
import CourseCalendar from './CourseCalendar';
import InputTodo from '../components/InputTodo';
import ListTodos from '../components/ListTodos';
import FinancialDuesForUser from '../teacher/FinancialDuesForUser';
import SummariesBuy from './SummariesBuy';

function UserProfileStudent() {
  const [activeSection, setActiveSection] = useState('');
  const [userId, setUserId] = useState('');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getIdFormUserData');
        const userData = response.data;
        setUserId(userData.userId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const activeTabFromLocalStorage = localStorage.getItem('activeTab');
    if (activeTabFromLocalStorage) {
      setActiveSection(activeTabFromLocalStorage);
    } else {
      setActiveSection(activeTabFromLocalStorage);
    }
  }, []);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setIsNavbarOpen(false);
    localStorage.setItem('activeTab', section);
  };

  const handleNavbarToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <div>
      <header>
        {/* Navigation bar */}
        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
          {/* Navigation links */}
          <Link to="/" className="nav-item nav-link scrollto">
            الصفحة الرئيسية
          </Link>
          <button type="button" className="navbar-toggler me-4" onClick={handleNavbarToggle}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`}>
            <div className="navbar-nav ms-auto p-4 p-lg-0">
              {/* Tab links */}
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'bank-details' ? 'active' : ''}`}
                onClick={() => handleSectionClick('bank-details')}
              >
                تفاصيل حسابي البنكي
              </span>
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'financial-dues' ? 'active' : ''}`}
                onClick={() => handleSectionClick('financial-dues')}
              >
سجل المدفوعات
              </span>
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'todo-list' ? 'active' : ''}`}
                onClick={() => handleSectionClick('todo-list')}
              >
                قائمة المهام
              </span>
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'summary-buy' ? 'active' : ''}`}
                onClick={() => handleSectionClick('summary-buy')}
              >
                مُلخصاتي
              </span>
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'course-calendar' ? 'active' : ''}`}
                onClick={() => handleSectionClick('course-calendar')}
              >
                تواريخ دوراتي
              </span>
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'edit-profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('edit-profile')}
              >
                تعديل الملف الشخصي
              </span>
              <span
                className={`nav-item nav-link scrollto ${activeSection === 'profile' ? 'active' : ''}`}
                onClick={() => handleSectionClick('profile')}
              >
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
        {activeSection === 'bank-details' && <BankAccountData />}
        {activeSection === 'financial-dues' && <FinancialDuesForUser />}
        {activeSection === 'todo-list' && (
          <>
            <InputTodo />
            <ListTodos />
          </>
        )}
        {activeSection === 'course-calendar' && <CourseCalendar />}
        {activeSection === 'summary-buy' && <SummariesBuy />}

      </main>
    </div>
  );
}

export default UserProfileStudent;
