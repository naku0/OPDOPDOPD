let start = document.querySelector(".start");
let startBtn = document.getElementById('start');
let option1 = document.getElementById('option1');
let option2 = document.getElementById('option2');
let option3 = document.getElementById('option3');
let option4 = document.getElementById('option4');
let line = document.getElementById('line');
let arrTEST =[];

function fill(n, line) {
    line.style.background = `linear-gradient(90deg, #dfff8d 0%, #3bcaab ${100 - n}%,  #EDF0F2 ${100 - n}%)`;
}

const questions = [
    {
        text: '1 1 2 3 5',
        options: ['8', '6', '7', '9'],
        correctButton: 1
    },
    {
        text: '3 8 15 24 35',
        options: ['45', '48', '39', '49'],
        correctButton: 2
    },
    {
        text: '7 5 8 4 9',
        options: ['7', '1', '3', '9'],
        correctButton: 3
    },
    {
        text: '1 4 9 18 35',
        options: ['48', '68', '44', '65'],
        correctButton: 2
    },
    {
        text: '99 92 86 81 77',
        options: ['74', '75', '71', '76'],
        correctButton: 1
    },
    {
        text: '1 2 6 24 120',
        options: ['235', '240', '146', '720'],
        correctButton: 4
    },
    // Потом добавить остальные вопросы
];

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0!== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
var arr = [];
for (var i = 0; i < 3; i++)
    arr.push(i);
shuffle(arr);
console.log(arr);
var indexTEST = 0;
counter = arr.length;

function displayQuestion() {
    displayQuestion.currentIndex = displayQuestion.currentIndex || 0;
    if (displayQuestion.currentIndex < arr.length) {
        var randomIndex = arr[displayQuestion.currentIndex];
        const text = questions[randomIndex];
        start.innerText = text.text;
        option1.innerText = text.options[0];
        option2.innerText = text.options[1];
        option3.innerText = text.options[2];
        option4.innerText = text.options[3];
        fill((arr.length - displayQuestion.currentIndex) * (100 / arr.length), line);
        displayQuestion.currentIndex++;
    } else {
        option1.removeEventListener('click', checkAnswer);
        option2.removeEventListener('click', checkAnswer);
        option3.removeEventListener('click', checkAnswer);
        option4.removeEventListener('click', checkAnswer);
        finishTest();
    }
}

function finishTest() {
    fill((arr.length - displayQuestion.currentIndex) * (100 / arr.length), line);
    document.querySelector(".finish").style.display = "flex";
    document.querySelector("#variants").style.display = "none";
    document.querySelector(".start").style.display = "none";
    console.log(arrTEST);
    sendData(arrTEST);
}

function checkAnswer(event) {
    const buttonId = event.target.id;
    const correctButton = questions[arr[displayQuestion.currentIndex-1]].correctButton;
    arrTEST.push(displayQuestion.currentIndex-1, correctButton, `option${correctButton}`, buttonId);
    if (buttonId === `option${correctButton}`) {
        console.log('Правильный ответ!');
    } else {
        console.log('Неправильный ответ!');
    }
    displayQuestion();
}

option1.addEventListener('click', checkAnswer);
option2.addEventListener('click', checkAnswer);
option3.addEventListener('click', checkAnswer);
option4.addEventListener('click', checkAnswer);

startBtn.addEventListener('click', ()=>{
    document.querySelector(".info").style.display = "none";
    displayQuestion();
});

function sendData(data) {
    fetch('/test16res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}