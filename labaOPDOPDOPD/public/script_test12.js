let startBtn = document.getElementById('start');
let table = document.getElementById('table');
let second = 0;
let milisec = 0;
let timer = false;
const secFinal = document.getElementById('sec');
const milisecFinal  = document.getElementById('milisec');
var success = 0;
let randomNumbers = [];
let pick_array = [];
let rightArray = [[25, 'red']];
results = [];
results[0] = 0;


//Генерация случайного порядка
for(let i = 25; i >= 1; i--) {
    if (i < 25){
        randomNumbers.push([i, 'red']);
        randomNumbers.push([i, 'black']);
    }else{
        randomNumbers.push([i, 'black']);
    }
}
var arr = [];
for(let i = 25; i >= 1; i--) {
    if (i < 25){
        arr.push([i, 'red']);
        arr.push([i, 'black']);
    }else{
        arr.push([i, 'black']);
    }
}
console.log(arr);


//console.log('Массив с случайным порядком элементов: ', randomNumbers);

startBtn.addEventListener('click', function(){
    document.querySelector(".info").style.display = "none";
    randomNumbers.sort(function(){ return 0.5 - Math.random()});
    for (var i = 0; i < randomNumbers.length; i++){
        input = document.getElementById(i+1);
        input.innerHTML = randomNumbers[i][0];
        if (randomNumbers[i][1] === 'red'){
            input.style.color = 'red';
        }else{
            input.style.color = 'black';
        }
    }
    timer = true;
    stopWatch();
})

table.addEventListener('click', function(){
    if (event.target.className === 'cell') {
        pick_array.push([event.target.innerHTML * 1, event.target.style.color]);
        checkResults();
    }
})

function checkResults(){
    console.log(pick_array);
    for (i = 0; i < pick_array.length; i++){
        console.log(pick_array[i][0], arr[i][0]);
        if ((pick_array[i][0] === (arr[i][0])) && (pick_array[i][1] === arr[i][1])){

        }else{
            console.log('55555', pick_array.length);
            timer = false;
            let dataSec = document.getElementById('sec').innerHTML;
            let dataMilisec = document.getElementById('milisec').innerHTML;
            results.push(dataSec + dataMilisec);
            results[0] = (pick_array.length - 1);
            console.log(results);
            document.querySelector('#table').style.display = "none";
            document.querySelector('.finish').style.display = "flex";
            document.querySelector("#okno").style.border = "solid 2px rgba(0, 0, 0, 0.2)";
            document.querySelector("#okno").style.borderRadius = "20px";
            sendData(results);
        }
    }
}



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