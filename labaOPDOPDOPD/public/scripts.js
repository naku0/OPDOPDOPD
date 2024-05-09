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
let dataFlag = false;

function CheckSession() {
    const checker = () => {
        const isLogined = sessionStorage.getItem('status');
        if (isLogined !== null) {
            dataFlag = isLogined === 'true';
            console.log(isLogined);
        }
        return isLogined;
    };
    window.onload = checker;
    const enterElement = document.querySelector(".startSession");
    const exitElement = document.querySelector(".endSession");
    enterElement.style.display = checker() === 'true' ? "none" : "flex";
    exitElement.style.display = checker() === 'true' ? "flex" : "none";
}

function CheckPerms() {
    const permissions = sessionStorage.getItem('permissions');
    const hiddenElement = document.querySelector(".hiddenElement");
    hiddenElement.style.display = permissions === '1' ? "flex" : "none";
}

function CheckData() {
    const name = sessionStorage.getItem('name');
    const namespace = document.querySelector('div.name');
    const SideNamespace = document.querySelector('ul.ulInfo li.name div.name');
    const avatar = sessionStorage.getItem('avatar');
    const picture = document.querySelector('.picture img')
    console.log(name, avatar);
    namespace.textContent = name;
    SideNamespace.textContent = name;
    picture.src = avatar;
}

function ShowDiv(class1) {
    class1 = document.getElementById(class1);
    if (class1.style.display === "grid") {
        class1.style.display = "none";
    } else {
        class1.style.display = "grid";
    }
}

function checkStatusForSidePanel() {
    if (sessionStorage.getItem('status') === 'true') {
        showSidePanel();
    } else {
        return;
    }
}

