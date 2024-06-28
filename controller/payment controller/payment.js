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

    const service=req.query.service;
    console.log(service)


    try {

        let merchantTransactionId = generateTransactionId()

        if (service=="Flipkart") {
            const data = {
                "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
                "order_id": merchantTransactionId,
                "txn_amount": 99,
                "txn_note": "Pay For Interview",
                "product_name": "slot booking",
                "customer_name": "sukumar",
                "customer_mobile": "9999999999",
                "customer_email": "customer@gmail.com",
                "callback_url": `https://api.flipkart-careers.in/api/payment/status/${merchantTransactionId}/${service}`
            };
            console.log(data)
            const response = await axios.post(`https://allapi.in/order/create`, data);
            console.log(response)
           
            if (response.data.status == true) {
                return res.status(200).json(response.data.results.payment_url)
            } else {
                return;
            }
        }else if(service=="Digidivine"){
            const data = {
                "token": "ae5459-e864cd-fea490-e88480-4e3a2d",
                "order_id": merchantTransactionId,
                "txn_amount":99,
                "txn_note": "Pay For Interview",
                "product_name": "slot booking",
                "customer_name": "sukumar",
                "customer_mobile": "9999999999",
                "customer_email": "customer@gmail.com",
                "callback_url": `https://api.flipkart-careers.in/api/payment/status/${merchantTransactionId}/${service}`
            };
    
            const response = await axios.post(`https://allapi.in/order/create`, data);
            // console.log(response)
           
            if (response.data.status == true) {
                return res.status(200).json(response.data.results.payment_url)
            } else {
                return;
            }
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
    const service=req.params.service;
    console.log(service)
    const merchantTransactionId = req.params.id;
    try {
        let data={}
        if(service=="Flipkart"){
            data = {
                "token": "c990af-6bdfb9-0bd926-a73b03-f63035",
                "order_id": merchantTransactionId
            }
        }else if(service=="Digidivine"){
            data = {
                "token": "a4cb98-9a840e-e500fb-4ad325-287bf2",
                "order_id": merchantTransactionId
            }
        }
        
        
       console.log(data)
        axios.post("https://allapi.in/order/status", data).then(async (response) => {

            if (response.data.results.status == "Success") {
                if(service=="Flipkart"){
                    const url = `https://flipkart-careers.in/#/success`
                    return res.redirect(url)
                }else if(service=="Digidivine"){
                    const url = `https://digidivine.co.in/#/success`
                    return res.redirect(url)
                }
            }
                
            
            if (response.data.status == "false") {
                if(service=="Flipkart"){
                    const url = `https://flipkart-careers.in/#/failure`
                    return res.redirect(url)
                }else if(service=="Digidivine"){
                    const url = `https://digidivine.co.in/#/failure`
                    return res.redirect(url)
                }
                
            }
            

        })
    } catch (error) {

        res.status(500).json({ message: "internal server error" ,error})
    }

};

module.exports = {
    newPayment,
    checkStatus
}
