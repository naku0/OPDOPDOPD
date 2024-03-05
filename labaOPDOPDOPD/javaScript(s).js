function CheckInput() {
    let login = document.getElementById("email").value;
    let psw = document.getElementById("psw").value;
    if (login === "creeper2005@opdopdopd.com" && psw === "1488") {
        window.location.href = "OPDOPDOPD.html"
    } else {
        alert("Cука")
    }
}

function ShowDiv(class1) {
    class1 = document.getElementById(class1);
    class1.style.display = "grid";
}
function closeReg(class1){
    class1= document.getElementById(class1);
    class1.style.display ="none";
}

function ChangeDiv(id1, id2) {
    id1 = document.getElementById(id1);
    id2 = document.getElementById(id2);
    if (id2.style.display === "none") {
        id1.style.display = "none";
        id2.style.display = "grid";
    } else {
        id1.style.display = "grid";
        id2.style.display = "none";
    }
}

function CheckInputReg() {
    let login = document.getElementById("regEmail").value;
    let password = document.getElementById("regPsw").value;
    let passwordConfirm = document.getElementById("psw-repeat").value;
    if (ConfirmPassword(password, passwordConfirm)) {
        window.location.href = "OPDOPDOPD.html"
    } else {
        alert("Сука")
    }
}

function ConfirmPassword(psw1, psw2) {
    return psw1 === psw2;
}

function EndSession() {

}
function randomLogo(id1){
    let arr = Array("smoking_rooms", "accessible_forward","mood","functions","favorite",
        "school","school","school","wifi","wifi","code","");
    let item = arr[Math.floor(Math.random() * arr.length)];
    console.log(item);
    let iconElement = document.getElementById(id1);
    iconElement.textContent = item;
}