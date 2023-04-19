const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = "SHUBHAMJOSHIISGOODBOYQWERTYUIOP";

mongoose
  .connect(
    "mongodb+srv://talkieChat:aCYcftGyIVypXQZu@talkiechat.a2emxi0.mongodb.net/talkieChats?retryWrites=true&w=majority",
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

const DBModel = mongoose.model("User_Login_Register", DBSchema);

module.exports = DBModel;
