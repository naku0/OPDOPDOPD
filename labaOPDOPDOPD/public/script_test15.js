document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.getElementById("nextQuestion");
    const questions = document.querySelectorAll(".question");
    let currentQuestionIndex = 0;
    const startBtn = document.querySelector("#start");
    //const readyButton = document.getElementById('ready');
    let results = [];
    results[0] = 0;


    questions[currentQuestionIndex].style.display = "flex";

    function checkAnswer(name) {
        var options = document.getElementsByName(name);
        var option_value;
        for (var i = 0; i < options.length; i++) {
            if (options[i].checked) {
                option_value = options[i].value;
                if (option_value !== "правильный") {
                    results[0]++;
                    break;
                }
            } else {
                results[0]++;
                break;
            }



        }
    }

    function result() {
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
        sendData(results);
        console.log(results);
    }

    startBtn.addEventListener('click', function () {
        document.querySelector('.info').style.display = "none";
        document.querySelector('#nextQuestion').style.display = "flex";
    });

    nextButton.addEventListener("click", function () {
        questions[currentQuestionIndex].style.display = "none";
        currentQuestionIndex++;
        if (currentQuestionIndex < (questions.length)) {
            questions[currentQuestionIndex].style.display = "flex";
        }
        if (currentQuestionIndex === questions.length - 1) {
            // nextButton.style.display = "none";
            // readyButton.style.display = "block";
            nextButton.innerText = "ГОТОВО";
        }
        if (currentQuestionIndex === questions.length) {
            result();
            document.querySelector(".finish").style.display = "flex";
            document.querySelector("#nextQuestion").style.display = "none";
        }
    });

    function sendData(data) {
        console.log("aaa");
        let UserRes={
            "name": sessionStorage.getItem('name'),
            "res": data
        }
        fetch('/tes15res', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UserRes),
        });
    }
});