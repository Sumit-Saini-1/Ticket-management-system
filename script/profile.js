const updatePassword = document.getElementById("updatePassword");
const updateName = document.getElementById("updateName");
const newPasswordid = document.getElementById("newPassword");
const confirmPasswordid = document.getElementById("confirmPassword");
const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

confirmPasswordid.addEventListener("input",function(ev){
    let npass=newPasswordid.value.trim();
    let confirmPass=confirmPasswordid.value.trim();
    if(npass!=confirmPass){
        confirmPasswordid.style.color="red";
    }
    else{
        confirmPasswordid.style.color="";
    }
});

updatePassword.addEventListener("click", function (ev) {
    const oldPassword = document.getElementById("oldPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!oldPassword) {
        alert("Enter old password");
        return;
    }
    if (!newPassword) {
        alert("Enter new password");
        return;
    }
    if (!confirmPassword) {
        alert("confirm your password");
        return;
    }
    if (newPassword != confirmPassword) {
        alert("new password and confirm password should match");
        return;
    }
    if (!re.test(newPassword)) {
        alert("password must be more than 8 characters and there should be atleast 1 capital letter, 1 special character, 1 digit");
        return false;
    }
    fetch("/changePassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ oldPassword, newPassword })
    }).then(function (response) {
        if (response.status == 200) {
            alert("password updated succesfully");
        }
        else {
            alert("password not updated");
        }
    }).catch(function (err) {
        console.log("something went wrong", err);
    });
});

updateName.addEventListener("click", function (ev) {
    let newname = document.getElementById("newname").value.trim();
    if (!newname) {
        alert("Enter name");
        return;
    }
    fetch("/updateName", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ newname })
    }).then(function (response) {
        if (response.status == 200) {
            alert("name updated succesfully");
            window.location.reload();
        }
        else {
            alert("name not updated");
        }
    }).catch(function (err) {
        console.log("something went wrong", err);
    });
});