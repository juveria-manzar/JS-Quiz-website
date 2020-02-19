const username=document.getElementById('username');
const saveScoredBtn=document.getElementById('saveScoreBtn');
const mostRecentScore=localStorage.getItem('mostRecentScore');
const finalScore=document.getElementById('finalScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES=5;

finalScore.innerText=mostRecentScore
username.addEventListener('keyup',()=>{
    saveScoredBtn.disabled=!username.value;
})


saveHighScore=e=>{
    console.log("Clicked the save button")
    e.preventDefault();

    const score={
        score:mostRecentScore,
        username:username.value
    };

    highScores.push(score);
    highScores.sort((a,b)=> b.score-a.score)
    highScores.splice(5);

    localStorage.setItem('highScores',JSON.stringify(highScores));
    window.location.assign('/')
};