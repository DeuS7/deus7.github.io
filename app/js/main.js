hardGame.start();

////////test
//Temp things
let testVideoInput = document.getElementById("testVideoInput");
let video = document.querySelector("#videoElement");


let model;
(async function () {
    model = await tf.loadLayersModel('../rps-model.json');
})();