function showSidePanel() {
    const button = document.querySelector('.logo');
    const sidePanel = document.getElementById('sidepanel');
    const overlay = document.querySelector('.overlay');
    const avatar = document.querySelector('.avatarka img');
    const name = document.querySelector('.name');
    name.textContent = sessionStorage.getItem('name');
    avatar.src = sessionStorage.getItem('avatar');
    button.addEventListener('click', () => {
        if (sidePanel.style.display === "grid") {
            sidePanel.style.display = "none";
            overlay.classList.remove('visible');
        } else {
            sidePanel.style.display = "grid";
            overlay.classList.add('visible');
        }
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay || event.target === button) {
                sidePanel.style.display = "none";
                overlay.classList.remove('visible');
            }
        });
    });

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
    if (login.length < 100 && psw.length < 40) {
        sendJSON(login, psw, window);
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
        sendJSON(UserLogin, UserPassword, window);
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
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                console.error('Ошибка отправки данных на сервер:', res.status);
            }
        })
        .then(data => {
            console.log('Данные от сервера:', data);
            const dataFlag = data.status === 'success';
            sessionStorage.setItem('status', dataFlag.toString());
            sessionStorage.setItem('permissions', data.permissions);
            sessionStorage.setItem('name', data.username === ('' || 'user') ? data.login.split('@')[0] : data.username);
            sessionStorage.setItem('avatar', data.avatar === ('' || null) ? '/Kivisdenchyk.jpg' : data.avatar);
            console.log(sessionStorage.getItem('status'), sessionStorage.getItem('permissions'), sessionStorage.getItem('name'), sessionStorage.getItem('avatar'));
            if (dataFlag) {
                StartSession();
                closeDiv('RegWindow');
            } else {
                paintEntReg();
            }

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
    CheckSession();
}

function EndSession() {
    window.location.href = '/opdopdopd.html';
    flag._flag = false;
    dataFlag = false;
    sessionStorage.removeItem('status');
    sessionStorage.removeItem('permissions');
    sessionStorage.removeItem('name');
    console.log(sessionStorage.getItem('status'), sessionStorage.getItem('permissions'));
    CheckSession();
    CheckPerms();
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
            id: item.textContent
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

document.addEventListener('DOMContentLoaded', function () {
    addCarousel();
});

let index = 2;
function addCarousel() {
    const slides = document.querySelectorAll('.block');
    let back = document.querySelector('.prev');
    let next = document.querySelector('.next');
    showSlide(slides, 0, index);
    workCarousel(index, slides[index]);

    back.addEventListener('click', () => {
        prevSlide(slides);
        workCarousel(index, slides[index]);
    });
    next.addEventListener('click', () => {
        nextSlide(slides);
        workCarousel(index, slides[index]);
    });
}

function workCarousel(index, slide) {
    const first = document.querySelector('h1.first-block');
    const second = document.querySelector('h1.second-block');
    const third = document.querySelector('h1.third-block');
    slide.addEventListener('click', () => {
        console.log(index);
        switch (index) {
            case (0): {
                first.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log("first");
                break;
            }
            case (1): {
                second.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log("second");
                break;
            }
            case (2): {
                third.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log("third");
                break;
            }
        }
    });
}

function prevSlide(slides) {
    let newIndex = index - 1;
    if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    showSlide(slides, newIndex);
}

function nextSlide(slides) {
    let newIndex = index + 1;
    if (newIndex >= slides.length) {
        newIndex = 0;
    }
    showSlide(slides, newIndex);
}

function showSlide(slides, newIndex) {
    const currentSlide = slides[index];
    const nextSlide = slides[newIndex];
    if ((newIndex > index) || (newIndex === 0 && index === 2)) {
        currentSlide.classList.add('fade-out');
        currentSlide.classList.remove('active');
        setTimeout(() => {
            currentSlide.classList.remove('fade-out');
        }, 700);
        nextSlide.classList.add('fade-in');
        nextSlide.classList.add('active');
        setTimeout(() => {
            nextSlide.classList.remove('fade-in');
        }, 700);
    } else if ((newIndex < index) || (newIndex === 2 && index === 0)) {
        currentSlide.classList.add('current-to-right');
        currentSlide.classList.remove('active');
        setTimeout(() => {
            currentSlide.classList.remove('current-to-right');
        }, 700);
        nextSlide.classList.add('next-to-left');
        nextSlide.classList.add('active');
        setTimeout(() => {
            nextSlide.classList.remove('next-to-left');
        }, 700);
    }
    index = newIndex;
}

let dataPo = [];

function loadUsers() {
    console.log("Ща будет");
    fetch('/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных о пользователях');
            }
            return response.json();
        })
        .then(data => {
            // Обработка полученных данных
            console.log('Полученные данные о пользователях:', data);
            data.forEach(user => {
                loadAvatars(user.avatar);
                const profileMini = document.createElement('div');
                profileMini.classList.add('profileinfo-mini');
                profileMini.dataset.id = user.id;
                const pictureMini = document.createElement('div');
                pictureMini.classList.add('picture-mini');
                const img = document.createElement('img');
                img.src = user.avatar;
                pictureMini.appendChild(img);
                profileMini.appendChild(pictureMini);
                dataPo.push(user.avatar);
                const nameMini = document.createElement('a');
                nameMini.classList.add('name-mini');
                nameMini.href = '/' + user.username;
                nameMini.textContent = user.username;
                profileMini.appendChild(nameMini);
                if (user.permission === 1) {
                    const hiddenElement = document.createElement('div');
                    hiddenElement.classList.add('hiddenElement');
                    const verifiedIcon = document.createElement('i');
                    verifiedIcon.classList.add('material-symbols-outlined');
                    verifiedIcon.title = 'Квалифицированный эксперт';
                    verifiedIcon.textContent = 'verified';
                    profileMini.appendChild(hiddenElement);
                    hiddenElement.appendChild(verifiedIcon);
                }
                document.querySelector('.info').appendChild(profileMini);
            });
        })
        .catch(error => console.error('Ошибка:', error)); // Обработка ошибок
}

function loadAvatars(address) {
    console.log(dataPo);
    let UserData = {
        "avatar": address
    }
    fetch('/avatars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных о пользователях');
            } else {
                return response.json();
            }
        });
}
