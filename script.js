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
		console.log('no!!');
		return false;
	}
	if (cardContainer.classList[1] !== 'faceup' && in_progress == false) {
		console.log('FLIP!')
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


function letsgo() {
	if (event.target.nodeName == "DIV") {  //This is meant to catch a bug if the user double clicks on a card, it will stop it from flipping the entire board
		return false;
	}

	if (in_progress == true) {
		return false;
	}
	console.log(event.target);
	let card = event.target.parentNode.nextElementSibling.lastElementChild; // making card variable the image file of the team rather than the back generic image
	let cardContainer = card.parentNode.parentNode;
	if (checkIfFirstOrSecondGuess() === true  && in_progress == false) {
		flip(cardContainer); // flip it's container
		console.log('liv')
		lastGuess = card;
	} else {
		let currentGuess = card;
		flip(cardContainer);
		console.log('bayern');
		console.log(in_progress);
		in_progress = true;
		console.log(in_progress);
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
		console.log("these match");
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

// // Say wait for flipback to finish before allowing anything else;

// stuff about promises to help with the flipback:

// https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced
// https://www.twilio.com/blog/2015/10/asyncawait-the-hero-javascript-deserved.html

// Where i got the transform from:
// https://stackoverflow.com/questions/28492791/pure-javascript-for-image-or-div-flip
// I think there is something in UDEMY about using Javascript to directly mess with HTML style tag


// CSS for the cards:

// https://www.w3schools.com/howto/howto_css_flip_card.asp

// https://blog.sessionstack.com/how-javascript-works-event-loop-and-the-rise-of-async-programming-5-ways-to-better-coding-with-2f077c4438b5

// Check if with Belnako's thing if you can see the answers by reading the HTML