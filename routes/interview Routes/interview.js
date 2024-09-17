const {interviewList,updateTelephonicInterviewStatus,updateTelephonicInterviewStatusDigidivine,updateVirtualInterviewStatus,sendMailForslotBookTwo} = require('../../controller/interview controller/interview');
const express = require('express');
const router = express();

router.get('/interview-List', interviewList);
router.get('/update-telephonicInterviewStatus',updateTelephonicInterviewStatus);
router.get('/update-telephonicInterviewStatus-digidivine',updateTelephonicInterviewStatusDigidivine);
router.get('/update-virtualInterviewStatus',updateVirtualInterviewStatus);
router.post('/sendMail',sendMailForslotBookTwo)

module.exports = router;