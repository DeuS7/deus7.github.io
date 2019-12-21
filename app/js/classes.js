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