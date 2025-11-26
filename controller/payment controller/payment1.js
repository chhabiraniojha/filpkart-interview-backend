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
// function getRandomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// Example usage:


// console.log(merchantTransactionId)

const newPayment = async (req, res) => {
    console.log("hii");
    let { mobileNumber, price, finalPrice } = req.body;

    let encodedParams = Object.entries(req.body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    try {

        let merchantTransactionId = generateTransactionId()

        const data = {
            "token": "313ef0-6cd2ad-5a887c-bb7147-0454f1",
            "order_id": merchantTransactionId,
            "txn_amount": finalPrice,
            "txn_note": "pay",
            "product_name": "pay",
            "customer_name": "name",
            "customer_mobile": mobileNumber,
            "customer_email": "email@gmail.com",
            "callback_url": `http://192.168.43.18:80/api/payment/telephonic/status/${merchantTransactionId}/${encodedParams}`
        };
        const response = await axios.post(`https://allapi.in/order/create`, data);
        // console.log(response)

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
    const { mobileNumber, price, finalPrice } = candidateDetails;
    console.log(mobileNumber, price, finalPrice)
    const merchantTransactionId = req.params.id;

    try {
        let data = {
            "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
            "order_id": merchantTransactionId
        }
        axios.post("https://allapi.in/order/status", data).then(async (response) => {
            let orderId = generateTransactionId()
            if (response.data.results.status == "Success") {
                await axios.post('https://mrobotics.in/api/recharge', {
                    api_token: "3e637fe6-c9fd-4c99-8276-69e400a70c17",
                    mobile_no: mobileNumber,
                    amount: 10,
                    company_id: 5,
                    order_id: orderId,
                    is_stv: false
                })

                console.log(mobileNumber, price, finalPrice)
            }
            if (response.data.status == "false") {
                const url = `https://flipkartcareers.site/#/failure`
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