function CheckInput() {
    let login = document.getElementById("email").value;
    let psw = document.getElementById("psw").value;
    if (login === "creeper2005@opdopdopd.com" && psw === "1488"){
        window.location.href = "OPDOPDOPD.html"
    }else{
        alert("Cука")
    }

}
function ChangeDiv(id1, id2){
    id1 = document.getElementById(id1);
    id2 = document.getElementById(id2);
    if(id2.style.display === "none"){
        id1.style.display = "none";
        id2.style.display = "block";
    }else{
        id1.style.display = "block";
        id2.style.display = "none";
    }
}