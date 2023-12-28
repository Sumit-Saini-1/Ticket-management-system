const express = require('express');
const fs = require('fs');
const app = express();
const session = require("express-session");
const http = require('http');
const socketServer = http.createServer(app);
const { Server } = require("socket.io");
const chatServer = new Server(socketServer);


const db = require("./models/db");
const TicketModel = require("./models/Ticket");
const UserModel = require("./models/User");
const ChatModel = require("./models/Chat");
const { isLogin, isAdmin } = require('./auth');
const admincontroller = require("./admincontroller");


app.set('view engine', 'ejs');

const sessionMiddleware = session({
    secret: "anything",
    resave: false,
    saveUninitialized: true
});
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
chatServer.use(wrap(sessionMiddleware));

app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("style"));
app.use(express.static("script"));
app.use(express.json());



const departments = ["HR", "Development", "Technical"];
const filter = ["All", "HR", "Development", "Technical"];
const admin = "admin";



app.get("/", isLogin, (req, res) => {
    if (req.session.username === "admin") {
        res.redirect("/adminHome");
        return;
    }
    res.render("home");
});

app.get("/getUnreadNotification", isLogin, function (req, res) {
    const notifications = [];
    TicketModel.find({ $or: [{ createdby: req.session.username }, { resolverid: req.session._id }], haveUnreadmsg: true }).then(function (tickets) {
        return tickets;
    }).then(function (tickets) {
        tickets.forEach((ticket, i, tickets) => {
            checkUnread(ticket,req.session.username)
                .then(notification => {
                    notifications.push(notification);
                    if (i == tickets.length - 1) {
                        console.log(61,notifications);
                        res.status(200).json(notifications);
                    }
                });
        });
    }).catch(function(err){
        res.status(500).send("catch");
    })


    // TicketModel.find({$or:[{createdby:req.session.username},{resolverid:req.session._id}],haveUnreadmsg:true}).then(function(tickets){
    //     res.status(200).json(tickets);
    // }).catch((err)=>{
    //     res.status(500).send(err);
    // });
});

async function checkUnread(ticket,username) {
    const msgs = await ChatModel.find({ sendFor: ticket._id, sendBy: { $ne: username }, seen: false });
    if (msgs.length > 0) {
        return ticket;
    }
}



