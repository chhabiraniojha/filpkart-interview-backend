const candidateModel = require("../../models/candidateModel/candidate");
let { sendEmail } = require("../../utill/nodeMailerConfig");
let { sendEmailDigidivine } = require("../../utill/nodeMailerConfigDigidivine");
const { Op, fn, col, Sequelize } = require("sequelize");
const moment = require("moment");

// Get the current date in 'YYYY-MM-DD' format
const currentDate = moment().format("YYYY-MM-DD");
const previousDate = moment().add(1, "days").format("YYYY-MM-DD");

// Debugging: Log the current date
// console.log('Current Date:', currentDate);

const interviewList = async (req, res) => {
  try {
    const candidatelistForInterviewToday = await candidateModel.findAll({
      // where: Sequelize.where(fn('DATE', col('slotDate')),previousDate),
      where: { action: false },
      order: [["slotDate", "DESC"]],
    });
    console.log(candidatelistForInterviewToday);
    return res
      .status(200)
      .json({ status: true, candidatelistForInterviewToday });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: "Internal server error" });
  }
};
const finalList = async (req, res) => {
  try {
    const candidatelistForInterviewToday = await candidateModel.findAll({
      // where: Sequelize.where(fn('DATE', col('slotDate')),previousDate),
      where: { action2: false },
      order: [["slotDate", "DESC"]],
    });
    console.log(candidatelistForInterviewToday);
    return res
      .status(200)
      .json({ status: true, candidatelistForInterviewToday });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
};

const updateTelephonicInterviewStatusDigidivine = async (req, res) => {
  const id = req.query.id.trim();
  try {
    await candidateModel.update(
      { telephonicInterviewStatus: true },
      {
        where: { id },
      }
    );
    const candidate = await candidateModel.findByPk(id);
    const name = candidate.dataValues.name;
    const email = candidate.dataValues.email;
    await sendEmailDigidivine({
      email: email,
      subject: "Update on Your Assessment Result and Refund Initiation",
      message:
        `Dear ${name},\n\n` +
        `I hope this message finds you well.\n\n` +
        `Thank you for participating in our assessment process. We regret to inform you that, based on the results, you did not meet the criteria to move forward in the selection process.\n\n` +
        `However, we value your effort and want to ensure that your experience with us remains positive. We have initiated a refund of the ₹149 fee that you paid for the assessment. The amount will be credited back to the account within 15 to 20 banking days from which the payment was made. Please allow 15 to 20 banking days for the transaction to be completed.\n\n` +
        `Thank you once again for your interest and participation. We wish you the best in your future endeavors.\n` +
        `Best regards,\n` +
        `HR Management\n` +
        `DIGIDIVINE ONLINE SERVICES PRIVATE LIMITED`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
};

const sendMailForslotBookTwo = async (req, res) => {
  let { id, email, name } = req.body;
  email = email.trim();

  try {
    await sendEmail({
      email: email,
      subject: "Congratulations on Passing the Online Assessment – Next Steps",
      message: `Dear ${name},\n
I hope this message finds you well. I am pleased to extend my congratulations on successfully clearing the online assessment test with us at Amazon.\n
Based on your outstanding performance in the assessment, we are excited to invite you directly to the next stage of our selection process: the virtual interview round. This will allow us to further discuss your qualifications and experience in more detail.\n
You do not need to participate in a telephonic interview, as your assessment performance has been sufficient to move you forward in the process.\n
Please find below your Candidate ID, which you will need to book your slot for the virtual interview:\n
Candidate ID: ${id}\n
To schedule your virtual interview, please use the link provided here:\n
${process.env.CLIENT_BASE_URL}/#/book-virtual-test\n
If you have any questions or encounter any issues, feel free to reach out to us via WhatsApp at +91-9937628031.\n
Once again, congratulations on your progress so far. We look forward to speaking with you in the virtual interview.\n
Best regards,\n
Pravat Dubey\n
Senior HR\n
Placement Zone\n
Vendor Amazon`,
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
};
const sendFinalMail = async (req, res) => {
  let { id, email, name } = req.body;
  email = email.trim();

  try {
    await sendEmail({
      email: email,
      subject: "Congratulations! Selection Confirmation & Next Steps",
      message: `Dear ${name},\n
      Congratulations!\n
      We are pleased to inform you that you have been successfully selected based on your performance in the online assessment conducted as part of our recruitment process associated with Amazon hiring partners.\n
      As you have scored above 80% in the assessment, the virtual interview round is not required in your case.\n
      The next stage of the process, including document verification and joining formalities, will now begin.\n
      To proceed further and receive detailed instructions, please contact our authorized recruitment coordinator:\n
      Name: Pravat Dubey\n
      WhatsApp Number: +91 9937628031\n
      Kindly ensure that you communicate only through the above-mentioned contact for official guidance and next steps. Please keep your required documents ready and respond promptly to avoid any delays.\n
      Once again, congratulations on your selection. We wish you a smooth onboarding experience and great success in your career ahead.\n
      Best regards,\n
      HR Department\n
      Placement Zone\n
      Vendor Amazon`
    });
    await candidateModel.update(
      { action2: true },
      {
        where: { id },
      }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  interviewList,
  finalList,
  updateTelephonicInterviewStatus,
  updateTelephonicInterviewStatusDigidivine,
  updateVirtualInterviewStatus,
  sendMailForslotBookTwo,
  sendFinalMail,
};
