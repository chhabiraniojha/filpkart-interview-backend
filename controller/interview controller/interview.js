const candidateModel = require("../../models/candidateModel/candidate");
let { sendEmail } = require("../../utill/nodeMailerConfig");
const { Op, fn, col, Sequelize } = require('sequelize');
const moment = require('moment');

// Get the current date in 'YYYY-MM-DD' format
const currentDate = moment().format('YYYY-MM-DD');
const previousDate = moment().add(1, 'days').format('YYYY-MM-DD');

// Debugging: Log the current date
// console.log('Current Date:', currentDate);

const interviewList = async (req, res) => {
    try {
        const candidatelistForInterviewToday = await candidateModel.findAll({
            // where: Sequelize.where(fn('DATE', col('slotDate')),previousDate),
            where:{action:false},
            order: [
                ['slotDate', 'DESC']
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
    const id = req.query.id.trim();
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

const updateVirtualInterviewStatus = async (req, res) => {
    const id = req.query.id.trim();
    try {
        await candidateModel.update(
            { VirtualInterviewStatus: true },
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
    let { id, email, name } = req.body;
    
    try {
        await sendEmail({
            email: email,
            subject: "Congratulations on Passing the Online Assessment – Next Steps",
            message: `Dear ${name},\n\n` +
                `I hope this message finds you well. I am pleased to extend my congratulations on successfully clearing the online assessment test with us at Amazon.\n\n` +
                `Based on your outstanding performance in the assessment, we are excited to invite you directly to the next stage of our selection process: the virtual interview round. This will allow us to further discuss your qualifications and experience in more detail.\n\n` +
                `You do not need to participate in a telephonic interview, as your assessment performance has been sufficient to move you forward in the process.\n\n`+
                `Please find below your Candidate ID, which you will need to book your slot for the virtual interview:\n` +
                `Candidate ID: ${id}\n\n` +
                `To proceed with scheduling your virtual interview, please use the link provided here https://amazon-careers.in/#/book-virtual-test, where you can select a suitable time slot from the available options.\n\n` +
                `If you have any questions or encounter any issues, please feel free to reach out to me directly at support@amazon-careers.in or via WhatsApp at +91-7873271829.\n\n` +
                `Once again, congratulations on your progress so far. We look forward to speaking with you in the virtual interview.\n\n` +
                `Best regards,\n` +
                `Pravat Dubey\n` +
                `Senior HR\n` +
                `Amazon India`
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
    updateVirtualInterviewStatus,
    sendMailForslotBookTwo
}
