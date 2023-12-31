const express = require('express');
const router = express.Router();
const summariesController = require('../controller/summariesController')


// get all the summaries from the database to display them in summaries page
router.get('/summaries', summariesController.getAllSummaries);

// get the summaries details in summary page
router.get('/summariesDetails/:summaryId', summariesController.getSummaryDetails);

// get filtered summaries
router.get('/filtered-summaries', summariesController.getFilteredSummaries);


module.exports = router;
