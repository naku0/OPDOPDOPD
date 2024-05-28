const slider = document.querySelector('.slider');
const question = document.querySelectorAll('question');
const checkBtn = document.getElementById('ready');
const sliderLine = document.querySelector('.slider_line');
const btnNext = document.getElementById('next_slide');
const startBtn = document.getElementById('start');

let sliderCount = 0;
let sliderWidth = slider.offsetWidth;
let incorrectAnswers = 0;
let skipped = 0;

startBtn.addEventListener('click', function(){
    document.querySelector(".info").style.display = 'none';
    document.querySelector('#next_slide').style.display = 'flex';
});
function rollSlider(){
    sliderLine.style.transform = `translateX(${-sliderCount * sliderWidth}px)`;
}
function showQuestion(index) {
    if (index >= 0 && index < questions.length) {
        okno.innerHTML = ''; // Clear the current content
        okno.appendChild(questions[index].cloneNode(true)); // Display the current question
    }
}

function nextSlide() {
    sliderCount++;
    if (sliderCount < questions.length) {
        showQuestion(sliderCount);
    }
}

function checkAnswer(name) {
    const options = document.getElementsByName(name);
    let option_value;
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            option_value = options[i].value;
            if (option_value !== "правильный") {
                incorrectAnswers++;
            } else if (option_value === null) {
                skipped++;
            }
            break;
        }
    }
}
checkBtn.addEventListener('click', function(){
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
});
nextBtn.addEventListener('click', nextSlide);
showQuestion(sliderCount);
