let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpansContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");


let rightAnswers = 0;
let quistionIndex = 0;
function getQuistions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let qusitionsObject = JSON.parse(this.responseText);
            let quistionsCount = qusitionsObject.length;

            createBullets(quistionsCount);

            addQusition(qusitionsObject[quistionIndex], quistionsCount);
            countdown(70, quistionsCount);
            submitButton.onclick = () => {
                let theRigthAnswer = qusitionsObject[quistionIndex].right_answer;
                quistionIndex++;

                checkAnswer(theRigthAnswer);

                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                addQusition(qusitionsObject[quistionIndex], quistionsCount);

                handelBullets();
                clearInterval(countdownInterval);
                countdown(70, quistionsCount);
                showResults(quistionsCount);
            }
        }
    };

    myRequest.open("GET", "html_questions..json", true);
    myRequest.send();
}
getQuistions();

function createBullets(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.className = `on`;
        }
        bulletsSpansContainer.appendChild(bullet);
    }

}

function addQusition(obj, count) {
    if (quistionIndex < count) {
        let quistionTitle = document.createElement("h2");
        let quistionText = document.createTextNode(obj.title);
        quistionTitle.appendChild(quistionText);
        quizArea.appendChild(quistionTitle);
        for (let i = 0; i < 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = `answer`;
            let radioInput = document.createElement("input");
            radioInput.name = `quistion`;
            radioInput.type = `radio`;
            radioInput.id = `answer_${i + 1}`;
            radioInput.dataset.answer = obj[`answer_${i + 1}`];

            if (i === 0) {
                radioInput.checked = true;
            }


            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i + 1}`;
            let theLabelText = document.createTextNode(obj[`answer_${i + 1}`]);
            theLabel.appendChild(theLabelText);
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(ranswer) {
    let answers = document.getElementsByName("quistion");
    let theChoosenAnswer;
    for (let i = 0; i < 4; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
            if (theChoosenAnswer == ranswer) {
                rightAnswers++;
            }
        }
    }
}
function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (quistionIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(count) {
    let theResults
    if (quistionIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers < count && rightAnswers > count / 2) {
            theResults = `<span class="good">Good</span>,${rightAnswers} from ${count}`;
        }
        else if (rightAnswers == count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers are right`;
        }
        else {
            theResults = `<span class="bad">Bad</span>,${rightAnswers} from ${count} `;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }

}
function countdown(duration, count) {
    if (quistionIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }


        }, 1000);
    }
}