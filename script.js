let currentQuestionIndex = 0;
let score = 0;
const userAnswers = [];
let userName = '';
const quizContainer = document.getElementById('quiz');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-btn');
let quizData = [];

// Function to fetch questions from an API
async function fetchQuizQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10');
        const data = await response.json();
        
        // Format the questions to fit our quiz structure
        quizData = data.results.map((questionObj) => {
            const options = [...questionObj.incorrect_answers];
            const correctAnswerIndex = Math.floor(Math.random() * 4);
            options.splice(correctAnswerIndex, 0, questionObj.correct_answer);

            return {
                question: questionObj.question,
                options: {
                    A: options[0],
                    B: options[1],
                    C: options[2],
                    D: options[3]
                },
                correct: String.fromCharCode(65 + correctAnswerIndex) // 'A', 'B', 'C', 'D'
            };
        });

        loadQuestion(); // Start the quiz after fetching questions
    } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
        alert('Unable to load quiz questions. Please try again later.');
    }
}

// Load the current question
function loadQuestion() {
    if (quizData.length === 0) return;

    const currentQuestion = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <h2>${currentQuestion.question}</h2>
        <label><input type="radio" name="answer" value="A"> A) ${currentQuestion.options.A}</label>
        <label><input type="radio" name="answer" value="B"> B) ${currentQuestion.options.B}</label>
        <label><input type="radio" name="answer" value="C"> C) ${currentQuestion.options.C}</label>
        <label><input type="radio" name="answer" value="D"> D) ${currentQuestion.options.D}</label>
    `;
}

// Show the results at the end with personalized remarks
function showResults() {
    let resultHTML = `<h2>Your Results, ${userName}:</h2>`;
    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        resultHTML += `
            <p>${index + 1}. ${question.question}</p>
            <p>Your Answer: <span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${question.options[userAnswer]}</span></p>
            <p>Correct Answer: <span class="correct-answer">${question.options[question.correct]}</span></p>
            <hr>
        `;
    });

    const percentage = (score / quizData.length) * 100;
    let remarks = '';

    if (percentage >= 80) {
        remarks = "Excellent job! You really know your stuff!";
    } else if (percentage >= 60) {
        remarks = "Good work! You have a solid understanding.";
    } else if (percentage >= 40) {
        remarks = "Not bad, but you could use some more practice.";
    } else {
        remarks = "It seems like this topic might need a bit more review.";
    }

    resultHTML += `<h3>Your Score: ${score} out of ${quizData.length} (${percentage.toFixed(2)}%)</h3>`;
    resultHTML += `<h3>${remarks}</h3>`;
    resultHTML += `<h3>Thanks for taking the quiz, ${userName}!</h3>`;

    quizContainer.style.display = 'none';
    nextButton.style.display = 'none';
    resultContainer.innerHTML = resultHTML;
    resultContainer.style.display = 'block';
}

// Handle the "Next" button click
nextButton.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert("Please select an answer before proceeding.");
        return;
    }

    const answer = selectedOption.value;
    userAnswers.push(answer);

    if (answer === quizData[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Start the quiz after entering the name
startButton.addEventListener('click', () => {
    userName = document.getElementById('username').value.trim();
    if (!userName) {
        alert("Please enter your name to start the quiz.");
        return;
    }

    welcomeScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    nextButton.style.display = 'block';
    fetchQuizQuestions();
});
