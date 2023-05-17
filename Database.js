const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database CONNECTED");
  })
  .catch(() => {
    console.log("Database ERROR");
  });

const DBSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Avatar: {
    type: String,
    require: true,
  },
  AvatarBackground: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  Confirm_Password: {
    type: String,
    require: true,
  },
  Register_Date: {
    type: String,
    require: true,
  },
  ColorSchema: {
    type: String,
    require: true,
  },
  Friend_Request:[
    {
      _id:{
        type: String,
        require: true,
      },
      Name:{
        type: String,
        require: true,
      },
      Email:{
        type: String,
        require: true,
      },
      Avatar:{
        type: String,
        require: true,
      },
      AvatarBackground:{
        type: String,
        require: true,
      },
    },
  ],
  Friend_Request_Sended:[
    {
      _id:{
        type: String,
        require: true,
      },
      Name:{
        type: String,
        require: true,
      },
      Email:{
        type: String,
        require: true,
      },
      Avatar:{
        type: String,
        require: true,
      },
      AvatarBackground:{
        type: String,
        require: true,
      },
    },
  ],
  Login: [
    {
      Login_Date: {
        type: String,
        require: true,
      },
    },
  ],
  Tokens: [
    {
      Token: {
        type: String,
        require: true,
      },
    },
  ],
});

const ChatDataSchema = new mongoose.Schema({
  ChatID: {
    type: Number,
    require: true,
  },
  User1_id: {
    type: String,
    require: true,
  },
  User1_Name: {
    type: String,
    require: true,
  },
  User1_Avatar: {
    type: String,
    require: true,
  },
  User1_AvatarBackground: {
    type: String,
    require: true,
  },
  User2_Avatar: {
    type: String,
    require: true,
  },
  User2_AvatarBackground: {
    type: String,
    require: true,
  },
  User2_Name: {
    type: String,
    require: true,
  },
  User2_id: {
    type: String,
    require: true,
  },
  Messages: [
    {
      Message: {
        type: String,
        require: true,
      },
      time: {
        type: String,
        require: true,
      },
      whoWrote: {
        type: String,
        require: true,
      },
    },
  ],
});

DBSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 12);
    this.Confirm_Password = await bcrypt.hash(this.Confirm_Password, 12);
  }
  next();
});

DBSchema.methods.generateAuthToken = async function () {
  try {
    let Token = jwt.sign({ _id: this._id }, SECRET_KEY);
    this.Tokens = this.Tokens.concat({ Token: Token });
    await this.save();
    return Token;
  } catch (err) {
    console.log(err);
  }
};

ChatDataSchema.methods.addMessage = async function (Message, time, whoWrote) {
  console.log(Message, time, whoWrote);
  this.Messages = this.Messages.concat({
    Message,
    whoWrote,
    time
  });
  await this.save();
  return this.Messages;
};

const DBModel = mongoose.model("User_Login_Register", DBSchema);
const ChatDataModel = mongoose.model("Chat_Data", ChatDataSchema);

module.exports = { DBModel, ChatDataModel };
