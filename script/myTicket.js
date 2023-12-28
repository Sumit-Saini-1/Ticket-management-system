const ticketList = document.getElementById("ticketList");

fetch("/myTicketList").then(function (response) {
    if (response.status === 200) {
        return response.json();
    }
    else {
        console.log("Something went wrong");
    }
}).then(function (tickets) {
    tickets.forEach(ticket => {
        displayTicket(ticket);
    });
});

function displayTicket(ticket) {
    const ticketNode = document.createElement("div");
    ticketNode.className = "ticketNode";
    const ticketTitle = document.createElement("div");
    ticketTitle.innerText = ticket.title;
    ticketNode.appendChild(ticketTitle);
    const status = document.createElement("div");
    status.innerText = ticket.status;
    ticketNode.appendChild(status);
    const time = document.createElement("div");
    time.innerText = new Date(ticket.createdAt).toLocaleDateString('en-US', {year: 'numeric',month: 'long',hour: 'numeric',minute: 'numeric'});
    ticketNode.appendChild(time);

    // if(ticket.haveUnreadmsg){
    //     ticketNode.style.backgroundColor="red";
    // }

    ticketNode.addEventListener("click",(e)=>{
        window.location.href="/resolveTicket/"+ticket._id;
    });
    ticketList.appendChild(ticketNode);


}