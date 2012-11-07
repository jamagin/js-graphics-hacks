function munch() {
  var canvas = document.getElementById('maincanvas');
  var dim = window.innerWidth < window.innerHeight ? 
    window.innerWidth :
    window.innerHeight;
  canvas.width = dim;
  canvas.height = dim;
  var ctx = canvas.getContext('2d');
  var t = 0;
  var y = 0

  var image_data = ctx.createImageData(dim, dim);
  // setup the alpha channel
  for (i = 3; i <= dim * dim * 4; i += 4) {
    image_data.data[i] = 255;
  }

  function do_one_frame() {
    for (y = 0; y < dim; y++) {
      for (x = 0; x < dim; x++) {
        var offset = y*dim*4 + x*4;
        image_data.data[offset] = ((t - dim/2) - (x ^ y));
        image_data.data[offset + 1] = (t - (x ^ y));
        image_data.data[offset + 2] = ((t - dim) - (x ^ y));
      }
    }
    ctx.putImageData(image_data, 0, 0);
    t += 5;
    if (t > dim) {
      t = 0;
    }
  }

  var interval_id = window.setInterval(do_one_frame, 20);
}

window.addEventListener('load', munch);
