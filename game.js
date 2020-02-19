const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("scoreCounter");
const loader=document.getElementById('loader');
const game=document.getElementById('game')
// console.log(choices)

let correctQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

//fetch() returns a promise
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple").then(res =>{
  return res.json() //returning a promise
})
.then(loadedQuestions=>{
  questions=loadedQuestions.results.map(loadedQuestion=>{
    const formattedQuestion={
      question:loadedQuestion.question
    };

    const answerChoices=[...loadedQuestion.incorrect_answers];
    formattedQuestion.answer=Math.floor(Math.random()*3)+1;
    answerChoices.splice(
      formattedQuestion.answer-1,
      0,
      loadedQuestion.correct_answer
    );
    answerChoices.forEach((choice,index)=>{
      formattedQuestion['choice'+(index+1)]=choice;
    })

    return formattedQuestion;
  });
  
  startGame();
})
.catch(err=>{
  console.log(err)
})

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions]; //spread operator for copying all questions into a new array
  // console.log(availableQuestions)
  getNewQuestion();
  game.classList.remove('hidden')
  loader.classList.add('hidden')
};

getNewQuestion = () => {

  if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore',score)
    //go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  //questionCounterText.innerText=questionCounter+'/'+MAX_QUESTIONS
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question; //accessing the property question of the random var

  choices.forEach(choice => {
    const number = choice.dataset["number"]; //dataset will give the value of the data-number
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    //const classToApply='incorrect'
    // if(selectedAnswer==currentQuestion.answer){
    //   classToApply='correct'
    // }
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    selectedChoice.parentElement.classList.add(classToApply);

    if (classToApply == "correct") {
      incrementScore(CORRECT_BONUS);
    }

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};
