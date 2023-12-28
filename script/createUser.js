const submit = document.getElementById("submit");

submit.addEventListener("click", function (ev) {
    ev.preventDefault();
    const usernameid = document.getElementById("username");
    const passwordid = document.getElementById("password");
    const nameid = document.getElementById("name");
    const departmentid = document.getElementById("department");
    const username=usernameid.value.trim();
    const password=passwordid.value.trim();
    const name=nameid.value.trim();
    const department=departmentid.value;
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (username == "") {
        alert("Username must be entered");
        return false;
    }
    if (!re.test(password)) {
        alert("password must be more than 8 characters and there should be atleast 1 capital letter, 1 special character, 1 digit");
        return false;
    }
    if (name == "") {
        alert("name must be entered");
        return false;
    }
    if (department == "none") {
        alert("department must be entered");
        return false;
    }
    fetch("/createUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, name, department })
    }).then(function (response) {
        if (response.status === 200) {
            alert("user created successfully");
            usernameid.value="";
            passwordid.value="";
            nameid.value="";
            departmentid.value="none";
        }
        else {
            console.log("Something went wrong");
        }
    });
});