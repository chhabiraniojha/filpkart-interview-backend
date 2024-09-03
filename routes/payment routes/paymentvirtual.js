const {newPayment, checkStatus} = require('../../controller/payment controller/paymentvirtual');
const express = require('express');
const router = express();

router.post('/virtual', newPayment);
router.post('/virtual/status/:id/:details', checkStatus);

module.exports = router;