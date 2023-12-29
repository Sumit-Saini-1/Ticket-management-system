const mongoose=require("mongoose");

module.exports.init=async function(){
    await mongoose.connect("mongodb+srv://admin:@cluster0.h1usxsj.mongodb.net/ticketmanagement?retryWrites=true&w=majority");
}
