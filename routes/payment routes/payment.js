const {newPayment, checkStatus} = require('../../controller/payment controller/payment');
const express = require('express');
const router = express();

router.post('/', newPayment);
router.post('/status/:id', checkStatus);

module.exports = router;