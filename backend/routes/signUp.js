const express = require('express');
const router = express.Router();
const signUpController =require('../controller/signUpController')


// insert data users register into database
router.post("/SignUpRegister",signUpController.SignUpRegister);





module.exports = router;
