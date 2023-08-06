import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt, faUser, faBook, faGraduationCap, faNewspaper, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import jwt_decode from 'jwt-decode';
import logo from '../img/KeepMeOnLogo.png';
import '../css/style.css';


function Nav() 
{
  const [activeTab, setActiveTab] = useState('');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [userRole, setUserRole] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();



  useEffect(() => {
    const getUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwt_decode(token);
        const roleId = decodedToken.role;
        setUserRole(roleId);
      }
    };

    getUserRole();
  }, []);


  

  // Get the count of items for the user
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      const decodedToken = token ? jwt_decode(token) : null;
      const user_id = decodedToken?.userId;

      try {
        // Get cart items count for a specific user
        const response = await axios.get(`http://localhost:4000/cartItemsLength/${user_id}`);
        setItemCount(response.data);
        fetchCartItems();
      } catch (error) {
        console.error('Error fetching cart items count:', error);
      }
    };
    fetchCartItems();
  }, []);



  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setIsNavbarOpen(false);
  };

  const handleNavbarToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };


  // Handle when the user click on the LogOut button
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(0);
    navigate('/LogIn');
  };


  // Handle when the user click on the profile button
  const handleProfileClick = () => {
    if (userRole === 2) 
    {
      navigate('/UserProfileStudent');
    } else if (userRole === 3) 
    {
      navigate('/UserProfileTeacher');
    }
  };





  return (
    <div dir="ltr">
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top p-0 shadow">
        <div className="container-fluid m-0 p-0">
          <Link to={'/'} className="navbar-brand">
            <img src={logo} alt="شعار إدوسبارك" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavbarToggle}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarCollapse">
            <ul className="navbar-nav me-5 ms-auto">
              <li className="nav-item">
                <Link
                  to={'/'}
                  className={`nav-link ${activeTab === 'الرئيسية' ? 'active' : ''}`}
                  onClick={() => handleTabClick('الرئيسية')}
                >
                  الرئيسية
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={'/about'}
                  className={`nav-link ${activeTab === 'حول' ? 'active' : ''}`}
                  onClick={() => handleTabClick('حول')}
                >
                  حولنا
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  to="#"
                  className={`nav-link dropdown-toggle ${activeTab === 'التصنيفات' ? 'active' : ''}`}
                  data-bs-toggle="dropdown"
                  onClick={() => handleTabClick('التصنيفات')}
                >
                  التصنيفات
                </Link>
                <div className="dropdown-menu text-end me-5">
                  <Link
                    to={'/University'}
                    className="dropdown-item"
                    onClick={() => handleTabClick('الجامعات')}
                  >
                    الجامعات
                    <FontAwesomeIcon icon={faGraduationCap} className="ms-2" />
                  </Link>
                  <Link
                    to={'/Courses'}
                    className="dropdown-item"
                    onClick={() => handleTabClick('الدورات')}
                  >
                    الدورات
                    <FontAwesomeIcon icon={faBook} className="ms-2" />
                  </Link>
                  <Link
                    to={'/Article'}
                    className="dropdown-item"
                    onClick={() => handleTabClick('المقال')}
                  >
                    المقالات
                    <FontAwesomeIcon icon={faNewspaper} className="ms-2" />
                  </Link>
                  <Link
                    to={'/Summaries'}
                    className="dropdown-item"
                    onClick={() => handleTabClick('الملخصات')}
                  >
                    الملخصات
                    <FontAwesomeIcon icon={faBook} className="ms-2" />
                  </Link>

                </div>
              </li>
              <li className="nav-item">
                <Link
                  to={'/contact'}
                  className={`nav-link ${activeTab === 'اتصل بنا' ? 'active' : ''}`}
                  onClick={() => handleTabClick('اتصل بنا')}
                >
                  تواصل
                </Link>
              </li>

            </ul>
            <div className="d-flex align-items-end">

              <div className='mb-3 mt-3 me-2' style={{ transform: 'scaleX(-1)' }}>
                <Link
                  to="/checkoutPayment"
                  className="py-2 px-2 mb-2 mt-1 me-5 ms-2"
                  style={{ borderRadius: '25px' }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="ms-1" size="2x" />
                  <span className="badge bg-primary" style={{ borderRadius: "100%", transform: 'scaleX(-1)' }}>{itemCount}</span>

                </Link>
              </div>

              <div className="vertical-divider me-3" style={{ borderLeft: '1px solid gray', height: '60px' }}></div>



              {userRole !== 0 && (
                <>
                  <button
                    className="btn-primary py-3 px-3 mb-2 mt-2 ms-2"
                    style={{ borderRadius: "25px" }}
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                    <FontAwesomeIcon icon={faSignOutAlt} className="ms-2" />
                  </button>
                  <button
                    className="btn-primary py-3 px-3 mb-2 mt-2 ms-2 me-3"
                    style={{ borderRadius: "25px" }}
                    onClick={handleProfileClick}
                  >
                    الملف الشخصي
                    <FontAwesomeIcon icon={faUser} className="ms-2" />
                  </button>

                </>
              )}

              {userRole === 0 && (
                <>
                  <Link
                    to={'/LogIn'}
                    className="btn-primary py-3 px-3 mb-2 mt-2 ms-2"
                    style={{ borderRadius: "25px" }}
                  >
                    تسجيل الدخول
                    <FontAwesomeIcon icon={faSignInAlt} className="ms-2" />
                  </Link>
                  <Link
                    to={'/SignUp'}
                    className="btn-primary py-3 px-3 mb-2 mt-2 ms-2 me-3"
                    style={{ borderRadius: "25px" }}
                  >
                    إنشاء حساب
                    <FontAwesomeIcon icon={faUser} className="ms-2" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;