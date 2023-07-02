const express = require('express');
const router = express.Router();
const transfersController =require('../controller/transfersController')




router.get('/transfers/:user_id',transfersController.getTransferAndBuy );





module.exports = router;
