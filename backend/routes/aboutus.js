const express = require('express');
const router = express.Router();
const aboutUsController =require('../controller/aboutusController')

// get the about us data
router.get('/aboutUsGet',aboutUsController.aboutUsGet); 

module.exports = router;
