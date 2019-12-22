class Page {
	constructor(pageID,position, title) {
		this._position = position;
		this._title = title;
		this._pageID = pageID;

		//Implies that every button inside refers to this element,
		//Namely to the class instance that has the name of it's id
		pageID.dataset.coreElement = "true";
	}

	_pageID;
	_position;
	_title;
	static _openPagesCount = 0;

	start() {
		Page._openPagesCount++;

		Settings.setSettingsButton();
		this._pageID.classList.add("activatedPage");
	}
	stop() {
		Page._openPagesCount--;

		if (Page._openPagesCount == 0) {
			Settings.unsetSettingsButton();
		}

		this._pageID.classList.remove("activatedPage");
	}
	showUp() {
		this._pageID.classList.toggle(`showUp_${this._position}`);
	}
	setTitle(title) {
		//First time Type?
		console.log(`The title is ${_title}`);
	}
	getTitle() {
		return this._title;
	}
	getPageID() {
		return this._pageID;
	}

	static getClassByDOM(domElement) {
		let el = domElement;
		
		while (el != document.body) {
			if (el.dataset.coreElement) {
				return el.id;
			}

			el = el.parentElement;
		}

		throw new Error("Not found parent of this button");
	}
	static setOpenPagesCount(value) {
		Page._openPagesCount = value;
	}
	static getOpenPagesCount() {
		return Page._openPagesCount;
	}
}

class MenuPage extends Page {
	constructor(pageID, title) {
		super(pageID,"middle" ,title);
	}

	_currentState;

	get currentState() {

	}
	set currentState(state) {

	}

	start() {
		throw new Error("Can't call start on menu");
	}
	stop() {
		throw new Error("Can't call stop on menu");
	}
	showUp() {
		throw new Error("Can't call showUp on menu");
	}
}

class GamePage extends Page {
	_playerScore = 0;
	_computerScore = 0;
	_separator = 0;
	_inputType = "Buttons";

	static _currentVideo = "";
	static _videoTimerID = "";

	static _motionTest = [];
	static _motionDarkTest = [];

	playRound(choice) {
		let aiChoice = GamePage.getComputerChoice();

		if (GamePage.getWinner(choice,aiChoice)) {
			//User wins

			this._playerScore++;
		} else {
			//Computer wins
			
			this._computerScore++;
		}

		this.refreshScore();
	}
	static getComputerChoice() {
		return "paper";
	}
	static getWinner(first, second) {
		if (first > second) {
			return true;
		} else {
			false;
		}
	}
	refreshScore(reset) {
		if (reset) {
			this._computerScore = 0;
			this._playerScore = 0;
		}

		this._pageID.querySelector(".userScoreBlock").innerHTML = this._playerScore;
		this._pageID.querySelector(".computerScoreBlock").innerHTML = this._computerScore;
	}
	showUserPrediction(prediction) {
		var videoInput = this._pageID.querySelector(".videoInput");
		var gesturePrediction = videoInput.querySelector(".gesturePrediction");

		switch(prediction) {
			case "scissors":
			gesturePrediction.innerHTML = scissorsIcon;
			break;
			case "paper":
			gesturePrediction.innerHTML = paperIcon;
			break;
			case "rock":
			gesturePrediction.innerHTML = rockIcon;
			break;
			default:
			throw new Error("Unexpected parameter in showUserPrediction: " + prediction);
		}
	}
	showTimeCount(time) {
		var videoInput = this._pageID.querySelector(".videoInput");
		var videoTimeCount = videoInput.querySelector(".videoTimeCount");

		if (time > 0) {
			videoTimeCount.innerHTML = time/1000;
		} else {
			videoTimeCount.innerHTML = "";
		}
	}
	startVideo() {
		let video = this._pageID.querySelector(".videoElement");
		GamePage._currentVideo = video;

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true })
			.then(function (stream) {
				console.log("started video stream");

				video.srcObject = stream;

				GamePage._videoTimerID = setInterval(function() {
					console.log("Testing for motion");
					
					console.log(GamePage.testForMotion(300, 500, 175, 375));
					console.log(GamePage.testForDark(100, 400, 50, 325));
				}, 100);
			})
			.catch(function (error) {
				console.log(error);
			});
		}


	}
	//Don't have time, so these are gonna be really straightforward.
	static testForMotion(x1, x2, y1, y2) {
		
		
		return true;
	}
	static testForDark(x1, x2, y1, y2) {
		return true;
	}
	stopVideo() {
		let video = this._pageID.querySelector(".videoElement");

		clearInterval(GamePage._videoTimerID);
		GamePage._videoTimerID = "";
	}
	//Don't want to allow to work several of videoInputs simultaniously,
	//since it might affect the speed and quality. So the func is static, and so is the var.
	static startGuessing() {

	}
}

class Settings extends Page {
	_activated = 0;

	toggle() {
		if (!this._activated) {
			this.start();
		} else {
			this.stop();
		}

		this._activated = (this._activated + 1) % 2;
	}
	static setSettingsButton() {
		settingsButton.classList.add("activated");
	}
	static unsetSettingsButton() {
		settingsButton.classList.remove("activated");
	}
}

class HardGamePage extends GamePage {

	_model;
	//Same, but with NN instead of random
}