const ticketList = document.getElementById("ticketList");
const priorities = ["Low", "Medium", "High"];

fetch("/ticketList").then(function (response) {
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
    ticketTitle.innerText ="Title: "+ ticket.title;
    ticketNode.appendChild(ticketTitle);

    const desc = document.createElement("div");
    desc.innerText ="Description: "+ ticket.description;
    ticketNode.appendChild(desc);

    const priority = document.createElement("div");
    priority.innerText ="Priority: "+ priorities[ticket.priority];;
    ticketNode.appendChild(priority);

    const time = document.createElement("div");
    time.innerText ="Created: "+ new Date(ticket.createdAt).toLocaleDateString('en-US', {year: 'numeric',month: 'long', day: 'numeric',hour: 'numeric',minute: 'numeric'});
    ticketNode.appendChild(time);
    const ticketAction = document.createElement("div");
    const resolve = document.createElement("button");
    resolve.innerHTML = "Resolve";
    resolve.addEventListener("click", function (ev) {
        fetch("/addResolver", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticket)
        }).then(function (response) {
            if (response.status === 200) {
                ticketList.removeChild(ticketNode);
                window.location.href="/resolveTicket/"+ticket._id;
            }
            else {
                console.log("Something went wrong");
            }
        });
    });

    ticketAction.appendChild(resolve);
    ticketNode.appendChild(ticketAction);

    ticketList.appendChild(ticketNode);
}