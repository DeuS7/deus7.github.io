let mainMenuElement = document.getElementById("mainMenu");
let settingsElement = document.getElementById("settings");
let easyGameElement = document.getElementById("easyGame");
let hardGameElement = document.getElementById("hardGame");

let controllsElement = document.getElementById("controlls");
let simpleGameButtonElement = document.getElementById("simpleGameButton");
let settingsButtonElement = document.getElementById("settingsButton");
let hardGameButtonElement = document.getElementById("hardGameButton");

let inputRockELement = document.getElementsByClassName("inputRock");
let inputPaperELement = document.getElementsByClassName("inputPaper");
let inputScissorsELement = document.getElementsByClassName("inputScissors");
let backButtonELement = document.getElementsByClassName("backButton");
let videoOnButtonElement = document.getElementsByClassName("videoOnButton");

const paperIcon = "✋";
const rockIcon = "✊";
const scissorsIcon = "✌";

//name of class instance MUST be the same as the id of the corresponding DOM element.
//Also it has to be VAR, since only that way it's possible to reach the variable like follows: window[variable]
var mainMenu = new MenuPage(mainMenuElement, "Main Menu");
var hardGame = new HardGamePage(hardGameElement, 'right', 'Hard Game');
var easyGame = new GamePage(easyGameElement, 'left', 'Easy Game');
var settings = new Settings(settingsElement, 'top', 'Settings');


/////////////////////////////Buttons bindings

hardGameButtonElement.addEventListener('click', () => {
	hardGame.start();
})

simpleGameButtonElement.addEventListener('click', () => {
	easyGame.start();
})

settingsButtonElement.addEventListener('click', function() {
	settings.toggle();
})

settingsButtonElement.addEventListener('mouseover', () => {
	settings.showUp();
})
hardGameButtonElement.addEventListener('mouseover', () => {
	hardGame.showUp();
})
simpleGameButtonElement.addEventListener('mouseover', () => {
	easyGame.showUp();
})

settingsButtonElement.addEventListener('mouseleave', () => {
	settings.showUp();
})
hardGameButtonElement.addEventListener('mouseleave', () => {
	hardGame.showUp();
})
simpleGameButtonElement.addEventListener('mouseleave', () => {
	easyGame.showUp();
})

/////////// Play buttons

Array.prototype.forEach.call(inputRockELement, (el) =>{
	el.addEventListener('click', function() {
		window[Page.getClassByDOM(this)].playRound("rock");
	})
})
Array.prototype.forEach.call(inputPaperELement, (el) =>{
	el.addEventListener('click', function() {
		window[Page.getClassByDOM(this)].playRound("paper");
	})
})
Array.prototype.forEach.call(inputScissorsELement, (el) =>{
	el.addEventListener('click', function() {
		window[Page.getClassByDOM(this)].playRound("scissors");
	})
})


//Each button knows what class instance it belongs to, since DOM id 
//is the same as class instance's name. So stop() method is called on it.
//That allows more freedom in building the interface.
Array.prototype.forEach.call(backButtonELement, (el) =>{
	el.addEventListener('click', function() {
		window[Page.getClassByDOM(this)].stop();
	})
})
Array.prototype.forEach.call(videoOnButtonElement, (el) =>{
	el.addEventListener('click', function() {
		window[Page.getClassByDOM(this)].startVideo();
		this.classList.add("disNone");
	})
})