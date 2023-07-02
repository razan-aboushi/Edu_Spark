const express = require('express');
const router = express.Router();
const reSetPasswordController =require('../controller/reSetPasswordController')




router.post('/reset-password',reSetPasswordController.ResetPassword );




router.post('/check-user-existence',reSetPasswordController.checkUserExist);



module.exports = router;
