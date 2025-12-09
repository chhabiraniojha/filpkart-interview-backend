const Sequelize=require('sequelize');

const sequelize=require('../../utill/db_connect');



const Candidate=sequelize.define('candidate',{
  id:{
    type:Sequelize.UUID,
    allowNull:false,
    primaryKey:true,
    defaultValue:Sequelize.UUIDV4
  },
  name:{
    type:Sequelize.STRING,
    allowNull:false
  },
  email:{
    type:Sequelize.STRING,
    allowNull:false
  },
  phone:{
    type:Sequelize.STRING,
    allowNull:false
  },
  slotDate:{
     type:Sequelize.DATE,
     allowNull:false
  },
  slotTime:{
     type:Sequelize.STRING,
     allowNull:false
  },
  slotStartTime:{
     type:Sequelize.STRING,
     allowNull:false
  },
  selectedVacancy:{
     type:Sequelize.STRING,
     allowNull:false
  },
  language:{
     type:Sequelize.STRING,
     allowNull:false
  },
  telephonicInterviewStatus:{
    type:Sequelize.BOOLEAN,
    allowNull:true,
    defaultValue:false
  },
  VirtualInterviewStatus:{
    type:Sequelize.BOOLEAN,
    allowNull:true,
    defaultValue:false
  },
  action:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
    defaultValue:false
  },
  action2:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
    defaultValue:false
  }

});

module.exports=Candidate;