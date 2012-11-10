function munch() {
  var canvas = document.getElementById('maincanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');

  var point_to_real = [];
  function set_range(x_range, y_range) {
    var per_pix_x = (x_range[1] - x_range[0]) / canvas.width;
    var per_pix_y = (y_range[1] - y_range[0]) / canvas.height;
    for (var x = 0; x < canvas.width; x++) {
      point_to_real[x] = [];
      for (var y = 0; y < canvas.height; y++) {
        point_to_real[x][y] = [x*per_pix_x + x_range[0], y*per_pix_y + y_range[0]];
      }
    }
  }


  var image_data = ctx.createImageData(canvas.width, canvas.height);
  // setup the alpha channel
  for (i = 3; i <= canvas.width * canvas.height * 4; i += 4) {
    image_data.data[i] = 255;
  }

  function do_one_frame() {
    for (screen_y = 0; screen_y < canvas.height; screen_y++) {
      for (screen_x = 0; screen_x < canvas.width; screen_x++) {
        var real_coord = point_to_real[screen_x][screen_y];
        var x = 0,
            y = 0,
            iteration = 0;
        while (x*x + y*y < 4 && iteration < 1000) {
          var xtemp = x*x - y*y + real_coord[0];
          y = 2*x*y + real_coord[1];
          x = xtemp;
          iteration++;
        }

        var offset = screen_y * canvas.width * 4 + screen_x * 4;
        iteration = iteration / 2;
        image_data.data[offset] = iteration % 256;
        image_data.data[offset + 1] = (iteration - 256) % 256;
        image_data.data[offset + 2] = (iteration - 512) % 256;
      }
    }
    ctx.putImageData(image_data, 0, 0);
  }

  var current_x_range = [-2, 1];
  var current_y_range = [-1, 1];
  set_range(current_x_range, current_y_range);
  do_one_frame();
}

window.addEventListener('load', munch);
