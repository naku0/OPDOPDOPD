let okno = document.getElementById('okno');
let startBtn = document.getElementById('start');
let nextBtn = document.getElementById('next');
let line = document.getElementById('line');
let answers = [5, 4, 5, 7, 4];
let userAnswers = [];

var step = 0;
let amount = 5;
var counter = amount;
var i = 0;
var success = 0;
var errors = 0;

// это функция чтобы начать тест, кнопку выносить на страницу не надо,
//только на начальную страницу с описанием теста

startBtn.addEventListener('click', function () {
    document.querySelector('.info').style.display = 'none';
    step++;
    displayImages();
})

// функция для следующего вопроса, она нужна на странице
nextBtn.addEventListener('click', function () {
    if (step < 6) {
        console.log(step);
        fill(counter * (100 / amount), line);
        checkResult();
        console.log(userAnswers);
        document.getElementById('answer').value = "";
        displayImages();
    } else if (step === 6) {
        fill(counter * (100 / amount), line);
        checkResult();
        console.log(errors, success);
        document.querySelector(".start").style.display = "none";
        document.querySelector(".finish").style.display = "flex";
        document.querySelector("#answer").style.display = "none";
        document.querySelector("#next").style.display = "none";
        let res = [errors, success];
        sendData(res);

        if (userAnswers.length === answers.length) {
            compare();
        }
    }
})


function displayImages() {
    const imageContainer = document.querySelector('.start');
    imageContainer.innerHTML = '`' + '<img src= ./pictures/tests/differences/' + step + '.jpg>' + '`';
    counter--;
    step++;
}


function fill(n, line) {
    line.style.background = `linear-gradient(90deg, #dfff8d 0%, #3bcaab ${100 - n}%,  #EDF0F2 ${100 - n}%)`;
}

function checkResult() {
    input = document.getElementById('answer');
    value = input.value;
    userAnswers[i] = value * 1;
    i++;

}
function compare() {
    for (var i = 0; i < answers.length; i++) {
        if (answers[i] !== userAnswers[i] && userAnswers[i] !== 0) {
            errors++;
        }else {
            success++;
        }
    }
    console.log(errors, success);
}
function sendData(data) {
    console.log("aaa");
    let UserRes={
        "name": sessionStorage.getItem('name'),
        "res": data
    }
    fetch('/tes17res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(UserRes)
    });
}