const axios = require('axios');
const moment = require("moment");
let { sendEmail } = require('../../utill/nodeMailerConfig')
const candidateModel = require("../../models/candidateModel/candidate")


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

// Example usage:


// console.log(merchantTransactionId)

const newPayment = async (req, res) => {
    console.log("recd")
    let { name, email, phone, slotDate, slotTime, selectedVacancy, language } = req.body;
    phone = phone.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    
    if (phone.startsWith('91') && (phone.length>10)) {
        phone = phone.substring(2); // Remove +91 prefix if present
    }
    // Ensure phone number is exactly 10 digits
    // if (phone.length !== 10) {
    //     return res.status(400).json({ message: 'Invalid phone number format' });
    // }
    let encodedParams = Object.entries(req.body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    // let randomNumber = getRandomNumber(95, 99);
    let randomNumber = 1;
    try {

        let merchantTransactionId = generateTransactionId()

        const data = {
            "token": "313ef0-6cd2ad-5a887c-bb7147-0454f1",
            "order_id": merchantTransactionId,
            "txn_amount": randomNumber,
            "txn_note": "pay",
            "product_name": "pay",
            "customer_name": name,
            "customer_mobile": phone,
            "customer_email": email,
            "callback_url": `http://localhost:80/api/payment/telephonic/status/${merchantTransactionId}/${encodedParams}`
        };
        const response = await axios.post(`https://allapi.in/order/create`, data);
        console.log(response.data)

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
    let { name, email, phone, slotDate, slotTime, selectedVacancy, language } = candidateDetails;
    console.log(name, email, phone, slotDate, slotTime, selectedVacancy, language)
    const slotStartTime = moment(slotTime.split(' ')[0] + slotTime.split(' ')[1], 'h:mmA').format('HH:mm:ss');
    const merchantTransactionId = req.params.id;
    email=email.trim();
    try {
        let data = {
            "token": "16a0e2-885444-860560-5476c9-5d65bb",
            "order_id": merchantTransactionId
        }
        axios.post("https://allapi.in/order/status", data).then(async (response) => {

            if (response.data.results.status == "Success") {
                const candidate = await candidateModel.create({
                    name,
                    email,
                    phone,
                    slotDate,
                    slotTime,
                    slotStartTime,
                    selectedVacancy,
                    language,
                })
                const inSlotDate = moment(slotDate).format('DD-MM-YYYY');
                await sendEmail({
                    email: email,
                    subject: "Telephonic Interview Schedule - AMAZON RETAIL INDIA PRIVATE LIMITED",
                    message: `Hello ${name},\n\n
                        We are pleased to inform you that you have been shortlisted for the next stage of our recruitment process at AMAZON RETAIL INDIA PRIVATE LIMITED.\n\n
                        Before proceeding to the telephonic interview round, you are required to complete an online assessment. Please use the following link to access the assessment: https://amazon-careers.in/#/online-assessment-test. Your candidate ID for the assessment is: ${candidate.id}\n\n
                        The online assessment needs to be completed by 24 hours.\n\n 
                        Please note that only candidates who successfully complete the online assessment will be eligible for the telephonic interview. If you pass the online assessment, you will be scheduled for a telephonic interview on ${inSlotDate}, between ${slotTime}. During this time, you will receive a call from Mr. Subham Pal, our interviewer.\n\n
                        Please ensure that you are available and that your phone is reachable during the specified time frame for both the online assessment and the telephonic interview. The assessment and interview are important parts of our selection process, and we appreciate your prompt attention to these matters.\n\n
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
// const slotStartTime = moment(slotTime.split(' ')[0] + slotTime.split(' ')[1], 'h:mmA').format('HH:mm:ss');
// await candidateModel.create({
//     name,
//     email,
//     phone,
//     slotDate,
//     slotTime,
//     slotStartTime,
//     selectedVacancy,
//     language,
// })