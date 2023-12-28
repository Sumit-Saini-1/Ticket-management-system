const mongoose=require("mongoose");

const ticketSchema=new mongoose.Schema({
    title:String,
    description:String,
    department:String,
    createdby:String,
    priority:String,
    status:String,
    resolverid:String,
    createdAt:Date,
    resolvedAt:Date,
    haveUnreadmsg:Boolean
});

const Ticket=mongoose.model("Ticket",ticketSchema);

module.exports=Ticket;