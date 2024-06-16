const express =require('express');
const bodyParser=require("body-parser")
const cors=require("cors")
require('dotenv').config();
const paymentRoute=require("./routes/payment routes/payment")
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();



const app=express();

app.use(bodyParser.json({extended:false}));
app.use(cors())
app.use((req, res) => {
    apiProxy.web(req, res, { target: 'http://172.212.91.177:3000' }, (error) => {
        if (error) {
            console.error('Proxy error:', error);
            res.status(500).send('Proxy error');
        }
    });
});

// app.use("/",(req,res)=>{
//     res.send("hello")
// })
app.use("/api/payment",paymentRoute)
app.listen(3000)

