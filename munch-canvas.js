import { pixel_range_to_unit_interval, hsv_to_rgb } from "./utils.js";

var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
var t = 0;
var y = 0

var pixels_total = canvas.width * canvas.height;
var pixel_to_unit_interval = pixel_range_to_unit_interval(256);
var image_data = ctx.createImageData(canvas.width, canvas.height);
// setup the alpha channel
for (var i = 3; i <= canvas.width * canvas.height * 4; i += 4) {
  image_data.data[i] = 255;
}

var pixelGen = function (x, y, t) {
  return [
    (t - (x ^ y)) % 256,
    ((t - 128) - (x ^ y)) % 256,
    ((t - 64) - (x ^ y)) % 256,
  ];
}
var [_, mode] = window.location.href.split('#');
if (mode === 'hsv') {
  pixelGen = function (x, y, t) {
    return hsv_to_rgb(pixel_to_unit_interval((t - (x ^ y)) % 256), 0.5, 0.5)
  }
}

function do_one_frame() {
  for (var y = 0; y < canvas.height; y++) {
    for (var x = 0; x < canvas.width; x++) {
      var offset = y * canvas.width * 4 + x * 4;
      [image_data.data[offset],
      image_data.data[offset + 1],
      image_data.data[offset + 2]] = pixelGen(x, y, t);
    }
  }
  ctx.putImageData(image_data, 0, 0);
  t += 5;
  if (t > canvas.height * 2) {
    t = 0;
  }
}

var interval_id = window.setInterval(do_one_frame, 10);


