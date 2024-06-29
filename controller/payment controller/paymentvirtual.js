const axios = require('axios');


function generateTransactionId() {
    const timeStamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const merchentPrefiex = "T";
    const TransactionId = `${merchentPrefiex}${timeStamp}${randomNum}`
    return TransactionId
}

// console.log(merchantTransactionId)

const newPayment = async (req, res) => {

    try {

        let merchantTransactionId = generateTransactionId()

        const data = {
            "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
            "order_id": merchantTransactionId,
            "txn_amount": 399,
            "txn_note": "Pay For Interview",
            "product_name": "slot booking",
            "customer_name": "sukumar",
            "customer_mobile": "7008698408",
            "customer_email": "ufw@gmail.com",
            "callback_url": `https://api.flipkart-careers.in/api-virtual/payment/virtual/status/${merchantTransactionId}`
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
    const merchantTransactionId = req.params.id;

    try {

        let data = {
            "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
            "order_id": merchantTransactionId
        }

        axios.post("https://allapi.in/order/status", data).then(async (response) => {

            if (response.data.results.status == "Success") {
                const url = `https://flipkart-careers.in/#/success`
                return res.redirect(url)
            } 
            if (response.data.status == "false") {
            
                const url = `https://flipkart-careers.in/#/failure`
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
