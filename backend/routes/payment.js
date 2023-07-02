const express = require('express');
const router = express.Router();
const paymentsController = require('../controller/paymentController')




router.post('/storeSummariesEnrollment/:user_id', paymentsController.postSummariesIdEnrollment);



router.post('/storeCoursesEnrollment/:user_id', paymentsController.postCourseIdEnrollment);





router.post('/insertTransaction/:user_id',paymentsController.postTransaction);




router.get('/getPaymentMethodId',paymentsController.getPaymentIdOfCreditCard);



// router.get('/transactions',paymentsController.getTransactionsData);



// router.post('/transactionDetails',paymentsController.postTransactionDetails);



module.exports = router;
