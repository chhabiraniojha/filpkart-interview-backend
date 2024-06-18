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
        const merchantTransactionId = generateTransactionId()


        const data = {
            "token": "c990af-6bdfb9-0bd926-a73b03-f63035",
            "order_id": merchantTransactionId,
            "txn_amount": 1,
            "txn_note": "Pay For Interview",
            "product_name": "slot booking",
            "customer_name": "sukumar",
            "customer_mobile": "9999999999",
            "customer_email": "customer@gmail.com",
            "callback_url": `https://api.flipcartinterview.in/api/payment/status/${merchantTransactionId}`
        };

        const response = await axios.post(`https://allapi.in/order/create`, data);
       
        if (response.data.status == true) {
            return res.status(200).json(response.data.results.payment_url)
        } else {
            return;
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const checkStatus = async (req, res) => {
    const merchantTransactionId = req.params.id;
    try {
        const data = {
            "token": "c990af-6bdfb9-0bd926-a73b03-f63035",
            "order_id": merchantTransactionId
        }

        axios.post("https://allapi.in/order/status", data).then(async (response) => {

            if (response.data.results.status == "Success") {
                const url = `https://flipcartinterview.in/#/success`
                return res.redirect(url)
            }
            
            const url = `https://flipcartinterview.in/failure`
            return res.redirect(url)

        })
    } catch (error) {

        res.status(500).json({ message: "internal server error" ,error})
    }

};

module.exports = {
    newPayment,
    checkStatus
}
