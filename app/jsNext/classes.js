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
	static animateNode(node, newClass) {
		node.classList.remove(newClass);

		setTimeout(() => {
			node.classList.add(newClass);
		}, 50);
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

	static _mediaStreamObject = "";
	static _currentVideo = "";
	static _videoTimerID = "";
	static _isGuessing = false;
	static _gameState = "cameraOff";

	static _motionTest = 0;
	static _motionDarkTest = [];

	playRound(choice) {
		let aiChoice = GamePage.getComputerChoice();
		let foeChoiceElement = this._pageID.querySelector(".foeChoice");
		let self = this;

		//Play animation here
		GamePage.animateFoe(foeChoiceElement, 900);

		setTimeout(function() {
			switch(aiChoice) {
				case "scissors":
				foeChoiceElement.innerHTML = scissorsIcon;
				break;
				case "paper":
				foeChoiceElement.innerHTML = paperIcon;
				break;
				case "rock":
				foeChoiceElement.innerHTML = rockIcon;
				break;
				default:
				foeChoiceElement.innerHTML = "";
			}

			if (GamePage.getWinner(choice, aiChoice) > 0) {
				self._playerScore++;
				self.refreshScore("user");
				return;
			} 
			if (GamePage.getWinner(choice,aiChoice) < 0) {
				self._computerScore++;
				self.refreshScore("ai");
				return;
			} else {
				self._computerScore++;
				self._playerScore++;
				self.refreshScore("tie");
			}
		}, 900);
	}
	static getComputerChoice() {
		let random = Math.random();

		if (random < 0.33) {
			return "rock";
		} 
		if (random < 0.66) {
			return "paper";
		}
		return "scissors";
	}
	static getWinner(user, ai) {
		let obj = {
			scissors: ["paper", "rock"],
			paper: ["rock", "scissors"],
			rock: ["scissors", "paper"]
		}

		if (user == ai) {
			return 0;
		}

		if (obj[user][0] == ai) {
			return 1;
		} else {
			return -1;
		}
	}
	refreshScore(winner, reset) {
		if (reset) {
			this._computerScore = 0;
			this._playerScore = 0;
		}

		this._pageID.querySelector(".userScoreBlock").innerHTML = this._playerScore;
		this._pageID.querySelector(".computerScoreBlock").innerHTML = this._computerScore;

		if (winner == "user" || winner == "tie") {
			Page.animateNode(this._pageID.querySelector(".userScoreBlock"), "bounceAnim");
		}
		if (winner == "ai" || winner == "tie") {
			Page.animateNode(this._pageID.querySelector(".computerScoreBlock"), "bounceAnim");
		}
	}
	static animateFoe(domFoeELement, animationTime) {
		let counter = 0;
		let last = "";
		let current = "";

		setTimeout(function anim() {
			counter += 100;

			do {
				current = GamePage.getComputerChoice() + "Icon";
			} while(current == last);

			domFoeELement.innerHTML = window[current];
			last = current;

			if (counter < animationTime - 100) {
				setTimeout(anim, 100);
			}
		}, 100);
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
			gesturePrediction.innerHTML = "";
		}
	}
	showTimeCount(time) {
		var videoInput = this._pageID.querySelector(".videoInput");
		var videoTimeCount = videoInput.querySelector(".videoTimeCount");
		videoTimeCount.classList.remove('disNone');

		if (time > 0) {
			videoTimeCount.innerHTML = time;
		} else {
			videoTimeCount.innerHTML = "";
			videoTimeCount.classList.add('disNone');
		}
	}
	startVideo() {
		let video = this._pageID.querySelector(".videoElement");
		let gestureMark = this._pageID.querySelector(".gestureMark");
		let self = this;
		GamePage._currentVideo = video;

		gestureMark.classList.remove("disNone");

		GamePage._gameState = "ready";

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true })
			.then(function (stream) {
				video.srcObject = stream;
				GamePage._mediaStreamObject = stream;

				setTimeout(function() {
					if (GamePage._gameState == "cameraOff") {
						return;
					}
					//Delay game for some time, so that video stream can normalize.
					console.log("Test for motion begins now!");
					gestureMark.classList.add("active");

					GamePage._videoTimerID = setInterval(function() {
						console.log("Testing for motion");


						if (GamePage.testForDark()) {
							self.stopVideo();
						}
						if (GamePage.testForMotion() && !GamePage._isGuessing) {
							GamePage._isGuessing = true;
							gestureMark.classList.remove("active");
							self.startGuessing();
						}
					}, 1000);
				}, 3000);
			})
			.catch(function (error) {
				console.log(error);
			});
		}


	}
	//Don't have time, so these are gonna be really straightforward.
	//Saves result in static var.
	static testForMotion() {
		if (GamePage._gameState == "cameraOff") {
			return;
		}

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
		let gesturePrediction = this._pageID.querySelector(".gesturePrediction");
		let gestureMark = this._pageID.querySelector(".gestureMark");

		clearInterval(GamePage._videoTimerID);

		this.showTimeCount(-1);
		this.showUserPrediction("none");

		GamePage._motionTest = 0;

		GamePage._isGuessing = false;
		GamePage._gameState = "cameraOff";
		GamePage._videoTimerID = "";

		gestureMark.classList.remove("active");
		gestureMark.classList.add("disNone");

		

		GamePage._mediaStreamObject.getTracks()[0].stop();
		
		//Make buttons appear again
		Array.prototype.forEach.call(videoOnButtonElement, (el) =>{
			el.classList.remove("disNone");
		})
	}
	//Don't want to allow to work several of videoInputs simultaniously,
	//since it might affect the speed and quality. So the func is static, and so is the var.
	startGuessing() {
		let self = this;
		let video = GamePage._currentVideo;
		let lastPrediction = "";
		let gestureMark = this._pageID.querySelector(".gestureMark");

		if (GamePage._gameState == "cameraOff") {
			return;
		}

		GamePage._gameState = "guessing";

		let intervalID = setInterval(function() {
			if (GamePage._gameState == "cameraOff") {
				clearInterval(intervalID);
				return;
			}

			doSinglePrediction(model, cropVideo(video, false, 300, 0, 200, 200)).then(function(res) {
				if (res.Rock > res.Paper && res.Rock > res.Scissors) {
					self.showUserPrediction("rock");
					lastPrediction = "rock";
				}
				if (res.Paper > res.Rock && res.Paper > res.Scissors) {
					self.showUserPrediction("paper");
					lastPrediction = "paper";
				}
				if (res.Scissors > res.Paper && res.Scissors > res.Rock) {
					self.showUserPrediction("scissors");
					lastPrediction = "scissors";
				}
			})
		}, 100);

		var timeCounter = 0;

		setTimeout(function time() {
			if (GamePage._gameState == "cameraOff") {
				return;
			}

			self.showTimeCount(gameSettings.gameDelay-timeCounter);

			timeCounter += 1;

			if (timeCounter <= gameSettings.gameDelay) {
				setTimeout(time, 1000);
			} else {
				clearInterval(intervalID);
				
				setTimeout(function() {
					GamePage._isGuessing = false;
					gestureMark.classList.add("active");
				}, gameSettings.recognitionDelay * 1000);

				self.playRound(lastPrediction);
			}
		}, 0);
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