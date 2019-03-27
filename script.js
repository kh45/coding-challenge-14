const restart = document.querySelector('button');
const shots = document.querySelector('.shots');

//STOPWATCH
const clock = document.querySelector('.clock');
const date1 = new Date().getTime();

const stopwatch = () => {
	let date2 = new Date().getTime();
	let tyme = (date2 - date1) / 1000;
	clock.innerHTML = `TIME: ${Math.floor(tyme)}`;
}

setInterval(stopwatch, 1000);


const restartGame = () => {
	location.reload(false);
}

restart.addEventListener('click', restartGame);

const teamDivs = document.querySelectorAll(".flip-card-inner");
const teams = Array.from(teamDivs);
let lastGuess;
let numOfFaceUpCards = 0;
let matchedCards = [];
let turns = 0;
let in_progress = false;

function checkIfFirstOrSecondGuess() {
	for (let i = 0; i < teamDivs.length; i++) {
		if (teamDivs[i].classList[1] == "faceup") {
			numOfFaceUpCards++;
		}
	}
	if (numOfFaceUpCards%2 === 0) {
		numOfFaceUpCards = 0;
		return true;
	} else {
		numOfFaceUpCards = 0;
		return false;
	}
};

for (let i = 0; i < teamDivs.length; i++) {
	teamDivs[i].addEventListener('click', letsgo);
};

// Grabs all of the image names/locations AND alt attributes and puts them in an array to be shuffled later
const teamPics = teams.map(team => {
	let image = team.lastElementChild.lastElementChild.getAttribute("src");
	let alt = team.lastElementChild.lastElementChild.getAttribute("alt");
	return pair = [image, alt];
})

// From StackOverflow: The Fisher-Yates shuffle to randomize list and not repeat
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
// This part is not part of the Fisher-Yates thing, this is what is shuffling the board...setting new image and matching alt attribute to board
  for (let i = 0; i < teamDivs.length; i++){
		teamDivs[i].lastElementChild.lastElementChild.setAttribute("src", teamPics[i][0]);
		teamDivs[i].lastElementChild.lastElementChild.setAttribute("alt", teamPics[i][1]);
	}
}

// Shuffles the board the first time the page is loaded
shuffle(teamPics);

function flip(cardContainer) {
	if (in_progress == true) {
		return false;
	}
	if (cardContainer.classList[1] !== 'faceup' && in_progress == false) {
		cardContainer.style.transform = "rotatey(180deg)";
	    cardContainer.style.transitionDuration = "0.5s";
	    cardContainer.classList.toggle("faceup");
	} 
}

function flipBack(currentGuess) {
		currentGuess.parentNode.parentNode.style.transform = "rotatey(360deg)";
		currentGuess.parentNode.parentNode.classList.toggle("faceup");
		lastGuess.parentNode.parentNode.style.transform = "rotatey(360deg)";
		lastGuess.parentNode.parentNode.classList.toggle("faceup");
}


function letsgo(event) {  //Passed event as an argument because Firefox does not recognize EVENT as global
	if (event.target.nodeName == "DIV") {  //This is meant to catch a bug if the user double clicks on a card, it will stop it from flipping the entire board
		return false;
	}

	if (in_progress == true) {
		return false;
	}
	let card = event.target.parentNode.nextElementSibling.lastElementChild; // making card variable the image file of the team rather than the back generic image
	let cardContainer = card.parentNode.parentNode;
	if (checkIfFirstOrSecondGuess() === true  && in_progress == false) {
		flip(cardContainer); // flip it's container
		lastGuess = card;
	} else {
		let currentGuess = card;
		flip(cardContainer);
		in_progress = true;
		turns ++;
		shots.innerHTML = `SHOTS: ${turns}`
		if (checkForMatch(currentGuess) === false) {
			setTimeout(() => {
				flipBack(currentGuess);
			}, 1000);
			setTimeout(() => {
				in_progress = false;
			}, 1000);
		}
		setTimeout(checkForWin, 200);
	}

}

function checkForMatch(currentGuess) {
	if (currentGuess.getAttribute("alt").slice(0,-1) == lastGuess.getAttribute("alt").slice(0,-1) && currentGuess.getAttribute("alt").slice(-1) !== lastGuess.getAttribute("alt").slice(-1)) {
		in_progress = false;
		matchedCards.push(currentGuess, lastGuess);
	} else {
		return false;
	}
}

function checkForWin() {
	if (matchedCards.length == 20) {
		alert(`You win! It took you ${turns} shots on goal!`);
	}
}