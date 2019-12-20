let mainMenuElement = document.getElementById("mainMenu");
let settingsElement = document.getElementById("settings");
let easyGameElement = document.getElementById("easyGame");
let hardGameElement = document.getElementById("hardGame");

let simpleGameButtonElement = document.getElementById("simpleGameButton");
let settingsButtonElement = document.getElementById("settingsButton");
let hardGameButtonElement = document.getElementById("hardGameButton");

let inputRockELement = document.getElementsByClassName("inputRock");
let inputPaperELement = document.getElementsByClassName("inputPaper");
let inputScissorsELement = document.getElementsByClassName("inputScissors");
let backButtonELement = document.getElementsByClassName("backButton");

//name of class instance MUST be the same as the id of the corresponding DOM element.
let mainMenu = new MenuPage(mainMenuElement, "Main Menu");
let hardGame = new HardGamePage(hardGameElement, 'right', 'Hard Game');
let easyGame = new GamePage(easyGameElement, 'left', 'Easy Game');
let settings = new Settings(settingsElement, 'top', 'Settings');


/////////////////////////////Buttons bindings

hardGameButtonElement.addEventListener('click', () => {
	hardGame.start();
})

simpleGameButtonElement.addEventListener('click', () => {
	easyGame.start();
})

settingsButtonElement.addEventListener('click', () => {
	settings.start();
})

Array.prototype.forEach.call(backButtonELement, (el) =>{
	el.addEventListener('click', function() {
		console.log(Page.getClassByDOM(this));
	})
})