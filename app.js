require('dotenv').config();
const express=require('express')
const  path=require('path')
const hbs=require('hbs')
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const bodyparser=require("body-parser");
const cookieparser=require("cookie-parser");
const auth=require("./middleware/auth")

// const session=require("express-session");
require("./db/conn");
const Register=require("./models/registers");

const app=express();
const port =process.env.PORT || 80;
const {json}=require("express")
//for serving static files
// app.use(express.static(path.join(__dirname, 'static'));

// app.use(express.static(path.join(__dirname, 'static')));

// app.get("/",(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname+'/static/index.html'));
// });
// app.get("/login",(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname+'/static/login.html'));
// });
// app.get("/stores",(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname+'/static/stores.html'));
// });
// app.get("/about_us",(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname+'/static/about_us.html'));
// });

// app.use(express.static(path.join(__dirname, 'static'));
app.use(express.static(path.join(__dirname, '/templates/image')));
app.use(express.static(path.join(__dirname, '/templates/css')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());

//PUG SPECIFIC STUF 
//set template engine for pug
app.set('view engine','hbs')

//set the views directory
app.set('views', path.join(__dirname,'/templates/views'))
hbs.registerPartials(path.join(__dirname,'/templates/partials'))

console.log(process.env.SECRET_KEY)

// our pug demo end point
app.get("/",(req,res)=>{
    res.status(200).render('index')
});
app.get("/about_us",auth,(req,res)=>{
    res.status(200).render('about_us');
    // console.log(`this is cookie ${req.cookies.jwt}`);
});
app.get("/login",(req,res)=>{
    res.status(200).render('login')
});
app.get("/stores",(req,res)=>{
    res.status(200).render('stores')
});
app.get("/register",(req,res)=>{
    res.status(200).render('register')
});
app.post("/register",async(req,res)=>{
    try {
       const password=req.body.password;
       const cnfpassword=req.body.confirmpassword;
       if(password===cnfpassword){
        // res.send("pass matching")
        const registerEmp=new Register({
            username:req.body.username,
            password:password,
            confirmpassword:cnfpassword,
            mobile_no:req.body.mobile_no
        })
        console.log(registerEmp);
        const token=await registerEmp.generateAuthToken();
        console.log("the token part "+token);

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+30000),
            httpOnly:true
        });

        const registered=await registerEmp.save();
        res.status(201).render("index");
       }
       else{res.send("pass not matching")}

    } catch (error) {
        res.status(400).send(error);
        console.log("hyy")
    }
});

//login validation
app.post("/login",async(req,res)=>{
    try {
        const username=req.body.username;
        const password=req.body.password;
        console.log(`${username} and password is ${password}`)
        const useremail=await Register.findOne({username:username});

        const isMatch=bcrypt.compare(password,useremail.password);

        

        const token=await useremail.generateAuthToken();
        console.log("the token part "+token);

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+500000),
            httpOnly:true,
            // secure:true
        });

        console.log(`this is cookie ${req.cookies.jwt}`);

        if(isMatch){
            // res.status(201).render("dashboard",{cname :username});
            res.status(201).render("index");
        }
        else{
            res.send("invalid login");
        }
    } catch (error) {
        res.status(400).send("invalid email")
    }
});

// app.get("/",(req,res)=>{
//     res.status(200).send("hello world");
// });
// app.get("/about",(req,res)=>{
//     res.send("hello world this is about");
// });
// app.post("/about",(req,res)=>{
//     res.send("hello world post")
// });

 

app.listen(port ,()=>{
    console.log(`successful on ${port}`)
})

// TtPnErFbgSX3wxziK72aWZA62MQNM1liPU_uPRVcHUk