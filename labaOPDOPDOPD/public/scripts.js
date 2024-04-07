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
let dataFlag;

function CheckFlag(enterId, exitId) {
    enterId = document.getElementById(enterId);
    exitId = document.getElementById(exitId);
    console.log(dataFlag);
    if (dataFlag === false) {
        enterId.style.display = "none";
        exitId.style.display = "flex";
    } else {
        enterId.style.display = "flex";
        exitId.style.display = "none";
    }
}

function ShowDiv(class1) {
    class1 = document.getElementById(class1);
    if (class1.style.display === "grid") {
        class1.style.display = "none";
    } else {
        class1.style.display = "grid";
    }
}

function closeDiv(class1) {
    class1 = document.getElementById(class1);
    class1.style.display = "none";
}

function ChangeDiv(id1, id2) {
    console.log("changed")
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
    const window = "enter";

    sendJSON(login, psw, window);
    if (CheckFlag) {
        StartSession();
        closeDiv('RegWindow')
    } else {
        paintEntReg();
    }
}


function CheckInputReg() {
    let UserLogin = document.getElementById("regEmail").value;
    let UserPassword = document.getElementById("regPsw").value;
    let passwordConfirm = document.getElementById("psw-repeat").value;
    const window = "registration";
    if (ConfirmPassword(UserPassword, passwordConfirm) && ConfirmLogin(UserLogin)) {
        StartSession();
        sendJSON(UserLogin, UserPassword, window);
        closeDiv('RegWindow');
    } else {
        paintRedReg()
    }
}

function sendJSON(data1, data2, window) {
    console.log(window);
    let UserData = {
        "login": data1,
        "password": data2,
        "window": window,
        "session_status": flag._flag
    }
    fetch('/endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(UserData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Ошибка отправки данных на сервер:', response.status);
            }
        })
        .then(data => {
            console.log('Данные от сервера:', data);
            dataFlag = data.status === 'success';
        })
        .catch(error => {
            console.error('Ошибка отправки данных на сервер:', error);
        });
}

function ConfirmPassword(psw1, psw2) {
    return psw1 === psw2;
}

function ConfirmLogin(login) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return pattern.test(login);
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

function changeOrder() {
    const pvkList = document.querySelector(".pvkList")
    const items = document.querySelectorAll(".item");
    const done = document.querySelector(".done");
    const initSortableList = (e) => {
        const draggingItem = pvkList.querySelector(".dragging");
        const siblings = [...pvkList.querySelectorAll(".item:not(.dragging)")];
        let nextSibling = siblings.find(sibling => {
            return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
        });
        pvkList.insertBefore(draggingItem, nextSibling);
    }
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
        });
    });
    pvkList.addEventListener("dragover", initSortableList)
    done.addEventListener("click", () => {
        saveOrderToServer()
        pvkList.removeEventListener("dragover", initSortableList)
    });
}


function saveOrderToServer() {

    const items = document.querySelectorAll(".item");
    const order = [];
    items.forEach((item, index) => {
        order.push({
            id: item.dataset.id,
            order: index + 1
        });
    });
    fetch('/pvkpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Результат сохранения:', data);
        })
        .catch((error) => {
            console.error('Ошибка:', error);
        });
}

// function sendSessionStatus(){
//     let sessionStatus = {
//         "sessionStatus": flag._flag
//     }
//     fetch('/endpoint', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(sessionStatus)
//     })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 console.error('Ошибка отправки данных на сервер:', response.status);
//             }
//         })
//         .catch((error) => {
//             console.error('Ошибка:', error);
//         });
// }

function paintRedReg() {
    const button = document.querySelector(".changer");
    const regWindow = document.querySelector(".RegWindow");
    const paragraph = document.getElementById("RegText");

    button.addEventListener("click", function () {
        regWindow.classList.remove("wrong");
    });

    if (!regWindow.classList.contains("wrong")) {
        regWindow.classList.add("wrong");
        paragraph.textContent = "Проверьте введенные вами данные";
    }
}

function paintEntReg() {
    const button = document.querySelector(".changer");
    const regWindow = document.querySelector(".RegWindow");
    const paragraph = document.getElementById("EntText");
    button.addEventListener("click", function () {
        regWindow.classList.remove("wrong");
    });
    regWindow.classList.add("wrong");
    paragraph.textContent = "Проверьте введенные данные";
}
