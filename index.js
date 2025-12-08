const express =require('express');
const bodyParser=require("body-parser")
const cors=require("cors")
require('dotenv').config();
const syncDB = require('./utill/syncModel')
const paymentRoute=require("./routes/payment routes/payment")
const paymentVirtualRoute=require("./routes/payment routes/paymentvirtual")
const candidateRoute=require("./routes/CandidateRoutes/candidate")
const interviewRoute=require("./routes/interview Routes/interview")
const digidivineRoute=require("./routes/payment-digidivineRoutes/payment-digidivine")





const app=express();
app.use(cors())

app.use(bodyParser.json({extended:false}));


// app.use("/",(req,res)=>{
//     res.send("hello")
// })
app.use("/api/payment",paymentRoute)
app.use("/api-virtual/payment",paymentVirtualRoute)
app.use("/candidate",candidateRoute)
app.use("/interview",interviewRoute)
app.use("/digidivine",digidivineRoute)
// app.listen(80)

syncDB()

app.listen(8080, () => {
    console.log(`Server listening at 8080`);
})


