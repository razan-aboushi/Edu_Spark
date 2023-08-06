import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faChartBar, faEnvelope, faFileAlt, faSignOutAlt, faPastafarianism } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import "../css/style.css";
import logo from '../img/adminLogo.png'
import AllUsers from "../admin/AllUsers";
import AdminProfile from "../admin/AdminProfile";
import DashBoard from "../admin/DashBoard";
import PublishRequest from "../admin/PublishRequest";
import AddArticleForm from "../admin/AddArticleForm";
import ContactMessages from "../admin/ContactMessages";
import AdminPanel from "../admin/AdminPanel";
import AddUniversity from '../admin/AddUniversity';
import PublishRequestCourse from './PublishRequestCourse';
import ApprovedContent from './ApprovedContent';
import axios from 'axios';


function Sidebar({fetchUserData}) 
{
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState('/DashBoard');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const navigate = useNavigate();


  function handleLinkClick(link) {
    setActiveLink(link);
    if (link === '/ContactMessages') {
      setUnreadMessagesCount(0);
      markMessagesAsRead();
    }
    localStorage.setItem('activeLink', link);
  }


// Handle when the admin click to log out from the dashboard
function handleLogout() {
  Swal.fire({
    title: 'تسجيل الخروج',
    text: 'هل تريد تسجيل الخروج؟',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'تسجيل الخروج',
    cancelButtonText: 'إلغاء'
  }).then(async (result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      navigate('/LogIn');
      fetchUserData();
    }
  });
}


  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

// Store the active link in the local storage
  useEffect(() => {
    const storedActiveLink = localStorage.getItem('activeLink');
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }

    getUnreadMessagesCount();
  }, []);


  // get the count of unread messages of the contact us messages on side bar 
  async function getUnreadMessagesCount() 
  {
    try {
      const response = await axios.get('http://localhost:4000/unreadMessagesCount');
      const count = response.data.count;
      setUnreadMessagesCount(count);
    } catch (error) {
      console.error('Error fetching unread messages count:', error);
      setUnreadMessagesCount(0);
    }
  }


  // When click on the contact messages update the count as read
  async function markMessagesAsRead()
   {
    try {
      await axios.put('http://localhost:4000/markMessagesAsRead');
      console.log('Messages marked as read');
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  return (
    <div className="row m-0" style={{ overflowX: "hidden" }}>
      <div className={`col-2 sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        
        <div className="logo">
          <img src={logo} alt="Logo" width="100%" height="119px" />
        </div>

        <div className="profile">
          <button
            className={`sidebar-link ${activeLink === '/AdminProfile' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/AdminProfile')}>
            <FontAwesomeIcon icon={faUser} className='ms-2' />
            صفحة الحساب
          </button>
        </div>

        <ul className="nav-items">
          <li>
            <button
              className={`sidebar-link ${activeLink === '/DashBoard' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/DashBoard')}>
              <FontAwesomeIcon icon={faChartBar} className='ms-2' />
              لوحة التحكم
            </button>
          </li>

          <li>
            <button
              className={`sidebar-link ${activeLink === '/AdminPanel' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/AdminPanel')}>
              <FontAwesomeIcon icon={faPastafarianism} className='ms-2' />
              لوحة الإدارة
            </button>
          </li>

          <li>
            <button
              className={`sidebar-link ${activeLink === '/AllUsers' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/AllUsers')}
            >
              <FontAwesomeIcon icon={faUser} className='ms-2' />
              المستخدمين
            </button>
          </li>
          <li>
            <button
              className={`sidebar-link ${activeLink === '/AddArticleForm' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/AddArticleForm')}
            >
              <FontAwesomeIcon icon={faPlus} className='ms-2' />
              إضافة مقالة
            </button>
          </li>

          <li>
            <button
              className={`sidebar-link ${activeLink === '/ContactMessages' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/ContactMessages')}
            >
              <FontAwesomeIcon icon={faEnvelope} className='ms-2' />
              رسائل التواصل معنا{' '}
              {unreadMessagesCount > 0 && <span className="unread-count" style={{ color: "white", marginRight: "20px", border: "solid 1px gray", borderRadius: "100%", padding: "6px", paddingRight: "14px", paddingLeft: "14px", backgroundColor: "red" }}>{unreadMessagesCount}</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-link ${activeLink === '/PublishRequest' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/PublishRequest')}
            >
              <FontAwesomeIcon icon={faFileAlt} className='ms-2' />
              طلبات إضافة مُلخص
            </button>
          </li>


          <li>
            <button
              className={`sidebar-link ${activeLink === '/PublishRequestCourse' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/PublishRequestCourse')}
            >
              <FontAwesomeIcon icon={faFileAlt} className='ms-2' />
              طلبات إضافة دورة
            </button>
          </li>

          <li>
            <button
              className={`sidebar-link ${activeLink === '/ApprovedContent' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/ApprovedContent')}
            >
              <FontAwesomeIcon icon={faFileAlt} className='ms-2' />
              أرشيف الموافقة على الطلبات
            </button>
          </li>

          <li>
            <button
              className={`sidebar-link ${activeLink === '/AddUniversity' ? 'active' : ''}`}
              onClick={() => handleLinkClick('/AddUniversity')}
            >
              <FontAwesomeIcon icon={faPlus} className='ms-2' />
              إضافة جامعة أو تخصص
            </button>
          </li>


          <li>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className='ms-2' />
              تسجيل الخروج
            </button>
          </li>
        </ul>

        <div className="toggle-button" onClick={toggleSidebar}>
          <div className={`bar ${isSidebarOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isSidebarOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isSidebarOpen ? 'open' : ''}`}></div>
        </div>
      </div>
      <div className="col">
        {activeLink === '/DashBoard' && <DashBoard />}
        {activeLink === '/AllUsers' && <AllUsers />}
        {activeLink === '/AddArticleForm' && <AddArticleForm />}
        {activeLink === '/ContactMessages' && <ContactMessages />}
        {activeLink === '/PublishRequest' && <PublishRequest />}
        {activeLink === '/PublishRequestCourse' && <PublishRequestCourse />}
        {activeLink === '/ApprovedContent' && <ApprovedContent />}
        {activeLink === '/AdminPanel' && <AdminPanel />}
        {activeLink === '/AdminProfile' && <AdminProfile />}
        {activeLink === '/AddUniversity' && <AddUniversity />}
      </div>
    </div>
  );
}

export default Sidebar;