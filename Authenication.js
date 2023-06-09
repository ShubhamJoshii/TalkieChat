const {DBModel} = require("./Database")
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const Authenication = async (req,res,next)=>{
    try{
        // console.log(req.cookies.talkieChatToken);
        const Token = req.cookies.talkieChatToken;  
        const verifyToken = jwt.verify(Token,SECRET_KEY);

        const rootUser = await DBModel.findOne({_id:verifyToken._id,"Tokens.Token":Token});
        if(!rootUser){
            throw new Error("User Not Found");
        }
        req.Token = Token;
        req.rootUser = rootUser;
        req.userID = rootUser._id; 
        next();
    }catch(err){
        res.status(401).send("Unauthorized:No token provided");
        console.log("Authenication Error User is Not Logged-in");
    }
}

module.exports = Authenication;