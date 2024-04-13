
let testBtn = document.getElementById('test');
let startBtn = document.getElementById('start');
let space  = 32;
let second = 0;
let milisec = 0;
let timer = false;
let counter = 0;
let amount =5;
let results = new Array(amount);
let audio = new Audio('пип.mp3');
function block_space(btn){
    if (btn.keyCode === '32') {
        btn.preventDefault();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function startTest(){
    audio.play();
    timer = true;
    stopWatch();
    counter ++;
    console.log("Counter = " + counter);
}

function restartTest(){
    timer = false;
    second = 0;
    milisec = 0;
}

function isSpaceKeyPressedAndCounterNotZero(event, counter) {
    return event.keyCode === 32 && counter !== 0;
}

startBtn.addEventListener('keydown', function (btn) {
    if (isSpaceKeyPressedAndCounterNotZero(btn, counter)) {
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
    if (counter === 0){
        const clr = setTimeout(startTest, getRandomInt(1, 5)*1000);
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

        document.getElementById('sec').innerHTML = secString;
        document.getElementById('milisec').innerHTML = milisecString;
        setTimeout(stopWatch, 10);
    }
}