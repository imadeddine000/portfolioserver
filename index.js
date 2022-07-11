const express = require('express')
const mongoose=require('mongoose')
const cors = require('cors')
const app=express()
const dotenv=require('dotenv').config()
app.use(cors())
app.use(express.json())
const Project = require('./Models/Projects')
const User = require('./Models/Users')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodeMailer=require('nodemailer')
app.post('/add',(req,res)=>{
    const title=req.body.title
    const image=req.body.image
    const github=req.body.github
    const demo=req.body.demo

    const project = new Project({
        title,
        image,
        github,
        demo
    })
    project.save()
    res.end('added')
})
app.get('/project',(req,res)=>{
    Project.find((err,result)=>{
        res.send({result,message:"fetch done "})
    })
})
app.post('/delete',(req,res)=>{
    const id=req.body.id
    Project.findByIdAndDelete(id,(err)=>{
        if(err) console.log(err)
    })
})
app.post('/checkuser',(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    User.findOne({username:username},(err,result)=>{
        if(!result){
            res.send('username not found')
            console.log('wrong username')
        }
        else{
            console.log(result)
            bcrypt.compare(password,result.password,(err,result)=>{
                if(!result){
                    res.send({state:false,message:'password is wrong'})
                    console.log('wrong')
                }
                else{
                    const token=jwt.sign(username,'secretkey')
                    res.send({token,state:true})
                    console.log(token,'signed in')
                }
            })
        }
    })
})
app.post('/checktoken',(req,res)=>{
    const token=req.body.token
    if(!token){
        res.send(false)
        
    }else{
        jwt.verify(token,'secretkey',(err,decoded)=>{
            if(err){
                console.log(err)
                res.send('error')
            }else{
                if(decoded){
                    res.send(true)
                }
                console.log(decoded)
            }
        })
    }
    
})
app.post('/send',async (req,res)=>{
    const message=req.body.message
    const email=req.body.email
    const name=req.body.name


    
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'idhtagwork@gmail.com',
                pass:process.env.KEY
            }
        });
        let mailOptions = {
            from: email, // sender address
            to: 'imadeddinekebourlite@gmail.com', // list of receivers
            subject: req.body.name, // Subject line
            text: req.body.message, // plain text body
            html: `<h1>${req.body.message}</h1>` // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
                res.render('index');
            });
        });



mongoose.connect(process.env.URI,()=>{
    console.log('database connected...')
})


app.listen(process.env.PORT||3001,()=>{
    console.log('server running')
})
