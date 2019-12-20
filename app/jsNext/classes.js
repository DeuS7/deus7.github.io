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

	start() {
		this._pageID.classList.add("activated");
	}
	stop() {
		this._pageID.classList.remove("activated");
	}
	showUp() {
		console.log("Here he comes from" + _position);
	}
	setTitle(title) {
		//First time Type?
		console.log(`The title is ${_title}`);
	}
	getTitle() {
		return this._title;
	}

	static getClassByDOM(domElement) {
		let el = domElement;
		
		while (el.dataset.coreElement || el == document.body) {
			if (el.dataset.coreElement) {
				return el.id;
			}
		}

		throw new Error("Not found parent of this button");
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
	_score = 0;
	_separator = 0;
	_inputType = "Buttons";

	playRound() {
		console.log("This is the round in game");
	}
	resetState() {
		console.log("Score 0, etc");
	}
}

class Settings extends Page {

	//List of settings
}

class HardGamePage extends GamePage {

	_model;
	//Same, but with NN instead of random
}