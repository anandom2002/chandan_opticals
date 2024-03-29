require('dotenv').config();
const mongoose=require("mongoose");

const DB=process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true,
    // useFindAndModify:false,

}).then(()=>{
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(`no connection`);
    console.log(e);
})