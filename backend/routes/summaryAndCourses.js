const express = require('express');
const router = express.Router();
const summariesAndCoursesController=require('../controller/summariesAndCoursesController');


// get all the courses depends on the categories inside the university
router.get('/coursesByCategory/:university_id/:category_id',summariesAndCoursesController.getCoursesByCategoryAndUni);



// get all the summaries depends on the categories inside the university
router.get('/summariesByCategory/:university_id/:category_id',summariesAndCoursesController.getSummariesByCategoryAndUni);




module.exports=router;



