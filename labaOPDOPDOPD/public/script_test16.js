let okno = document.getElementById('okno');
let startBtn = document.getElementById('start');
let option1 = document.getElementById('option1');
let option2 = document.getElementById('option2');
let option3 = document.getElementById('option3');
let option4 = document.getElementById('option4');
let line = document.getElementById('line');

function fill(n, line) {
    line.style.backgroundImage = `linear-gradient(90deg, #444444 ${
        100 - n
    }%, #ffffff ${100 - n}%)`;
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

    while (0 !== currentIndex) {
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
var index = 0;
counter = arr.length;

function displayQuestion() {
    var randomIndex = arr[index];

    if (index != arr.length) {
        const text = questions[randomIndex];

        okno.innerText = text.text;
        option1.innerText = text.options[0];
        option2.innerText = text.options[1];
        option3.innerText = text.options[2];
        option4.innerText = text.options[3];

        index++;
        counter --;
        fill((counter)*(100/(arr.length)), line);
        console.log(randomIndex, index);
    }
    return randomIndex;
}

function checkAnswer(event) {
    const buttonId = event.target.id;
    const correctButton = questions[displayQuestion.currentIndex].correctButton;
    console.log(displayQuestion.currentIndex, correctButton, `option${correctButton}`, buttonId);
    if (buttonId === `option${correctButton}`) {
        console.log('Правильный ответ!');
    } else {
        console.log('Неправильный ответ!');
    }
}

option1.addEventListener('click', checkAnswer);
option2.addEventListener('click', checkAnswer);
option3.addEventListener('click', checkAnswer);
option4.addEventListener('click', checkAnswer);

startBtn.addEventListener('click', function () {
    displayQuestion.currentIndex = displayQuestion();
})