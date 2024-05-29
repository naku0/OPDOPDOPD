document.addEventListener('DOMContentLoaded', () => {
    const orangeMarker = document.getElementById('orangeMarker');
    const greenMarker = document.getElementById('greenMarker');
    const currentAttempt = document.getElementById('currentAttempt');
    const startButton = document.getElementById('start');
    const remainingTimeDisplay = document.getElementById('remainingTime');
    const averageTimeDisplay = document.getElementById('averageTime');
    const stdDeviationDisplay = document.getElementById('stdDeviation');

    const testDuration = 20 * 1000; // Устанавливаем время выполнения теста в миллисекундах (120 секунд)
    let trackWidth = document.querySelector('.track').offsetWidth;
    let orangeMarkerPosition = trackWidth / 2;
    let greenMarkerPosition = trackWidth / 2;
    let moveDirection = Math.random() < 0.5 ? -1 : 1;
    let startTime, attemptStartTime;
    let reactionTimes = [];
    let intervalId;
    let directionChangeIntervalId;
    let animationFrameId;
    let isTestRunning = false;
    let overlapStartTime = null;
    let overlappingTime = 0;
    let moveLeft = false;
    let moveRight = false;

    orangeMarker.style.left = `${orangeMarkerPosition}px`;
    greenMarker.style.left = `${greenMarkerPosition}px`;

    function moveOrangeMarker() {
        let speed = Math.random() * 2 + 1; // Random speed
        orangeMarkerPosition += moveDirection * speed;

        if (orangeMarkerPosition < 0) orangeMarkerPosition = 0;
        if (orangeMarkerPosition > trackWidth - orangeMarker.offsetWidth) orangeMarkerPosition = trackWidth - orangeMarker.offsetWidth;

        orangeMarker.style.left = `${orangeMarkerPosition}px`;

        animationFrameId = requestAnimationFrame(moveOrangeMarker);
    }

    function moveGreenMarker() {
        if (moveLeft) {
            greenMarkerPosition -= 4;
        } else if (moveRight) {
            greenMarkerPosition += 4;
        }

        if (greenMarkerPosition < 0) greenMarkerPosition = 0;
        if (greenMarkerPosition > trackWidth - greenMarker.offsetWidth) greenMarkerPosition = trackWidth - greenMarker.offsetWidth;

        greenMarker.style.left = `${greenMarkerPosition}px`;

        checkOverlap();

        requestAnimationFrame(moveGreenMarker);
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            moveLeft = true;
        } else if (event.key === 'ArrowRight') {
            moveRight = true;
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'ArrowLeft') {
            moveLeft = false;
        } else if (event.key === 'ArrowRight') {
            moveRight = false;
        }
    }

    function checkOverlap() {
        const orangeRect = orangeMarker.getBoundingClientRect();
        const greenRect = greenMarker.getBoundingClientRect();

        if (orangeRect.left < greenRect.right && orangeRect.right > greenRect.left) {
            if (overlapStartTime === null) {
                overlapStartTime = performance.now();
            }
        } else {
            if (overlapStartTime !== null) {
                let elapsed = (performance.now() - overlapStartTime) / 1000;
                overlappingTime += elapsed;
                currentAttempt.textContent = overlappingTime.toFixed(2);
                reactionTimes.push(overlappingTime);
                overlapStartTime = null;
            }
        }
    }

    function updateRemainingTime(endTime) {
        const now = performance.now();
        const remainingTime = Math.max(0, (endTime - now) / 1000).toFixed(1);
        remainingTimeDisplay.textContent = remainingTime;
        if (remainingTime <= 0) {
            endTest();
        }
    }

    function endTest() {
        clearInterval(intervalId);
        clearInterval(directionChangeIntervalId);
        cancelAnimationFrame(animationFrameId);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        orangeMarkerPosition = trackWidth / 2;
        greenMarkerPosition = trackWidth / 2;
        orangeMarker.style.left = `${orangeMarkerPosition}px`;
        greenMarker.style.left = `${greenMarkerPosition}px`;
        startButton.disabled = false;
        isTestRunning = false;
        calculateAndDisplayStatistics();
        let max = (Math.max(...reactionTimes)).toFixed(2);
        let avg = (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2);
        let res = [max, avg];
        sendData(res);
        document.querySelector(".controls").style.display = "none";
        document.querySelector(".track").style.display = "none";
        document.querySelector(".finish").style.display = "flex";
    }
    function sendData(data) {
        let UserRes = {
            "name": sessionStorage.getItem('name'),
            "res": data
        }
        console.log(data)
        console.log(UserRes)
        fetch('/tes9res', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(UserRes),
        });
    }


    function calculateAndDisplayStatistics() {
        if (reactionTimes.length > 0) {
            let sum = reactionTimes.reduce((a, b) => a + b, 0);
            let average = sum / reactionTimes.length;

            let squaredDiffs = reactionTimes.map(time => Math.pow(time - average, 2));
            let avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / reactionTimes.length;
            let stdDeviation = Math.sqrt(avgSquaredDiff);

            averageTimeDisplay.textContent = average.toFixed(2);
            // stdDeviationDisplay.textContent = stdDeviation.toFixed(2);
        } else {
            averageTimeDisplay.textContent = '0.00';
            stdDeviationDisplay.textContent = '0.00';
        }
    }

    startButton.addEventListener('click', () => {
        document.querySelector(".info").style.display = "none";
        if (isTestRunning) return;

        isTestRunning = true;
        startButton.disabled = true;

        const endTime = performance.now() + testDuration;

        startTime = performance.now();
        attemptStartTime = startTime;
        reactionTimes = [];
        orangeMarkerPosition = trackWidth / 2;
        greenMarkerPosition = trackWidth / 2;
        orangeMarker.style.left = `${orangeMarkerPosition}px`;
        greenMarker.style.left = `${greenMarkerPosition}px`;
        moveDirection = Math.random() < 0.5 ? -1 : 1;
        overlapStartTime = null;
        overlappingTime = 0;

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        requestAnimationFrame(moveGreenMarker);
        animationFrameId = requestAnimationFrame(moveOrangeMarker);

        directionChangeIntervalId = setInterval(() => {
            moveDirection = Math.random() < 0.5 ? -1 : 1;
        }, 500);

        intervalId = setInterval(() => updateRemainingTime(endTime), 100);
    });
});