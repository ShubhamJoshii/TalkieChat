const express = require("express");
const { DBModel, ChatDataModel } = require("./Database");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Authenication = require("./Authenication");

const envURL="/api/";
// const envURL="/";
router.post(`${envURL}register`, async (req, res) => {
  const { Name, Email, Password, Confirm_Password, Register_Date, Avatar } = req.body;
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

router.post(`${envURL}login`, async (req, res) => {
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

router.get(`${envURL}logout`, (req, res) => {
  res.clearCookie("talkieChatToken", { path: "/" });
  res.status(200).send("User Logout");
});

router.get(`${envURL}home`, Authenication, async (req, res) => {
  res.send(req.rootUser);
});

router.post(`${envURL}changeDP`, Authenication, async (req, res) => {
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

router.post(`${envURL}avatarSave`, Authenication, async (req, res) => {
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

router.post(`${envURL}changeColorSchema`, Authenication, async (req, res) => {
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

router.post(`${envURL}saveChatID`, Authenication, async (req, res) => {
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

router.get(`${envURL}chattingData`, Authenication, async (req, res) => {
  try {
    const fetchUserID = await ChatDataModel.find({
      $or: [{ User1_id: req.userID }, { User2_id: req.userID }],
    });
    res.send(fetchUserID);
  } catch (err) {
    console.log("Error");
  }
});

router.post(`${envURL}sendMessage`, Authenication, async (req, res) => {
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

router.post(`${envURL}findChatData`, async (req, res) => {
  const { _id } = req.body;
  console.log(_id)
  const fetchMessage = await ChatDataModel.findOne({ _id })
  if (fetchMessage) {
    res.send(fetchMessage.Messages);
  } else {
    res.send()
  }
});

router.get(`${envURL}allUSers`, async (req, res) => {
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

router.post(`${envURL}sendRequest`, Authenication, async (req, res) => {
  const { _id, Name, Email, Avatar } = req.body;
  console.log(req.body);
  const userExist = await DBModel.findOne({ _id })
  const userExist2 = await DBModel.findOne({ _id: req.userID });
  if (userExist) {
    userExist.Friend_Request = userExist.Friend_Request?.concat({ _id: req.rootUser._id, Name: req.rootUser.Name, Email: req.rootUser.Email, Avatar: req.rootUser.Avatar })
    await userExist.save();
  }
  if (userExist2) {
    userExist2.Friend_Request_Sended = userExist2.Friend_Request_Sended?.concat({ _id, Name, Email, Avatar })
    await userExist2.save();
  }
  res.send("Request Sended")
})

router.post(`${envURL}rejectfriend`, Authenication, async (req, res) => {
  // let { _id } = req.body;
  let requestSenderId = req.body._id;
  // console.log(_id)
  let userData = req.rootUser;
  const userExist = await DBModel.findOne({ _id: req.userID })
  const userExist2 = await DBModel.findOne({ _id: requestSenderId })
  if (userExist) {
    let updateUser = userData.Friend_Request.filter(e => e._id !== requestSenderId)
    userExist.Friend_Request = updateUser
    await userExist.save();
  }
  if(userExist2){
    let updateUser2 = userExist2.Friend_Request_Sended.filter(e => e._id !== req.rootUser._id.toString())
      userExist2.Friend_Request_Sended = updateUser2;
    await userExist2.save(); 
    console.log(updateUser2)
  }

})

router.post(`${envURL}accepted_request`, Authenication, async (req, res) => {
    // console.log(req.rootUser,req.body._id)
    // console.log()
    let data = req.rootUser.Friend_Request;
    const userExist = await DBModel.findOne({_id:req.rootUser});
    let a = data.filter(e => e._id !== req.body._id)
    if(userExist){
      userExist.Friend_Request = a
      userExist.save();
    }
  })

router.get(`${envURL}userSendedRequest`, Authenication, async (req, res) => {
  // console.log(req.userID)
  // let 
})


router.post(`${envURL}revertFriendRequest`, Authenication, async (req, res) => {
  const friendRequestRevert = req.body._id;
  let friendRequestSender = req.rootUser._id.toString();

  const userExist = await DBModel.findOne({ _id: friendRequestRevert });
  const userExist2 = await DBModel.findOne({ _id: friendRequestSender });
  if (userExist) {
    let updateUser = userExist.Friend_Request.filter(e => e._id !== friendRequestSender)
    // console.log(updateUser,friendRequestSender)
    userExist.Friend_Request = updateUser;
    userExist.save();
  }
  if (userExist2) {
    let updateUser = userExist2.Friend_Request_Sended.filter(e => e._id !== friendRequestRevert)
    console.log(updateUser)
    userExist2.Friend_Request_Sended = updateUser;
    userExist2.save();
  }
  res.send("Friend Request Remove");
})

module.exports = router;