const {newPayment, checkStatus} = require('../../controller/payment controller/payment-digidivine');
const express = require('express');
const router = express();

router.post('/telephonic-digidivine', newPayment);
router.post('/telephonic-digidivine/status/:id/:details', checkStatus);

module.exports = router;