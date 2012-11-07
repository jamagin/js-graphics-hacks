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
  
  function do_one_frame() {
    var image_data = ctx.createImageData(dim, dim);
    for (y = 0; y < dim; y++) {
      for (x = 0; x < dim; x++) {
        var v = ((x ^ y) < t) ? 255 : 0;
        image_data.data[y*dim*4 + x*4 + 0] = v;
        image_data.data[y*dim*4 + x*4 + 1] = v;
        image_data.data[y*dim*4 + x*4 + 2] = v;
        image_data.data[y*dim*4 + x*4 + 3] = 255;
      }
    }
    ctx.putImageData(image_data, 0, 0);
    t++;
  }

  var interval_id = window.setInterval(do_one_frame, 50);
}

window.onload = munch;
