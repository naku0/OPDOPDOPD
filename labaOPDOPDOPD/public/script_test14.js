let okno = document.getElementById('okno');
let start = document.querySelector('.start');
let startBtn = document.getElementById('start');
let nextBtn = document.getElementById('next');
let line = document.getElementById('line');
let image = document.querySelectorAll('image');

const questNumbers = new Map([
    ['1', '3'],
    ['2', '3'],
    ['3', '4'],
    ['4', '4'],
    ['5', '5'],
    ['6', '5'],
    ['7', '6'],
    ['8', '6'],
]);

var step = 0;
let amount = 8;
var counter = amount;
var i = 0;
var pick_array = [];
var success = 0;
var errors = 0;
var curr_array = [];

// Это функция чтобы начать тест, кнопку выносить на страницу не надо,
// только на начальную страницу с описанием теста
startBtn.addEventListener('click', function () {
    document.querySelector(".info").style.display = "none";
    document.querySelector("#nextbutton").style.display = "flex";
    step++;
    var imageQuantity = parseInt(questNumbers.get(step.toString()));
    curr_array = generateArray(imageQuantity, 1, 9);
    displayImages(imageQuantity);
})

// Функция для следующего вопроса, она нужна на странице
nextBtn.addEventListener('click', function () {
    if (step !== 9){
        console.log(step);
        fill(counter*(100/amount), line);
        checkResult();
        var imageQuantity = parseInt(questNumbers.get(step.toString()));
        curr_array = generateArray(imageQuantity, 1, 9);
        displayImages(imageQuantity);
    } else {
        fill(counter*(100/amount), line);
        checkResult();
        result(success, errors);
    }
})

const generateArray = (length, min, max) => {
    const rands = [];
    while (rands.length < length) {
        const r = Math.round(Math.random() * (max - min) + min);
        if (rands.indexOf(r) === -1) {
            rands.push(r);
        }
    } return rands;
};

// Костыльная функция, но она нужна -_-
function zaeb(id) {
    start.innerHTML = "<div id='" + id + "'></div>";
}

function displayImages(count) {
    i = 0;
    let displayedCount = 0;
    const interval = 2000;
    const imageContainer = document.querySelector('.start');
    const intervalId = setInterval(() => {
        if (displayedCount >= count) {
            clearInterval(intervalId);
            zaeb(1);
            for (let j = 1; j <= 9; j++) {
                showImage(j, './pictures/tests/' + step + '/' + j + '.png', 100, 100);
            }
            return;
        }
        imageContainer.innerHTML = '`' + '<img src= ./pictures/tests/' + step + '/' + curr_array[i] + '.png>' + '`';
        console.log(i, curr_array);
        displayedCount++;
        i++;
    }, interval);
    counter--;
    step++;
}

function showImage(id, src, width, height) {
    var img = document.createElement("img");
    img.className = 'image';
    img.id = id;
    img.src = src;
    img.width = width;
    img.height = height;
    start.append(img);
}

function checkResult() {
    var isEqual = curr_array.toString() === pick_array.toString();
    console.log(isEqual);
    if (isEqual) {
        success++;
    } else {
        errors++;
    }
    console.log(success, errors);
    pick_array = [];
}

start.addEventListener('click', function (event) {
    if (event.target.className === 'image') {
        if (event.target.classList.contains('blocked')) {
            return;
        }
        pick_array.push(event.target.getAttribute('id'));
        event.target.classList.add('pressed');
        console.log('picked:', pick_array);
    }
});

function fill(n, line) {
    line.style.background = `linear-gradient(90deg, #dfff8d 0%, #3bcaab ${100 - n}%,  #EDF0F2 ${100 - n}%)`;
}

function result(success, errors) {
    document.querySelector(".finish").style.display = "flex";
    document.querySelector(".start").style.display = "none";
    document.querySelector("#nextbutton").style.display = "none";
    var percentage = Math.round((success / amount * 100) * 100) / 100;
    var result_desc = "";
    if (percentage > 98) {
        result_desc = "Вау, у вас необыкновенная кратковременная память! Только 2% респондентов имеют такой результат."
    } else if (percentage > 80 && percentage < 99) {
        result_desc = "У вас отличная кратковременная память! Только 10% респондентов имеют такой результат."
    } else if (percentage > 65 && percentage < 81) {
        result_desc = "У вас довольно хорошая кратковременная память. Она лучше, чем примерно у 60% респондентов."
    } else if (percentage > 49 && percentage < 66) {
        result_desc = "Ваша кратковременная память находится на среднем уровне. Большинство людей имеет приблизительно такой же результат."
    } else if (percentage > 30 && percentage < 50) {
        result_desc = "Ваш уровень кратковременной памяти ниже среднего. Возможно, вам стоит проконсультироваться со специалистом, чтобы убедиться, что это не признак какого-либо заболевания."
    } else {
        result_desc = "У вас плохая кратковременная память. Мы рекомендуем вам проконсультироваться со специалистом, чтобы убедиться, что это не является признаком какого-либо заболевания."
    }
    const notificationDiv = document.createElement('div');
    notificationDiv.style.display = "flex";
    notificationDiv.style.flexDirection = "column";
    notificationDiv.style.placeContent = "center";
    notificationDiv.innerHTML = result_desc + `<br> Количество правильных ответов: ` + success + `<br> Количество ошибок: ` + errors + `<br> `;
    document.querySelector(".finish").appendChild(notificationDiv);
}
