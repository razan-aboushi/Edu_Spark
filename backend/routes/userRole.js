const express = require('express');
const router = express.Router();
const userRoles = require('../controller/UserRoleAccessController');






router.get('/usersDataRole/:id',userRoles.checkUserRole);








module.exports = router;
