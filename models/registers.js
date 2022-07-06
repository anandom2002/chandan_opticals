const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const { response } = require("express");

const empSchema=new mongoose.Schema({
     username:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true
     },
     confirmpassword:{
        type:String,
        required:true
     },
     mobile_no:{
        type:Number,
        required:true,
        unique:true
     },
     tokens:[{
        token:{
            type:String,
            required:true
        }
     }]
})

empSchema.methods.generateAuthToken=async function(){
    try {
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        console.log(token);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send("the error: "+error);
        console.log("the error: "+error);
    }
}

empSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log(`the curr pass is ${this.password}`);
        this.password=await bcrypt.hash("password",10);
        this.confirmpassword=await bcrypt.hash("password",10);;
        // console.log(`the curr pass is ${this.password}`);
    }
    next();
})

//creating collection
const Register=new mongoose.model("Register",empSchema);
module.exports=Register;