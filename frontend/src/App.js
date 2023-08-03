import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import Nav from './components/nav';
import Footer from './components/footer';
import CoursesAndSummaries from './components/CoursesAndSummaries';
import Index from './components/index';
import About from './components/about';
import Faq from './components/faq';
import Contact from './components/contact';
import LogIn from './components/LogIn';
import SignUp from './components/signUp';
import Courses from './components/Courses';
import University from './components/University';
import Summaries from './components/Summaries';
import Article from './components/Article';
import ArticleDetails from './components/ArticleDetails';
import CoursesCategories from './components/coursesCategories';
import CheckoutPayment from './components/checkoutPayment';
import Error404 from './components/ErrorPage';
import TermsOfService from './components/TermsOfService';
import CourseDetails from './components/CourseDetails';
import ResetPassword from './components/ResetPassword';
import SummaryDetails from './components/SummaryDetails';

import AdminSideBar from "./admin/AdminSideBar";

import UserProfileStudent from './student/UserProfileStudent';

import UserProfileTeacher from './teacher/UserProfileTeacher';

function App() {
  const [userRole, setUserRole] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwt_decode(token);
        const roleId = decodedToken.role;
        setUserRole(roleId);
      }
    };
    fetchUserData();
  }, []);


  return (
    <>
      <BrowserRouter>
        <Routes>

          {(userRole === 0 || userRole === 2 || userRole === 3) && (
            <>
              <Route
                path="/"
                element={
                  <>
                    <Nav />
                    <Index />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/about"
                element={
                  <>
                    <Nav />
                    <About />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/faq"
                element={
                  <>
                    <Nav />
                    <Faq />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/contact"
                element={
                  <>
                    <Nav />
                    <Contact />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/signUp"
                element={
                  <>
                    <Nav />
                    <SignUp />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/Courses"
                element={
                  <>
                    <Nav />
                    <Courses />
                    <Footer />
                  </>
                }
              />


              <Route
                path="/CoursesAndSummaries/:university_id/:category_id"
                element={
                  <>
                    <Nav />
                    <CoursesAndSummaries />
                    <Footer />
                  </>
                }
              />


              <Route
                path="/University"
                element={
                  <>
                    <Nav />
                    <University />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/Summaries"
                element={
                  <>
                    <Nav />
                    <Summaries />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/Article"
                element={
                  <>
                    <Nav />
                    <Article />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/ArticleDetails/:article_id"
                element={
                  <>
                    <Nav />
                    <ArticleDetails />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/coursesCategories/:universityId"
                element={
                  <>
                    <Nav />
                    <CoursesCategories />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/checkoutPayment"
                element={
                  <>
                    <Nav />
                    <CheckoutPayment />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/TermsOfService"
                element={
                  <>
                    <Nav />
                    <TermsOfService />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/CourseDetails/:course_id"
                element={
                  <>
                    <Nav />
                    <CourseDetails />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/SummaryDetails/:summaryId"
                element={
                  <>
                    <Nav />
                    <SummaryDetails />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/ResetPassword"
                element={
                  <>
                    <Nav />
                    <ResetPassword />
                    <Footer />
                  </>
                }
              />
            </>
          )}

          <Route
            path="/LogIn"
            element={
              <>
                <Nav />
                <LogIn />
                <Footer />
              </>
            }
          />




          {/* Routes for admin roles */}
          {userRole === 1 && (
            <Route
              path="/AdminSideBar"
              element={<AdminSideBar />} />)}

          {/* Routes for student profile */}
          {userRole === 2 && (
            <Route path="/UserProfileStudent" element={<UserProfileStudent />} />)}

          {/* Routes for teacher profile */}
          {userRole === 3 && (
            <Route
              path="/UserProfileTeacher"
              element={
                <UserProfileTeacher />}

            />)}






          {userRole !== 1 || userRole !== 2 || userRole !== 3 || (
            <Route path="*" element={<Error404 />} />
          )}






        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;