const express = require('express');
const router = express.Router();
const studentProfileController =require('../controller/studentProfileController')


// get the user id in the user profile links for to do input component
router.get('/getIdFromUserData',studentProfileController.getIdFromUserData );


// post the data of user bank account into database
router.post('/UsersBankAccountsData/:userId',studentProfileController.postUserBankAccounts);




// get the student information in the student profile
router.get('/user-profile/:id', studentProfileController.getStudentProfileInfo);



// edit student information
router.put('/userUpdateInfo/:id',studentProfileController.editStudentInfo);


// get all the user buy summaries
router.get('/buySummaries/:user_id',studentProfileController.getUserBuySummaries);


// to get the courses the user join to
router.get('/reservationCourses/:user_id',studentProfileController.getCourseTheUserJoined);




router.get('/getAllUserInfoData',studentProfileController.getAllUserInfoData);

module.exports = router;
