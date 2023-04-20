const express = require("express");
const { DBModel, ChatDataModel } = require("./Database");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Authenication = require("./Authenication");
router.post("/register", async (req, res) => {
  const { Name, Email, Password, Confirm_Password, Register_Date, Avatar } =
    req.body;
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
  // res.json("User Registered");
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
        // userExist.save();
        if (rememberME) {
          const Token = await userExist.generateAuthToken();
          console.log(Token);
          res.cookie("jwtoken", Token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true,
          });
          userExist.save();
        }
        res.send("User Logged-in");
      } else {
        res.send("User Password is Wrong");
      }
    }
    // res.send("Login");
  } catch (error) {}
});

router.get("/home", Authenication, async (req, res) => {
  res.send(req.rootUser);
});

router.post("/avatarSave", Authenication, async (req, res) => {
  const { Avatar, AvatarBackground } = req.body;
  // console.log(Avatar,AvatarBackground)
  // const Avatar = await userExist.generateAuthToken();
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
    // const userMessageExists2 = await ChatDataModel.find({User2_id:req.userID});
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
  // console.log(ColorSchema)
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
  // console.log(ChatID);
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
    }
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
