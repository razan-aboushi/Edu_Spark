const express = require('express');
const router = express.Router();
const categoriesController =require('../controller/categoriesController')


// get all the categories and render them in categoires page
router.get('/categories',categoriesController.getAllCategories );







module.exports = router;
