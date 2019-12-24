//Init settings, add functions to save and load'em.
let gameDelaySlider = document.getElementById("gameDelaySlider");
let gameDelayValue = document.getElementById("gameDelayValue");

let recognitionDelaySlider = document.getElementById("recognitionDelaySlider");
let recognitionDelayValue = document.getElementById("recognitionDelayValue");

let resetScoreButton = document.getElementById("resetScoreButton");

let buttonInput = document.getElementById("buttonInput");
let webcamInput = document.getElementById("webcamInput");

let videoInputs = document.getElementsByClassName("videoInput");
let buttonInputs = document.getElementsByClassName("buttonInput");


let gameSettings = {
	gameDelay: 3,
	recognitionDelay: 2,
	inputType: 'button'
}

gameDelaySlider.addEventListener("input", function(e) {
	gameDelayValue.innerHTML = this.value;
	gameSettings.gameDelay = this.value;
})

recognitionDelaySlider.addEventListener("input", function(e) {
	recognitionDelayValue.innerHTML = this.value;
	gameSettings.recognitionDelay = this.value;
})

resetScoreButton.addEventListener("click", function(e) {
	Page.animateNode(this, "buttonPushedAnimation");

	hardGame.refreshScore(null, true);
	easyGame.refreshScore(null, true);
})

buttonInput.addEventListener("click", function(e) {
	webcamInput.classList.remove("active");
	buttonInput.classList.add("active");

	for (let i = 0;i<buttonInputs.length;i++) {
		buttonInputs[i].classList.add("active");
		videoInputs[i].classList.remove("active");
	}

	gameSettings.inputType = "button";
})

webcamInput.addEventListener("click", function(e) {
	buttonInput.classList.remove("active");
	webcamInput.classList.add("active");

	for (let i = 0;i<buttonInputs.length;i++) {
		buttonInputs[i].classList.remove("active");
		videoInputs[i].classList.add("active");
	}

	gameSettings.inputType = "webcam";
})