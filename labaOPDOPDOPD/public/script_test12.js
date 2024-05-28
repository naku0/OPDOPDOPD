let startBtn = document.getElementById('start');
let table = document.getElementById('table');
let second = 0;
let milisec = 0;
let timer = false;
const secFinal = document.getElementById('sec');
const milisecFinal = document.getElementById('milisec');
let randomNumbers = [];
let pick_array = [];
let arr = [];
let results = [];
results[0] = 0;

// Генерация случайного порядка
for (let i = 25; i >= 1; i--) {
    if (i < 25) {
        randomNumbers.push([i, 'red']);
        randomNumbers.push([i, 'black']);
    } else {
        randomNumbers.push([i, 'black']);
    }
}

for (let i = 1; i <= 25; i++) {
    if (i < 25) {
        arr.push([i, 'black']);
        arr.push([25-i, 'red']);
    } else {
        arr.push([i, 'black']);
    }
}
console.log(arr);

startBtn.addEventListener('click', function () {
    document.querySelector(".info").style.display = "none";
    randomNumbers.sort(function () { return 0.5 - Math.random() });
    for (let i = 0; i < randomNumbers.length; i++) {
        let input = document.getElementById(i + 1);
        input.innerHTML = randomNumbers[i][0];
        input.style.color = randomNumbers[i][1];
    }
    timer = true;
    stopWatch();
});

table.addEventListener('click', function (event) {
    if (event.target.classList.contains('cell')) {
        pick_array.push([parseInt(event.target.innerHTML), event.target.style.color]);
        checkResults(event.target);
    }
});

function checkResults(target) {
    let isCorrect = true;
    for (let i = 0; i < pick_array.length; i++) {
        if (pick_array[i][0] !== arr[i][0] || pick_array[i][1] !== arr[i][1]) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        target.classList.add('pressed');
        // Если это последний элемент в массиве
        if (pick_array.length === arr.length) {
            finishTest();
        }
    } else {
        timer = false;
        let dataSec = document.getElementById('sec').innerHTML;
        let dataMilisec = document.getElementById('milisec').innerHTML;
        results.push(dataSec + dataMilisec);
        results[0] = pick_array.length - 1;
        document.querySelector('#table').style.display = "none";
        document.querySelector('.finish').style.display = "flex";
        document.querySelector("#okno").style.border = "solid 2px rgba(0, 0, 0, 0.2)";
        document.querySelector("#okno").style.borderRadius = "20px";
        sendData(results);
    }
}

function finishTest() {
    timer = false;
    document.querySelector('#table').style.display = "none";
    document.querySelector('.finish').style.display = "flex";
    document.querySelector("#okno").style.border = "solid 2px rgba(0, 0, 0, 0.2)";
    document.querySelector("#okno").style.borderRadius = "20px";
    let dataSec = document.getElementById('sec').innerHTML;
    let dataMilisec = document.getElementById('milisec').innerHTML;
    results.push(dataSec + dataMilisec);
    results[0] = pick_array.length;
    sendData(results);
}

function stopWatch() {
    if (timer) {
        milisec++;
        if (milisec === 100) {
            second++;
            milisec = 0;
        }
        let secString = second < 10 ? "0" + second : second;
        let milisecString = milisec < 10 ? "0" + milisec : milisec;
        secFinal.innerHTML = secString;
        milisecFinal.innerHTML = milisecString;
        setTimeout(stopWatch, 10);
    }
}
function sendData(data) {
    fetch('/test12res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
