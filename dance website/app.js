const express=require("express");
const path=require("path");
const bodyparser=require("body-parser");//middle ware
const app=express();
const port =80;
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/contactdata');
  console.log("Connected successfully")
}
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    enquiry: String,
    feedback: String
  });

const contact = mongoose.model('contact',contactSchema);

app.use('/static',express.static('static')); //for saving static files
app.use(express.urlencoded()) //middleware ->used to bring form data to express

//PUG SPECIFIC STUFF
app.engine('pug', require('pug').__express)
app.set('view engine','pug'); //set the template engine as pug
app.set('views',path.join(__dirname,'views'));//set the view directory

//ENDPOINTS
app.get('/',(req,res)=>{
    res.status(200).render('home.pug'); 
})

app.get('/contactus',(req,res)=>{
    res.status(200).render('contact.pug'); 
})

app.post('/contactus',(req,res)=>{
    var mydata=new contact(req.body);
    mydata.save().then(()=>{
        res.send("data saved to the database")
    }).catch(()=>{
        res.status(404).send("data not saved")
    });
})

//START THE SERVER
app.listen(port,()=>{
    console.log(`The application started successfully on port ${port}`);
})