app.get("/ticketList", isLogin, (req, res) => {
    //api to send list of tickets to display at homepage of user
    TicketModel.find({ department: req.session.department, status: "waiting", resolverid: "" }).then(function (tickets) {
        if (tickets) {
            res.status(200).json(tickets);
            return;
        }
        res.status(500).send("error");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.post("/addResolver", isLogin, function (req, res) {
    const id = req.body._id;
    TicketModel.updateOne({ _id: id }, { resolverid: req.session._id, status: "In processing" }).then(function () {
        res.status(200).send("success");
        return;
    }).catch(function (err) {
        res.status(500).send("error");
    });
});

app.get("/resolveTicket/:id", isLogin, (req, res) => {
    TicketModel.findOne({ _id: req.params.id }).then(function (ticket) {
        if (ticket.createdby === req.session.username) {
            //my ticket details
            res.render("resolveTicket", { ticket: ticket, detailFor: "myTicket" });
            return;
        }
        else if (ticket.resolverid === req.session._id) {
            if (ticket.status == "resolved") {
                //detail of resolved ticket
                res.render("resolveTicket", { ticket: ticket, detailFor: "resolvedTicket" });
                return;
            }
            else {
                //detail of ticket yet to resolve
                res.render("resolveTicket", { ticket: ticket, detailFor: "myTicket" });
                return;
            }
        }
        else {
            //home
            res.render("resolveTicket", { ticket: ticket, detailFor: "myTicket" });
            return;
        }
    }).catch(function (err) {
        res.status(500).send(err);
    })
});



app.post("/resolved", isLogin, (req, res) => {
    const id = req.body._id;
    TicketModel.updateOne({ _id: id }, { status: "resolved", resolvedAt: new Date(Date.now()).toUTCString() }).then(function () {
        res.status(200).send("success");
        return;
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

app.post("/cancelTicket", isLogin, (req, res) => {
    //to cancel a ticket creater side
    const id = req.body._id;
    TicketModel.updateOne({ _id: id }, { status: "cancel" }).then(function () {
        res.status(200).send("success");
        return;
    }).catch(function (err) {
        res.status(500).send(err);
    });
});



app.get("/login", (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/");
        return;
    }
    res.render("login", { error: null });
});



app.post("/login", (req, res) => {
    //user authentication
    const username = req.body.username;
    const password = req.body.password;
    UserModel.findOne({ username: username, password: password }).then(function (u) {
        if (u) {
            req.session.isLoggedIn = true;
            req.session.username = u.username;
            req.session.department = u.department;
            req.session._id = u._id;
            if (u.username == admin) {
                res.redirect("/adminHome");
                return;
            }
            res.redirect("/");
            return;
        } else {
            res.render("login", { error: "invalid user name or password" });
        }
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.get("/resolvingTicket", isLogin, function (req, res) {
    res.render("ticketsUnderProcess");
});



app.get("/ticketsUnderProcessList", isLogin, function (req, res) {
    TicketModel.find({ resolverid: req.session._id, status: "In processing" }).then(function (tickets) {
        if (tickets) {
            res.status(200).json(tickets);
            return;
        }
        res.status(500).send("error");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.get("/myTicket", isLogin, function (req, res) {
    res.render("myTicket");
});



app.get("/myTicketList", isLogin, (req, res) => {
    // send a list of tickets created by user who is logged in

    TicketModel.find({ createdby: req.session.username }).then(function (tickets) {
        if (tickets) {
            res.status(200).json(tickets);
            return;
        }
        res.status(500).send("error");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.get("/resolvedTicket", isLogin, function (req, res) {
    res.render("resolvedTicket", { arr: departments });
});



app.get("/resolvedTicketList", isLogin, function (req, res) {
    TicketModel.find({ resolverid: req.session._id, status: "resolved" }).then(function (tickets) {
        if (tickets) {
            res.status(200).json(tickets);
            return;
        }
        res.status(500).send("error");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.get("/ticket", isLogin, (req, res) => {
    res.render("ticket", { arr: departments });
});



app.post("/ticket", isLogin, (req, res) => {
    const title = req.body.title.trim();
    const desc = req.body.description.trim();
    const category = req.body.category.trim();
    const priority = req.body.priority.trim();
    const username = req.session.username;
    if (!title) {
        res.status(500).send("error");
        return;
    }
    if (!desc) {
        res.status(500).send("error");
        return;
    }
    if (!category) {
        res.status(500).send("error");
        return;
    }
    if (!priority) {
        res.status(500).send("error");
        return;
    }
    TicketModel.create({ title: title, description: desc, department: category, createdby: username, priority: priority, createdAt: new Date(Date.now()).toUTCString(), status: "waiting", resolverid: "", resolvedAt: "", haveUnreadmsg: false }).then(function (ticket) {
        res.status(200).send("success");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.get("/profile", isLogin, (req, res) => {
    UserModel.findOne({ username: req.session.username }).then(function (u) {
        res.render("profile", { user: u });
    }).catch(function (err) {
        res.render("profile", { user: null });
    });

});


app.post("/changePassword", isLogin, (req, res) => {
    const old = req.body.oldPassword;
    const n = req.body.newPassword;
    UserModel.findOne({ username: req.session.username }).then(function (u) {
        if (u.password === old) {
            UserModel.updateOne({ username: req.session.username }, { password: n }).then(function (u) {
                res.status(200).send("success");
                return;
            }).catch(function (err) {
                res.status(500).send("error");
            })
        } else {
            res.status(401).send("password not matched");
        }
    }).catch(function (err) {
        res.status(500).send("error");
    });
});

app.post("/updateName", function (req, res) {
    UserModel.updateOne({ username: req.session.username }, { name: req.body.newname }).then(function () {
        res.status(200).send("success");
    }).catch(function (err) {
        res.status(500).send("error");
    });
});



app.get("/logout", function (req, res) {
    req.session.isLoggedIn = false;
    res.redirect("/login");
});



app.get("/adminHome", isLogin, isAdmin, function (req, res) {
    res.render("adminHome", { arr: filter });
});

app.get("/fullTicketList", isLogin, isAdmin, admincontroller.getFullTickets);

app.post("/ticketListOfDepartment", isLogin, isAdmin, admincontroller.ticketsOfADepartment);

app.get("/createUser", isLogin, isAdmin, function (req, res) {
    res.render("createUser", { arr: departments });
});

app.post("/createUser", isLogin, isAdmin, admincontroller.createNewUser);

app.get("/adminTicketDetail/:id", isLogin, isAdmin, admincontroller.ticketDetails);

app.get("/getchat/:id", isLogin, isAdmin, admincontroller.getChat);

app.delete("/ticket/:id", isLogin, isAdmin, admincontroller.deleteTicket);

app.get("*", isLogin, function (req, res) {
    res.redirect("/");
});

db.init().then(function () {
    console.log("db connected");
    socketServer.listen(2000, function () {
        console.log('listening on 2000');
    });
}).catch(function (err) {
    console.log(err);
});




chatServer.on('connection', function (socket) {
    console.log('a user connected');
    const session = socket.request.session;
    socket.on("disconnect", function () {
        console.log("a user disconnected");
    });

    socket.on("join_room", function (chatID) {
        socket.join(chatID);
        ChatModel.find({ sendFor: chatID }).then(function (messages) {
            messages.forEach(function (msgobj) {
                socket.emit("newmsg", msgobj);
            });
        }).catch(function (err) {
            console.log(err);
        });
    });

    socket.on('chat message', function (msgobj) {
        msgobj.sendBy = session.username;
        msgobj.seen = false;
        msgobj.time = new Date().toLocaleString();
        ChatModel.create(msgobj).then(function (msgobj) {
            TicketModel.updateOne({ _id: msgobj.sendFor }, { haveUnreadmsg: true }).then(function () {
                chatServer.to(msgobj.sendFor).emit("newmsg", msgobj);
            });
        }).catch(function (err) {
            console.log(err);
        });
    });
    socket.on("msgseen", function (msgobj) {
        if (msgobj.sendBy != session.username) {
            ChatModel.updateOne({ _id: msgobj._id }, { seen: true }).then(function (msg) {
                TicketModel.updateOne({ _id: msgobj.sendFor }, { haveUnreadmsg: false }).then(function (msg) {
                });
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
});