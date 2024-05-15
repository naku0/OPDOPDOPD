const canvas = document.querySelector("canvas");
const context = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
let startBtn = document.getElementById('start');
let space = 32;
let timer = false;
let amount = 5;
let counter = amount;
var continueAnimating = true;
let results = new Array(amount);
let pTimestamp = 0;
let angle = 0;
let radius = 150;

function fill(n, line) {
    line.style.background = `linear-gradient(90deg, #dfff8d 0%, #3bcaab ${100 - n}%,  #EDF0F2 ${100 - n}%)`;
}

//рисует круг изначально
context.beginPath();
context.arc(canvas.width / 2,canvas.height / 2, radius, -Math.PI*2, Math.PI * 2);
context.stroke();

//рисует звездочку на круге изначально
context.beginPath();
star(20, canvas.width/2, canvas.height/2 - radius, 10);
context.fillStyle = "#f8c4f3";
context.fill();
context.stroke();

//рисует точку на круге изначально
context.beginPath();
context.arc(canvas.width / 2 + radius * Math.cos(angle),
    canvas.height / 2 + radius * Math.sin(angle),
    10, 0, Math.PI * 2
);
context.fillStyle = "#94bff9";
context.fill();
context.stroke();


function tick(timestamp){
    if(!continueAnimating){
        return angle;
    }

    const diff = timestamp - pTimestamp;
    pTimestamp = timestamp;

//скорость движения кружочка
    angle += dop_Angle;

//очищение по кадрам
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#94bff9";

    context.beginPath();
    context.arc(canvas.width / 2,canvas.height / 2, radius, -Math.PI*2, Math.PI * 2);
    context.stroke();

//рисует звездочку на круге
    context.beginPath();
    star(20, canvas.width/2, canvas.height/2 - radius, 10);
    context.fillStyle = "#f8c4f3";
    context.fill();
    context.stroke();

//рисует точку
    context.beginPath();
    context.arc(canvas.width / 2 + radius * Math.cos(angle),
        canvas.height / 2 + radius * Math.sin(angle),
        10, 0, Math.PI * 2
    );
    context.fillStyle = "#94bff9";
    context.fill();
    context.stroke();

    requestAnimationFrame(tick);
}

//функция для звездочки
function star(R, cX, cY, N) {
    context.beginPath();
    context.moveTo(cX + R,cY);
    for(var i = 1; i <= N * 2; i++){
        if(i % 2 === 0){
            let theta = i * (Math.PI * 2) / (N * 2);
            var x = cX + (R * Math.cos(theta));
            var y = cY + (R * Math.sin(theta));
        }else{
            let theta = i * (Math.PI * 2) / (N * 2);
            var x = cX + ((R/2) * Math.cos(theta));
            var y = cY + ((R/2) * Math.sin(theta));
        }
        context.lineTo(x ,y);
    }
    context.closePath();
    context.stroke();
}


function block_space(btn){
    if (btn.keyCode === space) {
        btn.preventDefault();
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


// тут я устала

function checkTime(){
    speed = Math.abs((60 * dop_Angle) / (Math.PI));
    if ((canvas.height / 2 + radius * Math.sin(angle)) < canvas.height / 2){
        if (dop_Angle > 0){
            //мы идем по часовой по окружности
            if ((canvas.width / 2 + radius * Math.cos(angle)) < (canvas.width / 2)){
                length = (((Math.PI * radius) / 180) * Math.asin(1+(((canvas.height / 2 + radius * Math.sin(angle)) - canvas.height / 2)/ radius)));
            }
            else{
                length = -(((Math.PI * radius) / 180) * Math.asin(1+(((canvas.height / 2 + radius * Math.sin(angle)) - canvas.height / 2)/ radius)));
            }
        }
        else{
            //идем против часовой по окружности
            if ((canvas.width / 2 + radius * Math.cos(angle)) < (canvas.width / 2)){
                length = -(((Math.PI * radius) / 180) * Math.asin(1+(((canvas.height / 2 + radius * Math.sin(angle)) - canvas.height / 2)/ radius)));
            }
            else{
                length = (((Math.PI * radius) / 180) * Math.asin(1+(((canvas.height / 2 + radius * Math.sin(angle)) - canvas.height / 2) / radius)));
            }
        }
    }else{
        length = -(Math.PI / 4);
    }
    time = length / speed;
    return time;
    //время в секундах
}


function startTest() {
    continueAnimating = true;
    dop_Angle = Math.PI * ((getRandomInt(-50, 50)) / 1000);
    requestAnimationFrame(tick);
    timer = true;
    counter--;
    console.log("Counter = " + counter);
}


function restartTest() {
    timer = false;
    continueAnimating = false;
}


function isKeyPressedAndCounterNotZero(event){
    return event.keyCode === 32;
}


function doTest(){
    if (counter > 0){
        restartTest();
        startTest();
        //setTimeout(startTest, getRandomInt(1, 5) * 1000);
        results.push(checkTime());
        console.log(results);
    }
    else{
        continueAnimating = false;
        results.push(checkTime());
        console.log(results.filter(Boolean));
        okno.style.backgroundColor = "#EDF0F2";
        document.querySelector('.canva').style.display = "none";
        document.querySelector('.finish').style.display = "flex";
        sendData(results.filter(Boolean));
    }
}


document.addEventListener('keydown', function (event){
    block_space(event);
    if (isKeyPressedAndCounterNotZero(event)){
        if (counter !== amount && continueAnimating === true){
            doTest();
            fill(counter*(100/amount), line);
        }else{
            continueAnimating = false;
            fill(counter*(100/amount), line);
        }
    }
})


startBtn.addEventListener('click', function () {
    document.querySelector(".info").style.display = "none";
    if (counter === amount) {
        startTest();
        //setTimeout(startTest, getRandomInt(1, 5) * 1000);
    }
});

function sendData(data) {
    let UserRes={
        "name": sessionStorage.getItem('name'),
        "res": data
    }
    fetch('/tes6res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserRes),
    });
}