let testBtn = document.getElementById('okno');
let startBtn = document.getElementById('start');
let second = 0;
let milisec = 0;
let timer = false;
let amount = 5;
let counter = amount;
const secFinal = document.getElementById('sec');
const milisecFinal  = document.getElementById('milisec');
let results = [];
results[0] = 0;

function block_space(btn){
    if (btn.keyCode === '32') {
        btn.preventDefault();
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function fill(n, line) {
    line.style.background = `linear-gradient(90deg, #dfff8d 0%, #3bcaab ${100 - n}%,  #EDF0F2 ${100 - n}%)`;
}

function startTest() {
    const colour = getRandomInt(1, 4);
    if (colour === 1){
        testBtn.style.backgroundColor = 'pink';
    }
    else if (colour === 2){
        testBtn.style.backgroundColor = "blue";
    }
    else{
        testBtn.style.backgroundColor = "green";
    }
    //"#95c29f"
    //#94bff9
    timer = true;
    stopWatch();
    counter --;
    console.log("Counter = " + counter);
}

function restartTest() {
    timer = false;
    second = 0;
    milisec = 0;
    testBtn.style.backgroundColor = "#EDF0F2";
}

function isKeyPressedAndCounterNotZero(event) {
    if (testBtn.style.backgroundColor === 'pink'){
        return event.keyCode === 51;
    }
    else if (testBtn.style.backgroundColor === 'blue'){
        return event.keyCode === 49;
    }
    else{
        return event.keyCode === 50;
    }
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
        okno.style.backgroundColor = "#EDF0F2";
        document.querySelector('.finish').style.display = "flex";
        sendData(results);
    }

}

document.addEventListener('keydown', function (event){
    block_space(event);
    if (isKeyPressedAndCounterNotZero(event)){
        if (counter !== amount && timer === true){
            doTest();
            fill(counter*(100/amount), line);
            console.log(results);
            console.log(testBtn.style.backgroundColor);
        }
    }
    else{
        if (counter !== amount && timer === true){
            doTest();
            fill(counter*(100/amount), line);
            results[0]++;
            console.log(results);
            console.log(testBtn.style.backgroundColor);
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
        secFinal.innerHTML = secString;
        milisecFinal.innerHTML = milisecString;
        setTimeout(stopWatch, 10);
    }
}
function sendData(data) {
    let UserRes={
        "name": sessionStorage.getItem('name'),
        "res": data
    }
    fetch('/tes3res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserRes),
    });
}