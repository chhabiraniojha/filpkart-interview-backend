const {checkCandidateStatus} = require('../../controller/candidate controller/candidate');
const express = require('express');
const router = express();

router.get('/status', checkCandidateStatus);

module.exports = router;