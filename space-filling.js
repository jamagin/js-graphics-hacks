import { pixel_range_to_unit_interval, hsv_to_rgb } from "./utils.js";


var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var image_data = ctx.createImageData(canvas.width, canvas.height);
var pixel_to_unit_interval = pixel_range_to_unit_interval(canvas.width);

function do_one_frame() {
  for (var y = 0; y < image_data.height; y++) {
    for (var x = 0; x < image_data.width; x++) {
      var offset = y * image_data.width * 4 + x * 4;
      [image_data.data[offset],
      image_data.data[offset + 1],
      image_data.data[offset + 2]] = hsv_to_rgb(pixel_to_unit_interval(x), 1, 1);
      image_data.data[offset + 3] = 255; // alpha channel

    }
  }
  ctx.putImageData(image_data, 0, 0);
}

do_one_frame();
