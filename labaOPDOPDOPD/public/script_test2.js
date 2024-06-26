function block_space(btn){
    if (btn.keyCode == '32') {
        btn.preventDefault();
    }
};

let startBtn = document.getElementById('start');
let line = document.getElementById('line');

let second = 0;
let milisec = 0;
let amount = 5;
let counter = amount;
let results = new Array(amount);

let audio = new Audio('./sound.mp3');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function fill(n, line) {
    line.style.background = `linear-gradient(90deg, #dfff8d 0%, #3bcaab ${100 - n}%,  #EDF0F2 ${100 - n}%)`;
}


function startTest(){
    audio.play();
    timer = true;
    stopWatch();
    counter --;
    console.log("Counter = " + counter);
}

function restartTest(){
    timer = false;
    second = 0;
    milisec = 0;
}

function isKeyPressedAndCounterNotZero(event) {
    return event.keyCode === 32;
}

function doTest(){
    if (counter > 0){
        restartTest();
        setTimeout(startTest, getRandomInt(1, 5) * 1000);
        let dataSec = document.getElementById('sec').innerHTML;
        let dataMilisec = document.getElementById('milisec').innerHTML;
        results.push(dataSec + dataMilisec);
    }
    else {
        timer = false;
        let dataSec = document.getElementById('sec').innerHTML;
        let dataMilisec = document.getElementById('milisec').innerHTML;
        results.push(dataSec + dataMilisec);
        console.log(results.filter(Boolean));
        okno.style.backgroundColor = "#EDF0F2";
        document.querySelector('.start').style.display = "none";
        document.querySelector('.finish').style.display = "flex";
        sendData(results.filter(Boolean));
    }
}

document.addEventListener('keydown', function (event){
    block_space(event);
    if (isKeyPressedAndCounterNotZero(event)){
        if (counter !== amount && timer === true){
            doTest();
            fill(counter*(100/amount), line);
        }
    }
    else{
        if (counter !== amount && timer === true){
            doTest();
            fill(counter*(100/amount), line);
            incorrectAnswer ++;
            console.log(incorrectAnswer);
        }
    }
})


startBtn.addEventListener('click', function () {
    document.querySelector(".info").style.display = "none";
    if (counter === amount) {
        setTimeout(startTest, getRandomInt(1, 5) * 1000);
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
function sendData(data) {
    let UserRes={
        "name": sessionStorage.getItem('name'),
        "res": data
    }
    fetch('/tes2res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserRes),
    });
}