function munch() {
  var canvas = document.getElementById('maincanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var t = 100;

  var image_data = ctx.createImageData(canvas.width, canvas.height);
  // setup the alpha channel
  for (i = 3; i <= canvas.width * canvas.height * 4; i += 4) {
    image_data.data[i] = 255;
  }

    
  function do_one_frame() {
    for (y = 0; y < canvas.height; y++) {
      for (x = 0; x < canvas.width; x++) {
        var offset = y * canvas.width * 4 + x * 4;

          image_data.data[offset] = x % 255;
          image_data.data[offset + 1] = y % 255;

      }
    }
    ctx.putImageData(image_data, 0, 0);
    t += 5;
    if (t > canvas.height * 2) {
      t = 0;
    }
  }

  do_one_frame();
}

window.addEventListener('load', munch);