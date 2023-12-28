const ticketList = document.getElementById("ticketList");
const filter = document.getElementById("filter");
const sorting = document.getElementById("sorting");
const searchBt = document.getElementById("searchBt");
let list = [];
const priorities = ["Low", "Medium", "High"];

fetch("/fullTicketList").then(function (response) {
    if (response.status === 200) {
        return response.json();
    }
    else {
        console.log("Something went wrong");
    }
}).then(function (tickets) {
    list = tickets;
    tickets.forEach(ticket => {
        displayTicket(ticket);
    });
});

filter.addEventListener("change", function (ev) {
    const filterValue = filter.value;
    if (filterValue != "All") {
        fetch("/ticketListOfDepartment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ filterValue })
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            else {
                console.log("Something went wrong");
            }
        }).then(function (tickets) {
            list = tickets;
            sorting.value = "Time ASC";
            ticketList.innerHTML = "";
            tickets.forEach(ticket => {
                displayTicket(ticket);
            });
        });
    }
    else {
        window.location.reload();
    }
});

sorting.addEventListener("change", function (ev) {
    const sortValue = sorting.value;
    ticketList.innerHTML = "";
    if (sortValue == "Time ASC") {
        list.forEach(ticket => {
            displayTicket(ticket);
        });
    }
    else if (sortValue == "Time DSC") {
        const tickets = list;
        tickets.reverse().forEach(ticket => {
            displayTicket(ticket);
        });
    }
    else if (sortValue == "Priority DESC") {
        const tickets = list.sort((a, b) => {
            return b.priority - a.priority;
        });
        tickets.forEach(ticket => {
            displayTicket(ticket);
        });
    }
});

searchBt.addEventListener("click", function (ev) {
    const searchInput = document.getElementById("search").value;
    if (searchInput != "") {
        tickets = list.filter((t) => t.title.toLowerCase().includes(searchInput.toLowerCase()));
        ticketList.innerHTML = "";
        tickets.forEach(ticket => {
            displayTicket(ticket);
        });
    }
    else{
        ticketList.innerHTML = "";
        list.forEach(ticket => {
            displayTicket(ticket);
        });
    }
});


function displayTicket(ticket) {
    const ticketNode = document.createElement("div");
    ticketNode.className = "ticketNode";

    const ticketTitle = document.createElement("div");
    ticketTitle.innerText = ticket.title;
    ticketNode.appendChild(ticketTitle);

    const priority = document.createElement("div");
    priority.innerText = priorities[ticket.priority];
    ticketNode.appendChild(priority);

    const time = document.createElement("div");
    time.innerText =new Date(ticket.createdAt).toLocaleDateString('en-US', {year: 'numeric',month: 'long',hour: 'numeric',minute: 'numeric'});
    ticketNode.appendChild(time);

    const status=document.createElement("div");
    status.innerText="Status : "+ticket.status;
    ticketNode.appendChild(status);

    ticketNode.addEventListener("click",function(ev){
        console.log(ticket._id);
        window.location.href="/adminTicketDetail/"+ticket._id;
    });
    

    ticketList.appendChild(ticketNode);
}