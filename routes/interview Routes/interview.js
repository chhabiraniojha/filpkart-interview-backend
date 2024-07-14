const {interviewList,updateTelephonicInterviewStatus,sendMailForslotBookTwo} = require('../../controller/interview controller/interview');
const express = require('express');
const router = express();

router.get('/interview-List', interviewList);
router.get('/update-telephonicInterviewStatus',updateTelephonicInterviewStatus);
router.post('/sendMail',sendMailForslotBookTwo)

module.exports = router;