const submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");
submit.disabled = true;
submit.style.cursor = "not-allowed";
let uFlag = false;
let pFlag = false;
function enable() {
    if (uFlag && pFlag) {
        submit.disabled = false;
        submit.style.cursor = "pointer";
    }
    else {
        submit.disabled = true;
        submit.style.cursor = "not-allowed";
    }
}
username.addEventListener("input", function (ev) {
    const usr = username.value.trim();
    if (usr.length >= 5) {
        uFlag = true;
    }
    else {
        uFlag = false;
    }
    enable();
});
password.addEventListener("input", function (ev) {
    const pass = password.value.trim();
    if (pass.length >= 8) {
        pFlag = true;
    }
    else {
        pFlag = false;
    }
    enable();
});