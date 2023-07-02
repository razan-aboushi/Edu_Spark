const express = require('express');
const router = express.Router();
const universitiesController =require('../controller/universitiesController')

router.get('/universities',universitiesController.getAllUniversities );




// get all the categories related to specific university
router.get('/universities/:universityId/categories',universitiesController.getAllCategoriesInUniversity);




module.exports = router;
