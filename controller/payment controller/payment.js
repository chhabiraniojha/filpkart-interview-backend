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

// console.log(merchantTransactionId)

const newPayment = async (req, res) => {
    let { name, email, phone, slotDate, slotTime, selectedVacancy, language } = req.body;
    let encodedParams = Object.entries(req.body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');

    try {

        let merchantTransactionId = generateTransactionId()

            const data = {
                "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
                "order_id": merchantTransactionId,
                "txn_amount": 99,
                "txn_note": "Pay For Interview",
                "product_name": "slot booking",
                "customer_name": name,
                "customer_mobile": phone,
                "customer_email": email,
                "callback_url": `https://api.flipkart-career.in/api/payment/telephonic/status/${merchantTransactionId}/${encodedParams}`
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
    const { name, email, phone, slotDate, slotTime, selectedVacancy, language } = candidateDetails;
    console.log(name, email, phone, slotDate, slotTime, selectedVacancy, language)
    const slotStartTime = moment(slotTime.split(' ')[0] + slotTime.split(' ')[1], 'h:mmA').format('HH:mm:ss');
    const merchantTransactionId = req.params.id;

    try {
            let data = {
                "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
                "order_id": merchantTransactionId
            }
        axios.post("https://allapi.in/order/status", data).then(async (response) => {

            if (response.data.results.status == "Success") {
                    await candidateModel.create({
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
                        subject: "Telephonic Interview Schedule - Flipkart Internet Private Limited",
                        message: `Hello ${name},\n\n` +
                            `We are pleased to inform you that you have been shortlisted for the telephonic round of our recruitment process at Flipkart Internet Private Limited.\n\n` +
                            `You are scheduled for a telephonic interview on ${inSlotDate}, between ${slotTime}.\n\n` +
                            `During this time, you will receive a call from Mr. Sukumar Behera, our interviewer.\n\n` +
                            `Please ensure that you are available and that your phone is reachable during the specified time frame. The interview is an important part of our selection process, and we appreciate your prompt attention to this matter.\n\n` +
                            `We look forward to speaking with you soon.\n\n` +
                            `Best regards,\n` +
                            `HR Department\n` +
                            `Flipkart Internet Private Limited`
                    })
                    const url = `https://flipkart-career.in/#/success`
                    return res.redirect(url)
            }
            if (response.data.status == "false") {
                    const url = `https://flipkart-career.in/#/failure`
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