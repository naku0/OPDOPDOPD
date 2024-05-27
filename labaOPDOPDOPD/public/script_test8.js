document.addEventListener('DOMContentLoaded', () => {
    const marker = document.getElementById('marker');
    const currentAttempt = document.getElementById('currentAttempt');
    const progress = document.getElementById('progress');
    const startButton = document.getElementById('start');
    const testDurationInput = document.getElementById('testDuration');
    const remainingTimeDisplay = document.getElementById('remainingTime');
    const averageTimeDisplay = document.getElementById('averageTime');
    const stdDeviationDisplay = document.getElementById('stdDeviation');
    let trackWidth = document.querySelector('.track').offsetWidth;
    let markerPosition = trackWidth / 2;
    let moveDirection = Math.random() < 0.5 ? -1 : 1;
    let startTime, attemptStartTime;
    let reactionTimes = [];
    let intervalId;
    let directionChangeIntervalId;
    let animationFrameId;
    let isTestRunning = false;
    let isInCenter = false;

    marker.style.left = `${markerPosition}px`;

    function moveMarker() {
        let speed = Math.random() * 2 + 1; // Random speed
        markerPosition += moveDirection * speed;

        if (markerPosition < 0) markerPosition = 0;
        if (markerPosition > trackWidth - marker.offsetWidth) markerPosition = trackWidth - marker.offsetWidth;

        marker.style.left = `${markerPosition}px`;

        animationFrameId = requestAnimationFrame(moveMarker);
    }

    function handleKeyPress(event) {
        if (event.key === 'ArrowLeft') {
            markerPosition -= 50;
        } else if (event.key === 'ArrowRight') {
            markerPosition += 50;
        }

        if (markerPosition < 0) markerPosition = 0;
        if (markerPosition > trackWidth - marker.offsetWidth) markerPosition = trackWidth - marker.offsetWidth;

        marker.style.left = `${markerPosition}px`;

        const centerPosition = trackWidth / 2;
        if (Math.abs(markerPosition - centerPosition) <= 30 && !isInCenter) {
            let elapsed = (performance.now() - attemptStartTime) / 1000;
            currentAttempt.textContent = elapsed.toFixed(2);
            reactionTimes.push(elapsed);
            attemptStartTime = performance.now(); // Start new attempt time

            isInCenter = true; // Mark that the marker is in the center
        } 
        else if (Math.abs(markerPosition - centerPosition) > 30) {
            
            isInCenter = false; // Reset the center flag if the marker leaves the center
        }

        if (isInCenter) 
        {
          
        }
        
    }

    function updateRemainingTime(endTime) {
        const now = performance.now();
        const remainingTime = Math.max(0, (endTime - now) / 1000).toFixed(1);
        remainingTimeDisplay.textContent = remainingTime;

        if (remainingTime <= 0) {
            clearInterval(intervalId);
            clearInterval(directionChangeIntervalId);
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('keydown', handleKeyPress);
            markerPosition = trackWidth / 2;
            marker.style.left = `${markerPosition}px`;
            startButton.disabled = false;
            isTestRunning = false;
            calculateAndDisplayStatistics();
            endTest(reactionTimes);
        }
    }

    function calculateAndDisplayStatistics() {
        if (reactionTimes.length > 0) {
            let sum = reactionTimes.reduce((a, b) => a + b, 0);
            let average = sum / reactionTimes.length;

            let squaredDiffs = reactionTimes.map(time => Math.pow(time - average, 2));
            let avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / reactionTimes.length;
            let stdDeviation = Math.sqrt(avgSquaredDiff);

            averageTimeDisplay.textContent = average.toFixed(2);
            stdDeviationDisplay.textContent = stdDeviation.toFixed(2);
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

        const testDuration = 120 * 1000; // регулируем сколько тест идет
        const endTime = performance.now() + testDuration;

        startTime = performance.now();
        attemptStartTime = startTime;
        reactionTimes = [];
        markerPosition = trackWidth / 2;
        marker.style.left = `${markerPosition}px`;
        moveDirection = Math.random() < 0.5 ? -1 : 1;
        isInCenter = false;

        document.addEventListener('keydown', handleKeyPress);
        animationFrameId = requestAnimationFrame(moveMarker);

        directionChangeIntervalId = setInterval(() => {
            moveDirection = Math.random() < 0.5 ? -1 : 1;
        }, 300);

        intervalId = setInterval(() => updateRemainingTime(endTime), 100);
    });
});
function endTest(data){
    sendData(data);
    document.querySelector(".controls").style.display = "none";
    document.querySelector(".track").style.display = "none";
    document.querySelector(".finish").style.display = "flex";
}

function sendData(data) {
    let UserRes={
        "name": sessionStorage.getItem('name'),
        "res": data
    }
    fetch('/tes8res', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserRes),
    });
}