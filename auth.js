const express = require("express");
const DBModel = require("./Database");
const bcrypt  = require("bcrypt")
const router = express.Router();
const jwt = require("jsonwebtoken")
const Authenication = require("./Authenication")
router.post("/register", async (req, res) => {
  const { Name, Email, Password, Confirm_Password, Register_Date } = req.body;
  // console.log(Name,Email,Password,Confirm_Password,Register_Date);

  if (!Name || !Email || !Password || !Confirm_Password) {
    return res.send("Fill Form Properly");
  }

  try {
    const userExist = await DBModel.findOne({ Email });
    if (!userExist) {
      const userData = new DBModel({
        Name,
        Email,
        Password,
        Confirm_Password,
        Register_Date,
      });
      const data = userData.save();
      res.send("User Registered");
    } else {
      res.send("User Already Registered");
    }
  } catch (err) {
    res.send("Error");
  }
  // res.json("User Registered");
});

router.post("/login",async (req,res)=>{
    const {Name_Email,Password,Login_Date,rememberME} = req.body;
    console.log(Name_Email,Password,Login_Date,rememberME);
    if(!Name_Email || !Password){
        return res.send("Fill Form Properly");
    }
    try {
        const userExist = await DBModel.findOne({$or:[{Name:Name_Email},{Email:Name_Email}]})
        if(userExist){
            const password_Match = await bcrypt.compare(Password,userExist.Password);
            if(password_Match){
                userExist.Login = userExist.Login.concat({Login_Date});
                // userExist.save();
                if(rememberME){
                    const Token = await userExist.generateAuthToken();
                    console.log(Token)
                    res.cookie("jwtoken",Token,{
                        expires : new Date(Date.now() + 25892000000),
                        httpOnly : true
                    })
                    userExist.save();
                }
                res.send("User Logged-in")
            }else{
                res.send("User Password is Wrong");
            }
        }
        // res.send("Login");
    } catch (error) {
        
    }
})

router.get("/home",Authenication,async(req,res)=>{
    res.send(req.rootUser)
})

router.post("/avatarSave",Authenication,async (req,res)=>{
  const {Avatar} = req.body;
  console.log(Avatar)
  // const Avatar = await userExist.generateAuthToken();
  try {
    const userExists = await DBModel.findOne({_id:req.userID});
    if(userExists){
      userExists.Avatar = Avatar;
      await userExists.save();
      res.send("Avatar Save");
    }
  } catch (err) {
    console.log(err);
  }
})

router.post("/changeColorSchema",Authenication,async(req,res)=>{
  const {ColorSchema} = req.body;
  console.log(ColorSchema)
  try {
    const userExists = await DBModel.findOne({_id:req.userID});
    if(userExists){
      userExists.ColorSchema = ColorSchema;
      await userExists.save();
      res.send("Color Schema Updated");
    }
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
