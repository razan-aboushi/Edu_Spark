const express = require('express');
const router = express.Router();
const homeController =require('../controller/homeController')




// get the last 6 articles in home page
router.get('/articlesHomePage',homeController.getArticlesHome);



// get the university in home page 
router.get('/universities',homeController.getAllUniversitiessection );



// get the summaries in home page
router.get('/summaries/latest',homeController.getThreeSummaries);



//get the courses and render them in home page
router.get('/courses/latestHome',homeController.getCoursesSection);




// check if the user enrolled to course
router.get('/enrolled-courses/:user_id', homeController.enrolledCourses);



// check if the user enrolled to summary
router.get('/enrolled-summaries/:user_id', homeController.enrolledSummaries);


// get the count of items in the cart and render them in nav bar
router.get('/cartItemsLength/:user_id',homeController.getTheCountOfItems);


// get all users in sign up page 
router.get('/usersEmailCheck',homeController.emailUsersCheck);





module.exports = router;
