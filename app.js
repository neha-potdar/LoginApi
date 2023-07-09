const express=require('express')
const app=express()
require('dotenv').config()
const port=process.env.PORT || 8000
const cors=require('cors')
const bodyParser=require('body-parser')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const auth = require("./middlewares/auth"); 
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

const dbcon=require('./config/db')
const authModel=require('./models/authModel')
app.get('/',(req,res)=>{
    res.send('Welcome')
})
app.get('/welcome',(req,res)=>{
    res.send('Hello')
})

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { fname, lname, email, pass } = req.body;
  
      // Validate user input
      if (!(email && pass && fname && lname)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await authModel.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(pass, 10);
  
      // Create user in our database
      const user = await authModel.create({
        fname,
        lname,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        pass: encryptedPassword,
      });
  
      // Create token
      console.log(process.env.TOKEN_KEY)
      const token = jwt.sign(
        { user_id: user._id, email },
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
     res.send(token)
    } catch (err) {
      console.log(err);
    }
    //Our register logic ends here
  });
  app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, pass} = req.body;
  
      // Validate user input
      if (!(email && pass)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await authModel.findOne({ email });
  
      if (user && (await bcrypt.compare(pass, user.pass))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json("Login Successful"+ user);
      }
     else{
      res.status(500).send("Invalid Credentials")
     }
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });
module.exports=app
