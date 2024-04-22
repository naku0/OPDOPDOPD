let testBtn = document.getElementById('okno');
let startBtn = document.getElementById('start');
let second = 0;
let milisec = 0;
let timer = false;
let counter = 0;
let amount = 10;
const secFinal = document.getElementById('sec');
const milisecFinal  = document.getElementById('milisec');
let results = new Array(amount);
let finalNumber;
let incorrectAnswer = 0;


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function startTest() {
    const firstNumber = getRandomInt(1, 100);
    const secondNumber = getRandomInt(1, 100);
    okno.innerHTML = firstNumber + ' + ' + secondNumber;
    const answer = firstNumber + secondNumber;
    finalNumber = answer;
    timer = true;
    stopWatch();
    counter++;
    console.log("Counter = " + counter);
}

function restartTest() {
    timer = false;
    second = 0;
    milisec = 0;
}


function isKeyPressedAndCounterNotZero(event, counter) {
    console.log(finalNumber);
    if (finalNumber % 2 === 0){
        //влево
        if (event.keyCode === 37 && counter !== 0){
            return true;
        }
        else{
            incorrectAnswer ++;
            console.log(incorrectAnswer);
            return true;
            //скипает вопрос при неправильном ответе
        }
        // стрелочка влево
    }
    else{
        if (event.keyCode === 39 && counter !== 0){
            return true;
        }
        else{
            incorrectAnswer ++;
            console.log(incorrectAnswer);
            return true;
        }
        // стрелочка вправо
    }
}
//переделаю функцию


startBtn.addEventListener('keydown', function (event) {
    if (isKeyPressedAndCounterNotZero(event, counter)) {
        if (counter < amount) {
            restartTest();
            const clr = setTimeout(startTest, getRandomInt(1, 5) * 1000);
            let dataSec = document.getElementById('sec').innerHTML;
            let dataMilisec = document.getElementById('milisec').innerHTML;
            results.push(dataSec + dataMilisec);
        } else {
            timer = false;
        }
    }
});

startBtn.addEventListener('click', function () {
    if (counter === 0) {
        const clr = setTimeout(startTest, getRandomInt(1, 5) * 1000);
    }
});


function stopWatch() {
    if (timer) {
        milisec++;
        if (milisec === 100) {
            second++;
            milisec = 0;
        }
        let secString = second;
        let milisecString = milisec;

        if (second < 10) {
            secString = "0" + secString;
        }
        if (milisec < 10) {
            milisecString = "0" + milisecString;
        }
        secFinal.innerHTML = secString;
        milisecFinal.innerHTML = milisecString;
        setTimeout(stopWatch, 10);
    }
}