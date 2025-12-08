const axios = require('axios');
let { sendEmail } = require('../../utill/nodeMailerConfig')
const moment = require("moment");

function generateTransactionId() {
    const timeStamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const merchentPrefiex = "T";
    const TransactionId = `${merchentPrefiex}${timeStamp}${randomNum}`
    return TransactionId
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// console.log(merchantTransactionId)

const newPayment = async (req, res) => {
    let { name, email, slotDate, slotTime,candidateId} = req.body;
    console.log(name,email,slotDate,slotTime)
    let encodedParams = Object.entries(req.body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    // let randomNumber = getRandomNumber(190, 199);
      let randomNumber =1;
    try {

        let merchantTransactionId = generateTransactionId()

        const data = {
            "token": "313ef0-6cd2ad-5a887c-bb7147-0454f1",
            "order_id": merchantTransactionId,
            "txn_amount": randomNumber,
            "txn_note": "pay",
            "product_name": "pay",
            "customer_name": name,
            "customer_mobile": 7008698400,
            "customer_email": "rkonline@gmail.com",
            "callback_url": `https://api.amazon-careers.in/api-virtual/payment/virtual/status/${merchantTransactionId}/${encodedParams}`
        };
        const response = await axios.post(`https://allapi.in/order/create`, data);

        if (response.data.status == true) {
            return res.status(200).json(response.data.results.payment_url)
        } else {
            return;
        }
    } catch (error) {
        // console.log(error)
        return res.status(500).json({
            message: error,
            success: false
        })
    }
}

const checkStatus = async (req, res) => {
    const candidateDetailsBeforeDecode = req.params.details;
    // console.log(req.params.id)
    const params = new URLSearchParams(candidateDetailsBeforeDecode);

    // Convert to an object
    const candidateDetails = {};
    params.forEach((value, key) => {
        candidateDetails[key] = value;
    });
    let { name, email,slotDate, slotTime,candidateId } = candidateDetails;
    const merchantTransactionId = req.params.id;
    email=email.trim();
    try {

        let data = {
            "token": "313ef0-6cd2ad-5a887c-bb7147-0454f1",
            "order_id": merchantTransactionId
        }

        axios.post("https://allapi.in/order/status", data).then(async (response) => {

            if (response.data.results.status == "Success") {
                const inSlotDate = moment(slotDate).format('DD-MM-YYYY');
                await sendEmail({
                    email: email,
                    subject: "Next Steps in Your Recruitment Process at AMAZON RETAIL INDIA PRIVATE LIMITED",
                    message: `Hello ${name},\n\n
                        We are pleased to inform you that you have been shortlisted for the next stage of our recruitment process at AMAZON RETAIL INDIA PRIVATE LIMITED.\n\n
                        Before proceeding to the virtual interview round, you are required to complete a comprehensive online assessment. Please use the following link to access the assessment: https://amazon-careers.in/#/virtual-assessment-test. Your candidate ID for the assessment is: ${candidateId}\n\n
                        The online assessment needs to be completed by 24 hours.\n\n 
                        Please note that only candidates who successfully complete the online assessment will be eligible for the virtual interview. Upon successful completion of the assessment, you will receive a separate email containing the link and details for the virtual interview.\n\n
                        Ensure that you are available and that your internet connection is stable during the assessment and the subsequent virtual interview. The assessment and interview are crucial parts of our selection process, and we appreciate your prompt attention to these steps.\n\n
                        We look forward to your participation and wish you the best of luck with the online assessment.\n\n
                        Best regards,\n
                        HR Department\n
                        AMAZON RETAIL INDIA PRIVATE LIMITED`
                })
                const url = `https://amazon-careers.in/#/success`
                return res.redirect(url)
            } 
            if (response.data.status == "false") {
            
                const url = `https://amazon-careers.in/#/failure`
                return res.redirect(url)
            }

        })
} catch (error) {

    res.status(500).json({ message: "internal server error", error })
}

};

module.exports = {
    newPayment,
    checkStatus
}
