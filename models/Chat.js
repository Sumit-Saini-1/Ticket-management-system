const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    msg:String,
    sendFor:String,
    sendBy:String,
    time:String,
    seen:Boolean
});

const Chat=mongoose.model("Chat",chatSchema);

module.exports=Chat;