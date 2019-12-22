const classNames = ['Rock', 'Paper', 'Scissors'];
const imgWidth = 64;
const imgHeight = 64;
const numChannels = 3;

let videoSettings = {
  gestDet: {
    width: 200,
    height: 200
  }
}

const doSinglePrediction = async (model, img, options = {}) => {
  const resized = tf.tidy(() => {

    img = tf.browser.fromPixels(img)
    if (numChannels === 1) {
      
      const gray_mid = img.mean(2)
      img = gray_mid.expandDims(2) 
    }
    
    const alignCorners = true
    return tf.image.resizeBilinear(
      img,
      [imgWidth, imgHeight],
      alignCorners
    )
  })

  const logits = tf.tidy(() => {
    const batched = resized.reshape([
      1,
      imgWidth,
      imgHeight,
      numChannels
    ])

    
    return model.predict(batched)
  })

  const values = await logits.data()
  
  resized.dispose()
  logits.dispose()
  
  let result = {};

  for (let i = 0;i<values.length;i++) {
    result[classNames[i]] = values[i];
  }

  return result;
}

function cropVideo(video, devMode) {
  var canvas = document.createElement('canvas');

  canvas.width = videoSettings.gestDet.width;
  canvas.height = videoSettings.gestDet.height;

  //Video from webcam has intrinsic size of 640x480, instead of 500x375, that was specified.
  let widthCoeff = video.videoWidth / 500;
  let heightCoeff = video.videoHeight / 375;

  var ctx = canvas.getContext('2d');
  //Flips the pixels of the img around
  ctx.translate(videoSettings.gestDet.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, 0, 0, videoSettings.gestDet.width*widthCoeff, videoSettings.gestDet.height*heightCoeff, 0, 0, canvas.width, canvas.width);


  if (devMode) {
    if (!document.getElementById("devModeCroppedImage")) {
      let div = document.createElement("div");
      div.id = "devModeCroppedImage";

      document.body.prepend(div);
    }

    document.getElementById("devModeCroppedImage").innerHTML = "";
    document.getElementById("devModeCroppedImage").append(canvas);
  }

  return canvas;
}