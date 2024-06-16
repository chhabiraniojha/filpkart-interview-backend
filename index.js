const express =require('express');
const bodyParser=require("body-parser")
const cors=require("cors")
require('dotenv').config();
const paymentRoute=require("./routes/payment routes/payment")



const app=express();

app.use(bodyParser.json({extended:false}));
app.use(cors())

// app.use("/",(req,res)=>{
//     res.send("hello")
// })
app.use("/api/payment",paymentRoute)
app.listen(3000)

