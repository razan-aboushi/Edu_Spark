const express = require('express');
const router = express.Router();
const contactController =require('../controller/contactController')



// insert the contact us data to database 
router.post('/messages',contactController.PostContactMessages );




router.get('/userData',contactController.getUsersDataInContactUsPage);




module.exports = router;
