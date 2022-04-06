const express=require('express')
const  path=require('path')

const app=express();
const port = 80;

//for serving static files
// app.use(express.static(path.join(__dirname, 'static'));

app.use(express.static(path.join(__dirname, 'static')));

app.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname+'/static/index.html'));
});
app.get("/login",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname+'/static/login.html'));
});
app.get("/stores",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname+'/static/stores.html'));
});
app.get("/home_service",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname+'/static/home_service.html'));
});

//PUG SPECIFIC STUF 
//set template engine for pug
app.set('view engine','pug')

//set the views directory
app.set('views', path.join(__dirname,'views'))

//our pug demo end point
// app.get("/demo",(req,res)=>{
//     res.status(200).render('demo',{title:'hey harry',message:'hello'})
// });

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