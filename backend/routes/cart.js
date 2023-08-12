const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');


// Add summary to cart
router.post('/cart',cartController.postToCart);


// Check the summary if found in the user cart
router.get('/cart/:user_id/:summary_id',cartController.getCartItems);


// delete the summary from the cart
router.delete('/cartSummary/:user_id/:summary_id',cartController.deleteCartItems);



// post the course into cart table
router.post('/cartCourse',cartController.postToCartCourse);


// delete the course from the cart
router.delete('/cartItemCourse/:user_id/:course_id',cartController.deleteCourseCart);


// get the course from the cart to check if exists or not ?
router.get('/cartCourse/:user_id/:course_id',cartController.getCourseFromCart);







// in the courses and summaries page
router.get('/checkCartItem/:user_id/:itemType/:item_id',cartController.getItemsCourseSummary );

router.post('/addToCart',cartController.addToCartItems );



module.exports = router;
