const express = require('express');
const router = express.Router();
const coursesController =require('../controller/coursesController')




// get the data of the courses from the database
router.get('/courses',coursesController.getAllCourses);


// get the course details
router.get('/courses/:course_id',coursesController.getCourseDetails);


// get the data " filters the data of courses "
router.get('/filtered-courses',coursesController.getFilteredCourses);


module.exports = router;
