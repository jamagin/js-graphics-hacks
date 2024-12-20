function munch() {
  var canvas = document.getElementById('maincanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var t = 0;
  var y = 0

  var image_data = ctx.createImageData(canvas.width, canvas.height);
  // setup the alpha channel
  for (i = 3; i <= canvas.width * canvas.height * 4; i += 4) {
    image_data.data[i] = 255;
  }

  function do_one_frame() {
    for (y = 0; y < canvas.height; y++) {
      for (x = 0; x < canvas.width; x++) {
        var offset = y * canvas.width * 4 + x * 4;
        image_data.data[offset] = (t - (x ^ y)) % 256;
        image_data.data[offset + 1] = ((t - 128) - (x ^ y)) % 256;
        image_data.data[offset + 2] = ((t - 64) - (x ^ y)) % 256;
      }
    }
    ctx.putImageData(image_data, 0, 0);
    t += 5;
    if (t > canvas.height * 2) {
      t = 0;
    }
  }

  var interval_id = window.setInterval(do_one_frame, 10);
}

window.addEventListener('load', munch);
