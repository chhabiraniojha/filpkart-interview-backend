const {newPayment, checkStatus} = require('../../controller/payment controller/payment');
const express = require('express');
const router = express();

router.post('/telephonic', newPayment);
router.post('/telephonic/status/:id/:details', checkStatus);

module.exports = router;