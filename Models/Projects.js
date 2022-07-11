const mongoose=require('mongoose')



const project= new mongoose.Schema({
    title:String,
    image:String,
    github:String,
    demo:String,
})
const Project=mongoose.model('Project',project)


module.exports=Project

