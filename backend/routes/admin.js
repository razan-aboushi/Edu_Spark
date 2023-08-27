const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');




// Update about us and vision and mission 
router.get('/about_missionVisionData', adminController.getAllDataInAboutUs);

// update on the vision and mission
router.put('/save_vision_mission', adminController.updateVisionMission);

// edit on the about us data
router.put('/Editabout_us', adminController.updateAboutUs);


// get all users in the website
router.get('/usersRegistered', adminController.getAllUsers);


// delete user from the website
router.put('/usersRegistered/:user_id', adminController.softDeleteUserFromWS);



// get all contact us meesages 
router.get('/messagesContactUs', adminController.allContactUsMessages);


// get the admin data profile
router.get('/adminData/:user_id', adminController.getAdminDataProfile);

// Update admin profile
router.put('/adminDataUpdate/:user_id', adminController.updateAdminProfileData);


// Add a new article
router.post('/AddArticle', adminController.writeAndPostArticles);



// get the number of contact us messages 
router.get('/unreadMessagesCount', adminController.getAllContactsCounts);



// update the user role in the website
router.put("/usersRegistered/updateUserRole/:userId", adminController.updateUserRole);


// get the count of student number in the website
router.get('/students', adminController.getStudentNumberInWebsite);


// get the count of the teacher number in the website
router.get('/explainers', adminController.getExplainerNumberInWebsite);


// get the count of the contact us messages in the website
router.get('/messages', adminController.getContactUsMessagesNumber);


// add university to website
router.post('/add-university', adminController.postUniversity);

// add categories 
router.post('/add-category', adminController.postCategories);


// get all the pending summaries
router.get('/summaries/pending', adminController.getPendingSumaries);



// update the summary status to approve 
router.put('/summaries/:id/approveSummary', adminController.updateSummaryApproveStatus);


// update the summary status to reject
router.put('/summaries/:id/rejectSummary', adminController.updateSummarRejectStatus);


// get all the pending courses
router.get('/courses/pending', adminController.getAllPendingCourses);



// update the course status to approve
router.put('/courses/:id/approveCourse', adminController.updateCourseStatusApprove);


// update the course status to reject
router.put('/courses/:id/rejectCourse', adminController.updateCourseStatusReject);


// update the state of contact messages from unRead to read 
router.put('/markMessagesAsRead', adminController.readMessagesContactUs);


// get the total revenue in the website
router.get('/revenue', adminController.getRevenueOfTheWebSite);


// get the total sales in the website
router.get('/sales', adminController.getSalesInTheWebSite);


// get the number of university in the website
router.get('/universityNumber', adminController.getUniversityNumberInTheWebSite);


// get all approved courses in the admin dashboard
router.get('/approvedCourses', adminController.getApprovedCourses);


// get all approved summaries in the admin dashboard
router.get('/approvedSummaries', adminController.getApprovedSummaries);


// get the count of courses 
router.get('/coursesCount',adminController.getCountOfCourses)

// get the count of summaries 
router.get('/summariesCount',adminController.getCountOfSummaries)

module.exports = router;