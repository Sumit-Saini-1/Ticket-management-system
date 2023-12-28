const TicketModel=require('./models/Ticket');
const UserModel=require("./models/User");
const ChatModel=require("./models/Chat")
function getFullTickets(req,res){
    TicketModel.find({}).then(function (tickets) {
        if (tickets) {
            res.status(200).json(tickets);
            return;
        }
        res.status(500).send("error");
    }).catch(function (err) {
        res.status(500).send("error");
    });
}

function ticketsOfADepartment(req,res){
    TicketModel.find({ department: req.body.filterValue }).then(function (tickets) {
        if (tickets) {
            res.status(200).json(tickets);
            return;
        }
        res.status(500).send("error");
    }).catch(function (err) {
        res.status(500).send("error");
    });
}

function createNewUser(req,res){
    const u = req.body;
    UserModel.create({ username: u.username, password: u.password, name: u.name, department: u.department }).then(function (user) {
        res.status(200).send("successs");
    }).catch(function (err) {
        res.status(500).send("error");
    });
}
function ticketDetails(req,res){
    TicketModel.findOne({ _id: req.params.id }).then(function (ticket) {
        res.render("adminTicketDetail", { ticket: ticket });
    });
}
function getChat(req,res){
    ChatModel.find({sendFor:req.params.id}).then(function(messages){
        res.json(messages);
    }).catch(function(err){
        res.status(500).send(err);
    });
}

function deleteTicket(req,res){
    const id = req.params.id;
    TicketModel.deleteOne({ _id: id }).then(function () {
        ChatModel.deleteMany({sendFor:id}).then(function(){
            res.status(200).send("success");
            return;
        }).catch(function(err){
            res.status(500).send(err);
        });
    }).catch(function (err) {
        res.status(500).send(err);
    });
}
module.exports={
    getFullTickets,
    ticketsOfADepartment,
    createNewUser,
    ticketDetails,
    getChat,
    deleteTicket
}