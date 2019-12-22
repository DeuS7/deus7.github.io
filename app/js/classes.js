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
	static _isGuessing = false;

	static _motionTest = 0;
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
		let self = this;
		GamePage._currentVideo = video;

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true })
			.then(function (stream) {
				video.srcObject = stream;

				GamePage._videoTimerID = setInterval(function() {
					console.log("Testing for motion");
					
					//if true, startGuessing 
					//inside it block following calls
					if (GamePage.testForDark()) {
						//Probably test less.
						self.stopVideo();
					}
					if (GamePage.testForMotion() && !GamePage._isGuessing) {
						GamePage._isGuessing = true;
						GamePage.startGuessing();
					}
				}, 1000);
			})
			.catch(function (error) {
				console.log(error);
			});
		}


	}
	//Don't have time, so these are gonna be really straightforward.
	//Saves result in static var.
	static testForMotion() {
		let video = GamePage._currentVideo;
		let currentPixelsSum = 0;

		let canvas = cropVideo(video, false, 350, 50, 100, 100);
		let ctx = canvas.getContext("2d");

		for (let x = 0;x<200;x+= 10) {
			for (let y = 0;y<200;y += 10) {
				let pixelData = ctx.getImageData(x,y,1,1).data;

				currentPixelsSum += (pixelData.reduce(function(sum, cur) {
					return sum += cur;
				}, 0));
			}
		}

		//First frame should be ignored, otherwise it'll always fire motion event.
		if (GamePage._motionTest == 0) {
			GamePage._motionTest = currentPixelsSum;
			return false;
		}

		let diff = Math.abs((GamePage._motionTest-currentPixelsSum)/currentPixelsSum*100);

		GamePage._motionTest = currentPixelsSum;

		if (diff > 1) {
			return true;
		}

		return false;
	}
	//Test if camera is covered
	static testForDark(x1, x2, y1, y2) {
		let video = GamePage._currentVideo;
		let currentPixelsAverage = 0;

		let canvas = cropVideo(video, false, 100, 100, 300, 300);
		let ctx = canvas.getContext("2d");

		let counter = 0;

		for (let x = 0;x<200;x+= 50) {
			for (let y = 0;y<200;y += 50) {
				let pixelData = ctx.getImageData(x,y,1,1).data;

				for (let i = 0;i<3;i++) {
					currentPixelsAverage += pixelData[i];
				}

				counter += 3;
			}
		}

		if (currentPixelsAverage / counter < 40) {
			return true;
		} else {
			return false;
		}
	}
	stopVideo() {
		let video = this._pageID.querySelector(".videoElement");

		clearInterval(GamePage._videoTimerID);

		GamePage._isGuessing = true;
		GamePage._videoTimerID = "";
	}
	//Don't want to allow to work several of videoInputs simultaniously,
	//since it might affect the speed and quality. So the func is static, and so is the var.
	static startGuessing() {
		console.warn("I'm guessing");

		GamePage._isGuessing = false;
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