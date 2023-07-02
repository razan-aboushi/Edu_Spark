const express = require('express');
const router = express.Router();
const coursesController =require('../controller/coursesController')




// get the data of the courses from the database
router.get('/courses',coursesController.getAllCourses );


// get the course details
router.get('/courses/:course_id',coursesController.getCourseDetails);


// get the number of subsicribers in the course 
router.get('/courses/:course_id/subscribers',coursesController.getCountOfSubsucribers );


module.exports = router;
