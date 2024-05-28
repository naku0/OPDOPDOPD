const slider = document.querySelector('.slider');
const question = document.querySelectorAll('question');
const startBtn = document.getElementById('check');
const sliderLine = document.querySelector('.slider_line');
const btnNext = document.getElementById('next_slide');

let sliderCount = 0;
let sliderWidth = slider.offsetWidth;
let incorrectAnswers = 0;
let skipped = 0;


function rollSlider(){
    sliderLine.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
}

function nextSlide(){
    sliderCount++;
    if (sliderCount < 16){
        rollSlider();
    }
}

btnNext.addEventListener('click', nextSlide);

function checkAnswer(name){
    var options = document.getElementsByName(name);
    var option_value;
    //console.log(options);
    for(var i = 0; i < options.length; i++){
        if(options[i].checked){
            option_value = options[i].value;
            //console.log(option_value);
            if (option_value !== "правильный"){
                incorrectAnswers ++;
            }else if (option_value === null){
                skipped ++;
            }
            break;

        }
    }
}
startBtn.addEventListener('click', function(){
    checkAnswer(1);
    checkAnswer(2);
    checkAnswer(3);
    checkAnswer(4);
    checkAnswer(5);
    checkAnswer(6);
    checkAnswer(7);
    checkAnswer(8);
    checkAnswer(9);
    checkAnswer(10);
    checkAnswer(11);
    checkAnswer(12);
    checkAnswer(13);
    checkAnswer(14);
    checkAnswer(15);

    console.log('fghj', incorrectAnswers, skipped);
})