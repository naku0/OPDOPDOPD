function CheckInput(x, y) {
    let login = document.getElementById("email").value;
    let psw = document.getElementById("psw").value;
    if (login === "creeper2005@opdopdopd.com" && psw === "1488"){
        window.location.href = "OPDOPDOPD.html"
    }else{
        alert("Cука")
    }

}