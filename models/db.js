const mongoose=require("mongoose");

module.exports.init=async function(){
    await mongoose.connect("mongodb+srv://admin:k9k95NUyU4xiit6M@cluster0.h1usxsj.mongodb.net/ticketmanagement?retryWrites=true&w=majority");
}