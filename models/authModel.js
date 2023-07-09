const mongoose=require('mongoose')
const authSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true,
        unique:true
    },
    token:{
        type:String
    }
})
const Auth=new mongoose.model('Auths',authSchema)
module.exports=Auth