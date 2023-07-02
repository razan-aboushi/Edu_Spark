const express = require('express');
const router = express.Router();
const teacherProfileController =require('../controller/teacherProfileController')



// add the course to the website by teacher
router.post('/addCourseForm/:user_id',teacherProfileController.postCourseForm);


// get the courses that the teacher added to website
router.get("/user-courses/:user_id",teacherProfileController.getUserCourses);



// get the summaries that the teacher added to website
router.get('/user-summaries/:user_id',teacherProfileController.getUserSummaries );


// add the summary to the website by teacher
router.post("/submitSummaryForm/:user_id",teacherProfileController.postSummaryForm);






module.exports = router;
