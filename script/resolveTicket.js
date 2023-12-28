let socket;
const chatContainer = document.getElementById("chat-container");
const msgContainer=document.getElementById("messages-container");
const submit = document.getElementById("submit");
let chatID;


document.body.addEventListener("click", (e) => {
    if (e.target.innerText == "Chat") {
        chatContainer.style.visibility = "visible";
        chatID=e.target.id;
        socket = io();
        messagesFromServer();
        msgContainer.innerHTML="";
        socket.emit("join_room",chatID);
    } else if (e.target.innerText == "Close") {
        fetch("/resolved", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: e.target.id })
        }).then((res) => {
            if (res.status === 200) {
                window.location.href = "/";
            }
            else {
                alert("something went wrong");
            }
        }).catch(function (err) {
            alert("Something went wrong");
        });
    } else if (e.target.innerText == "Cancel") {
        fetch("/cancelTicket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ _id: e.target.id })
        }).then((res) => {
            if (res.status === 200) {
                window.location.reload();
            }
            else {
                alert("something went wrong");
            }
        }).catch(function (err) {
            alert("Something went wrong");
        });
    }
});



submit.addEventListener('click', function (e) {
    e.preventDefault();
    const msg = document.getElementById("message-text");
    if (msg.value) {
        msgobj = {
            "msg": msg.value,
            "sendFor": chatID
        }
        socket.emit('chat message', msgobj);
        // showMessage(msgobj);
        msg.value = '';
    }
});

function messagesFromServer(){
    socket.on("newmsg",function(msgobj){
        socket.emit("msgseen",msgobj);
        showMessage(msgobj);
    });
}


function showMessage(msgobj) {
    var item = document.createElement('li');
    item.textContent = msgobj.msg;
    msgContainer.appendChild(item);

    msgContainer.scrollTo(0, msgContainer.scrollHeight);
}