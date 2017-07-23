/*
 * This is the meme generator code.
 * The actual on-screen drawing code was from the source mentioned
 * The off-screen drawing, dynamic sizing of the context, and downloading
 * the saved image is all me.
 */
$(function () {
  var memeSize = 250;
  var onscreenMemeWidth = 250;

  var onscreenFontSize = 16;
  var onscreenLineHeight = 26;
  var canvas = document.getElementById('memecanvas');
  ctx = canvas.getContext('2d');

  var offscreenFontSize = 40;
  var offscreenLineHeight = 49;
  var offscreenMemeWidth = 600;
  var offscreenCanvas = document.createElement("canvas");
  var offscreenCtx = offscreenCanvas.getContext('2d');

  canvas.width = memeSize;

  offscreenCanvas.width = offscreenMemeWidth;

  //  Grab the nodes
  var topText = document.getElementById('top-text');
  var bottomText = document.getElementById('bottom-text');

  var drawMemeOnscreenAndOffscreen = function () {
    drawMeme(ctx, canvas, onscreenMemeWidth, onscreenFontSize, onscreenLineHeight);
    drawMeme(offscreenCtx, offscreenCanvas, 
      offscreenMemeWidth, offscreenFontSize, offscreenLineHeight);
  };
  
  topText.addEventListener('keydown', drawMemeOnscreenAndOffscreen)
  topText.addEventListener('keyup', drawMemeOnscreenAndOffscreen)
  topText.addEventListener('change', drawMemeOnscreenAndOffscreen)

  bottomText.addEventListener('keydown', drawMemeOnscreenAndOffscreen)
  bottomText.addEventListener('keyup', drawMemeOnscreenAndOffscreen)
  bottomText.addEventListener('change', drawMemeOnscreenAndOffscreen)

  var img = document.getElementById('start-image');

  //Makes the base64 uploaded image not taint the canvas
  img.setAttribute('crossOrigin', 'anonymous');

  img.addEventListener('load', drawMemeOnscreenAndOffscreen);

  drawMemeOnscreenAndOffscreen();

  function drawMeme(context, canv, memeWidth, fontSize, lineHeight) {
    if ($("#meme-builder").length === 0) {
      return;
    }

    var ratio = $(img)[0].naturalHeight / $(img)[0].naturalWidth;
    var memeHeight = ratio * memeWidth;
    canv.height = memeHeight;

    context.clearRect(0, 0, canv.width, canv.height);

    context.drawImage(img, 0, 0, memeWidth, memeHeight);

    context.lineWidth  = 4;
    context.font = fontSize + 'pt impact';
    context.strokeStyle = 'black';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    var text1 = document.getElementById('top-text').value;
    text1 = text1.toUpperCase();
    x = memeWidth / 2;
    y = 0;

    wrapText(context, text1, x, y, canv.width, lineHeight, false);

    context.textBaseline = 'bottom';
    var text2 = document.getElementById('bottom-text').value;
    text2 = text2.toUpperCase();
    y = memeHeight;

    wrapText(context, text2, x, y, canv.width, lineHeight, true);

  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, fromBottom) {

    var pushMethod = (fromBottom)?'unshift':'push';
    
    lineHeight = (fromBottom)?-lineHeight:lineHeight;

    var lines = [];
    var y = y;
    var line = '';
    var words = text.split(' ');

    for (var n = 0; n < words.length; n++) {
      var testLine = line + ' ' + words[n];
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth) {
        lines[pushMethod](line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines[pushMethod](line);

    for (var k in lines) {
      context.strokeText(lines[k], x, y + lineHeight * k);
      context.fillText(lines[k], x, y + lineHeight * k);
    }


  }

  /*
   * This along with the off-screen canvas is my own code
   */

  var getImageFromCanvas = function () {

    //TODO: Change to offscreen larger canvas
    var imgData = offscreenCanvas.toDataURL();
    console.log(offscreenCanvas.width);
    console.log(offscreenCanvas.height);
    return imgData;
  };

  window.getImageFromCanvas = getImageFromCanvas;
});