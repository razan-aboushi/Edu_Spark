const express = require('express');
const router = express.Router();
const summariesController =require('../controller/summariesController')




// get all the summaries from the database to display them in summaries page
router.get('/summaries',summariesController.getAllSummaries);


router.get('/summariesDetails/:summaryId',summariesController.getSummaryDetails);






module.exports = router;
