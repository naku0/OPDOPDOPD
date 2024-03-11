class Flag {
    static _flag = false;

    static get flag() {
        return this._flag;
    }

    static set flag(value) {
        this._flag = value;
    }
}

const flag = new Flag();
let counter = 0;

function CheckFlag(enterId, exitId) {
    enterId = document.getElementById(enterId);
    exitId = document.getElementById(exitId);
    console.log(flag._flag)
    if (flag._flag === false) {
        enterId.style.display = "none";
        exitId.style.display = "flex";
    } else {
        enterId.style.display = "flex";
        exitId.style.display = "none";
    }
}

function ShowDiv(class1) {
    class1 = document.getElementById(class1);
    class1.style.display = "grid";
}

function closeDiv(class1) {
    class1 = document.getElementById(class1);
    class1.style.display = "none";
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

function CheckInput() {
    let login = document.getElementById("email").value;
    let psw = document.getElementById("psw").value;
    if (login === "creeper2005@opdopdopd.com" && psw === "1488") {
        window.location.href = "OPDOPDOPD.html";
        StartSession();
    } else {
        alert("Cука")
    }
}

function CheckInputReg() {
    let UserLogin = document.getElementById("regEmail").value;
    let UserPassword = document.getElementById("regPsw").value;
    let passwordConfirm = document.getElementById("psw-repeat").value;
    if (ConfirmPassword(UserPassword, passwordConfirm)) {
        StartSession();
        let UserData ={"login": UserLogin, "password": UserPassword}
        fetch('/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(UserData)
        })
            .then(response => {
                if (response.ok) {
                    console.log('Данные успешно отправлены на сервер');
                    closeDiv('RegWindow');
                } else {
                    console.error('Ошибка отправки данных на сервер:', response.status);
                }
            })
            .catch(error => {
                console.error('Ошибка отправки данных на сервер:', error);
            });
    } else {
        alert("Сука")
    }
}

function ConfirmPassword(psw1, psw2) {
    return psw1 === psw2;
}

function StartSession() {
    flag._flag = true;
}

function EndSession() {
    flag._flag = false;
}

function randomLogo(id1) {
    let arr = Array("smoking_rooms", "accessible_forward", "mood", "functions", "favorite",
        "school", "school", "wifi", "wifi", "code", "");
    let item = arr[Math.floor(Math.random() * arr.length)];
    console.log(item);
    document.getElementById(id1).textContent = item;
}

function heartClicker(id1, buttonId) {

    id1 = document.getElementById(id1);
    buttonId = document.getElementById(buttonId);

    function incrementCounter() {
        counter++;
        console.log(counter)
        if ((counter === 2 || counter % 3 === 0) && counter !== 3) {
            id1.style.display = "flex";
            id1.scrollIntoView({behavior: 'smooth', block: 'end'});
        } else {
            id1.style.display = "none";
        }
    }

    buttonId.addEventListener('click', incrementCounter, {once: true});

}

