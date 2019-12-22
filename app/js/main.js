hardGame.start();

////////test
//Temp things
let testVideoInput = document.getElementById("testVideoInput");
let video = document.querySelector("#videoElement");


let model;
(async function () {
    model = await tf.loadLayersModel('../rps-model.json');
})();

function startGuessing() {
	let intervalID = setInterval(function() {
		doSinglePrediction(model, cropVideo(video, true)).then(function(res) {
			//Not like this! Get the var instead of writing it!
			hardGame.showUserPrediction("rock");
		})
	}, 500);

	var timeCounter = 0;
	setTimeout(function time() {
		//Some function to show it to user instead of console.log
		//Not like this!
		hardGame.showTimeCount(3000-timeCounter);

		//Settings.time 
		timeCounter += 1000;

		if (timeCounter <= 3000) {
			setTimeout(time, 1000);
		} else {
			clearInterval(intervalID);

			//playRound(doSinglePrediction)
			console.log("This is over after 3000");
		}
	}, 0);
}