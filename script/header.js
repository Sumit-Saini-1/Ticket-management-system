const notificationContainer = document.getElementById("notification-container");
document.getElementById("notification-btn").addEventListener('click',(e)=>{
    if(notificationContainer.style.visibility =="hidden"){
        notificationContainer.style.visibility="visible"
    } else{
        notificationContainer.style.visibility="hidden"
    }
})
fetch("/getUnreadNotification").then(function (response) {
    return response.json();
}).then((tickets) => {
    notificationContainer.innerHTML = "";
    tickets.forEach(element => {
        const node = document.createElement("not");
        node.className="notification-node";
        node.innerText = element.title;
        node.addEventListener("click",function(ev){
            window.location.href="/resolveTicket/"+element._id;
        });

        notificationContainer.appendChild(node);
    });
}).catch((err) => {
    console.log(err);
});