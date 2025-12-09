const {interviewList,finalList,updateTelephonicInterviewStatus,updateTelephonicInterviewStatusDigidivine,updateVirtualInterviewStatus,sendMailForslotBookTwo,sendFinalMail} = require('../../controller/interview controller/interview');
const express = require('express');
const router = express();

router.get('/interview-List', interviewList);
router.get('/final-list', finalList);
router.get('/update-telephonicInterviewStatus',updateTelephonicInterviewStatus);
router.get('/update-telephonicInterviewStatus-digidivine',updateTelephonicInterviewStatusDigidivine);
router.get('/update-virtualInterviewStatus',updateVirtualInterviewStatus);
router.post('/sendMail',sendMailForslotBookTwo)
router.post('/sendFinalMail',sendFinalMail)

module.exports = router;