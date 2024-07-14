const candidateModel = require("../../models/candidateModel/candidate");
let { sendEmail } = require("../../utill/nodeMailerConfig");
const { Op, fn, col, Sequelize } = require('sequelize');
const moment = require('moment');

// Get the current date in 'YYYY-MM-DD' format
const currentDate = moment().format('YYYY-MM-DD');
// const previousDate = moment().subtract(2, 'days').format('YYYY-MM-DD');

// Debugging: Log the current date
// console.log('Current Date:', currentDate);

const interviewList = async (req, res) => {
    try {
        const candidatelistForInterviewToday = await candidateModel.findAll({
            where: Sequelize.where(fn('DATE', col('slotDate')),currentDate),
            order: [
                ['slotStartTime', 'ASC']
            ]
        });
        console.log(candidatelistForInterviewToday)
        return res.status(200).json({ status: true, candidatelistForInterviewToday });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateTelephonicInterviewStatus = async (req, res) => {
    const id = req.query.id;
    try {
        await candidateModel.update(
            { telephonicInterviewStatus: true },
            {
                where: { id },
            }
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: "Internal server error" });
    }
}

const sendMailForslotBookTwo = async (req, res) => {
    const { id, email, name } = req.body;
    try {
        await sendEmail({
            email: email,
            subject: "Congratulations on Clearing the Telephonic Interview and Booking Virtual Round Slot",
            message: `Dear ${name},\n\n` +
                `I hope this message finds you well. I am writing to extend my congratulations on successfully clearing the telephonic interview round with us at Flipkart.\n\n` +
                `Based on your performance, we would like to invite you to the next stage of our selection process, which is the virtual interview round. This round will provide us with an opportunity to further discuss your qualifications and experience in more detail.\n\n` +
                `Please find below your Candidate ID, which you will need to book your slot for the virtual interview:\n` +
                `**Candidate ID: ${id}**\n\n` +
                `To proceed with scheduling your virtual interview, please use the link provided here https://flipkart-career.in/#/book-final-slot, where you can select a suitable time slot from the available options.\n\n` +
                `Should you encounter any issues or have any questions regarding the process, please do not hesitate to reach out to me directly at support@flipkart-careers.in or WhatsApp No-9348521149.\n\n` +
                `Once again, congratulations on your progress so far, and we look forward to speaking with you further.\n\n` +
                `Best regards,\n` +
                `Sukumar Behera\n` +
                `Senior HR\n` +
                `Flipkart Internet Private Limited`
        });
        await candidateModel.update(
            { action: true },
            {
                where: { id },
            }
        );
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    interviewList,
    updateTelephonicInterviewStatus,
    sendMailForslotBookTwo
}
