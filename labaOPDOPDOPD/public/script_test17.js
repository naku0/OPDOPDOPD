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
        if (userAnswers.length === answers.length) {
            compare();
        }
    }
})


function displayImages() {
    const imageContainer = document.getElementById('okno');
    var imageName = '`' + '<img src= ./images/differences/' + step + '.jpg style=" width: 1000px; height: 400px;">' + '`';
    imageContainer.innerHTML = imageName;
    counter--;
    step++;
}


function fill(n, line) {
    line.style.backgroundImage = `linear-gradient(90deg, #444444 ${100 - n
    }%, #ffffff ${100 - n}%)`;
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