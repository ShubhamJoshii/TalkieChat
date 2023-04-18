const express = require("express");

const path = require("path")
const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname,"frontend","build")));
app.get("/",(req,res)=>{
    console.log(path.resolve(__dirname,"frontend","build"));
    res.status(200).sendFile(path.resolve(__dirname,"frontend","build"));  
})

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

app.listen(5000,()=>{
    console.log(`Server running at port ${PORT} `);
})