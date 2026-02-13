var scoresList = document.querySelector("#scores");

function renderScores(scores){
    scoresList.innerHTML = "";
    scores.forEach(function(entry){
        var item = document.createElement("li");
        item.textContent = entry.name + " - " + entry.score;
        scoresList.appendChild(item);
    });
}

fetch("/api/scores?limit=25")
    .then(function(res){
        return res.json();
    })
    .then(function(scores){
        renderScores(scores);
    })
    .catch(function(err){
        console.error("Failed to load scores", err);
    });
