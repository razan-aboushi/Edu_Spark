const express = require('express');
const router = express.Router();
const UserRoleController = require('../controller/appUserRoleController');

router.get('/userRolesBytoken',UserRoleController.UserRoleCheckToken);




module.exports = router;
