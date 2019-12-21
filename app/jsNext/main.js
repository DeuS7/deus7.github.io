hardGame.start();

////////test
//Temp things
let testVideoInput = document.getElementById("testVideoInput");
let video = document.querySelector("#videoElement");

/*const model = tf.loadLayersModel('../rps-model.json').then(function(res) {
	return res;
})*/

let model;
(async function () {
    model = await tf.loadLayersModel('../rps-model.json');
})();

startVideo();

function startGuessing() {
	let intervalID = setInterval(function() {
		doSinglePrediction(model, cropVideo(video, true)).then(function(res) {
			//another function to show it to user
			console.log(res);
		})
	}, 500);

	var timeCounter = 0;
	setTimeout(function time() {
		//Some function to show it to user instead of console.log
		console.log(3000-timeCounter);

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

startGuessing();