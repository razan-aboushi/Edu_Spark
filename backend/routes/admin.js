const express = require('express');
const router = express.Router();
const adminController =require('../controller/adminController');
const multer = require('multer');
const upload = multer({ dest: 'images/' }); 





// Update about us and vision and mission 
router.get('/about_missionVisionData', adminController.getAllDataInAboutUs);

// update on the vision and mission
router.put('/save_vision_mission',adminController.updateVisionMission);

router.put('/Editabout_us',adminController.updateAboutUs);
// end edit on them


// get all users in the website
router.get('/usersRegistered',adminController.getAllUsers );

// Delete user from the website
router.delete('/usersRegistered/:id',adminController.deleteUserFromWS);


// get all contact us meesages 
router.get('/messagesContactUs',adminController.allContactUsMessages);


// get the admin data profile
router.get('/adminData',adminController.getAdminDataProfile);

// Update admin profile
router.put('/adminDataUpdate',adminController.updateAdminProfileData);


// Add a new article
router.post('/AddArticle',adminController.writeAndPostArticles);


  
// Get the number of contact us messages 
 router.get('/unreadMessagesCount',adminController.getAllContactsCounts);
  
  
// Send reply to user contact us message from the dashboard

// update the user role in the website
 router.put("/usersRegistered/:userId", adminController.updateUserRole);


// get the count of student number in the website
 router.get('/students',adminController.getStudentNumberInWebsite);


// get the count of the teacher number in the website
 router.get('/explainers',adminController.getExplainerNumberInWebsite);


// get the count of the contact us messages in the website
 router.get('/messages',adminController.getContactUsMessagesNumber );


// add university to website
router.post('/add-university',adminController.postUniversity);

// add categories 
router.post('/add-category', adminController.postCategories);


// get all the pending summaries
router.get('/summaries/pending',adminController.getPendingSumaries);



// update the summary status to approve 
router.put('/summaries/:id/approveSummary',adminController.updateSummaryApproveStatus);


// update the summary status to reject
router.put('/summaries/:id/rejectSummary',adminController.updateSummarRejectStatus);


// get all the pending courses
router.get('/courses/pending',adminController.getAllPendingCourses );



// update the course status to approve
router.put('/courses/:id/approveCourse',adminController.updateCourseStatusApprove );


// update the course status to reject
router.put('/courses/:id/rejectCourse',adminController.updateCourseStatusReject);


// update the state of contact messages from unRead to read 
router.put('/markMessagesAsRead',adminController.readMessagesContactUs );


// get the total revenue in the website
router.get('/revenue',adminController.getRevenueOfTheWebSite);


// get the total sales in the website
router.get('/sales',adminController.getSalesInTheWebSite);


// get the number of university in the website
router.get('/universityNumber',adminController.getUniversityNumberInTheWebSite);



router.get('/approvedCourses',adminController.getApprovedCourses);

router.get('/approvedSummaries',adminController.getApprovedSummaries );
module.exports = router;
