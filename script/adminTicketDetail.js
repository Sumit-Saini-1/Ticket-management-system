const chatContainer = document.getElementById("chat-container");
const msgContainer=document.getElementById("messages-container");

document.body.addEventListener("click", (e) => {
    if (e.target.innerText == "Chat") {
        chatContainer.style.visibility = "visible";
        fetch("/getchat/"+e.target.id).then(function(response){
            if(response.status==200){
                return response.json();
            }
            else{
                console.log("something went wrong");
            }
        }).then(function(messages){
            msgContainer.innerHTML="";
            messages.forEach(msgobj => {
                showMessage(msgobj);
            });
        }).catch(function(err){
            console.log(err);
        });
    } else if (e.target.innerText == "Delete") {
        fetch("/ticket/" + e.target.id, {
            method: "delete"
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
    } else if (e.target.innerText == "Close") {
        window.location.href = "/";
    }
});

function showMessage(msgobj) {
    var item = document.createElement('li');
    item.textContent = msgobj.msg;
    msgContainer.appendChild(item);

    msgContainer.scrollTo(0, msgContainer.scrollHeight);
}