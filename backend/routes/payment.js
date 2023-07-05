const express = require('express');
const router = express.Router();
const paymentsController = require('../controller/paymentController')




router.post('/storeSummariesEnrollment/:user_id', paymentsController.postSummariesIdEnrollment);



router.post('/storeCoursesEnrollment/:user_id', paymentsController.postCourseIdEnrollment);





router.post('/insertTransaction/:user_id',paymentsController.postTransaction);




router.get('/getPaymentMethodId',paymentsController.getPaymentIdOfCreditCard);


// get all items
router.get('/getAllCartItems/:user_id',paymentsController.getAllCartItems);


// delete the items from the cart
router.delete('/removeCartItemsFromCart/:user_id/:item_id', paymentsController.deleteCartItem);

module.exports = router;
