document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("nextQuestion");
    const questions = document.querySelectorAll(".question");
    let currentQuestionIndex = 0;
    const startBtn = document.querySelector("#start");

    questions[currentQuestionIndex].style.display = "flex";

    nextButton.addEventListener("click", function () {
        questions[currentQuestionIndex].style.display = "none";
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            questions[currentQuestionIndex].style.display = "flex";
        }
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.style.display = "none";
            readyButton.style.display = "block";
        }
    });
    startBtn.addEventListener('click', function () {
        document.querySelector('.info').style.display = "none";
        document.querySelector('#nextQuestion').style.display = "flex";
    });
});
