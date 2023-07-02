const express = require('express');
const router = express.Router();
const logInController = require('../controller/logInController');

// POST login data
router.post('/login', logInController.login);



module.exports = router;
