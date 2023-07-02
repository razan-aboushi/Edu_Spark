const express = require('express');
const router = express.Router();
const signUpController =require('../controller/signUpController')
const jwt = require("jsonwebtoken");


// router.get("/SignUpRegisterData",signUpController.SignUpRegister);

// insert data users register into database
router.post("/SignUpRegister",signUpController.SignUpRegister);





module.exports = router;
