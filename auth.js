const express = require("express");
const { DBModel, ChatDataModel } = require("./Database");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Authenication = require("./Authenication");
// const { default: FriendRequest } = require("./frontend/src/Components/FriendRequest/FriendRequest");
router.post("/register", async (req, res) => {
  const { Name, Email, Password, Confirm_Password, Register_Date, Avatar } =
    req.body;
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
        Avatar,
        AvatarBackground: "white",
        ColorSchema: "#44D7B6",
      });
      const data = userData.save();
      res.send("User Registered");
    } else {
      res.send("User Already Registered");
    }
  } catch (err) {
    res.send("Error");
  }
});

router.post("/login", async (req, res) => {
  const { Name_Email, Password, Login_Date, rememberME } = req.body;
  console.log(Name_Email, Password, Login_Date, rememberME);
  if (!Name_Email || !Password) {
    return res.send("Fill Form Properly");
  }
  try {
    const userExist = await DBModel.findOne({
      $or: [{ Name: Name_Email }, { Email: Name_Email }],
    });
    if (userExist) {
      const password_Match = await bcrypt.compare(Password, userExist.Password);
      if (password_Match) {
        userExist.Login = userExist.Login.concat({ Login_Date });

        if (rememberME) {
          const Token = await userExist.generateAuthToken();
          console.log(Token);
          res.cookie("talkieChatToken", Token, {
            expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          });
          userExist.save();
        } else {
          const Token = await userExist.generateAuthToken();
          console.log(Token);
          res.cookie("talkieChatToken", Token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
          });
          userExist.save();
        }
        res.send("User Logged-in");
      } else {
        res.send("User Password is Wrong");
      }
    }
  } catch (error) { }
});

router.get("/logout", (req, res) => {
  res.clearCookie("talkieChatToken", { path: "/" });
  res.status(200).send("User Logout");
});

router.get("/home", Authenication, async (req, res) => {
  res.send(req.rootUser);
});

router.post("/changeDP", Authenication, async (req, res) => {
  const { Avatar } = req.body;
  console.log(Avatar)
  try {
    const userExists = await DBModel.findOne({ _id: req.userID });
    const userMessageExists1 = await ChatDataModel.updateMany(
      { User1_id: req.userID },
      {
        $set: {
          User1_Avatar: Avatar,
        },
      }
    );
    const userMessageExists2 = await ChatDataModel.updateMany(
      { User2_id: req.userID },
      {
        $set: {
          User2_Avatar: Avatar,
        },
      }
    );
    if (userExists) {
      userExists.Avatar = Avatar;
      await userExists.save();
      res.send("Avatar Save");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/avatarSave", Authenication, async (req, res) => {
  const { Avatar, AvatarBackground } = req.body;
  try {
    const userExists = await DBModel.findOne({ _id: req.userID });
    const userMessageExists1 = await ChatDataModel.updateMany(
      { User1_id: req.userID },
      {
        $set: {
          User1_Avatar: Avatar,
          User1_AvatarBackground: AvatarBackground,
        },
      }
    );
    const userMessageExists2 = await ChatDataModel.updateMany(
      { User2_id: req.userID },
      {
        $set: {
          User2_Avatar: Avatar,
          User2_AvatarBackground: AvatarBackground,
        },
      }
    );
    if (userExists) {
      userExists.Avatar = Avatar;
      userExists.AvatarBackground = AvatarBackground;
      await userExists.save();
      res.send("Avatar Save");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/changeColorSchema", Authenication, async (req, res) => {
  const { ColorSchema } = req.body;
  try {
    const userExists = await DBModel.findOne({ _id: req.userID });
    if (userExists) {
      userExists.ColorSchema = ColorSchema;
      await userExists.save();
      res.send("Color Schema Updated");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/saveChatID", Authenication, async (req, res) => {
  const { ChatID } = req.body;
  const chatIDExists = await ChatDataModel.findOne({ ChatID });
  if (chatIDExists) {
    chatIDExists.User2_id = req.userID;
    chatIDExists.User2_Name = req.rootUser.Name;
    chatIDExists.User2_Avatar = req.rootUser.Avatar;
    chatIDExists.User2_AvatarBackground = req.rootUser.AvatarBackground;

    await chatIDExists.save();
    res.send("USerID Exists");
  } else {
    const saveChatID = await ChatDataModel({
      ChatID,
      User1_id: req.userID,
      User1_Name: req.rootUser.Name,
      User1_Avatar: req.rootUser.Avatar,
      User1_AvatarBackground: req.rootUser.AvatarBackground,
    });
    saveChatID.save();
    res.send("UserID save");
  }
});

router.get("/chattingData", Authenication, async (req, res) => {
  try {
    const fetchUserID = await ChatDataModel.find({
      $or: [{ User1_id: req.userID }, { User2_id: req.userID }],
    });
    res.send(fetchUserID);
  } catch (err) {
    console.log("Error");
  }
});

router.post("/sendMessage", Authenication, async (req, res) => {
  const { chat_id, Message, time } = req.body;
  let whoWrote = req.rootUser._id;
  console.log(chat_id, Message, time, whoWrote);
  try {
    const findUserMessage = await ChatDataModel.findOne({ _id: chat_id });
    console.log(findUserMessage);
    if (findUserMessage) {
      const messageData = await findUserMessage.addMessage(
        Message,
        time,
        whoWrote
      );
      await findUserMessage.save();
      res.send("Message Sended")
    }
  } catch (err) {
    console.log(err)
  }
});

router.post("/findChatData", async (req, res) => {
  const { _id } = req.body;
  console.log(_id)
  const fetchMessage = await ChatDataModel.findOne({ _id })
  if (fetchMessage) {
    res.send(fetchMessage.Messages);
  } else {
    res.send()
  }
});

router.get("/allUSers", async (req, res) => {
  let Users = []
  let User = await DBModel.find();
  for (i = 0; i < User.length; i++) {
    Users.push({
      _id: User[i]._id,
      Name: User[i].Name,
      Avatar: User[i].Avatar,
      Email: User[i].Email
    })
  }
  res.send(Users)
})

router.post("/sendRequest", Authenication, async (req, res) => {
  // console.log(req.body);
  const { _id, Name, Email, Avatar } = req.body;
  const userExist = await DBModel.findOne({_id})
  if(userExist){
    userExist.Friend_Request = userExist.Friend_Request?.concat({_id:req.rootUser._id,Name:req.rootUser.Name,Email:req.rootUser.Email,Avatar:req.rootUser.Avatar,AvatarBackground:req.rootUser.AvatarBackground})
    await userExist.save();
  }
  res.send("Request Sended")
})

router.post("/rejectfriend",Authenication,async(req,res)=>{
  let {_id} = req.body; 
  // console.log(_id)
  let userData = req.rootUser;
  const userExist = await DBModel.findOne({_id:req.userID})
  let updateUser = userData.Friend_Request.filter(e => e._id !== _id)
  console.log(updateUser)
  if(userExist){
    userExist.Friend_Request = updateUser
    await userExist.save();
  }
})


module.exports = router;