const axios = require('axios');
const candidateModel=require("../../models/candidateModel/candidate")

const checkCandidateStatus = async (req, res) => {
     const candidateId=req.query.candidateId.trim();
     try {
        const candidate=await candidateModel.findByPk(candidateId);
        console.log(candidate)
        if(candidate){
           return res.status(200).json({success:true,candidate})
        }else{
           return res.status(200).json({success:false})
        }
     } catch (error) {
        return res.status(500).json({message:"internal server error"})
     }
    
}


module.exports = {
    checkCandidateStatus
}
