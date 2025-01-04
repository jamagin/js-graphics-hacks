import { Graphics2D } from "./utils.js";

var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var g = new Graphics2D(canvas);
var t = 0;

function do_one_frame() {
  for (var y = 0; y < g.height; y++) {
    for (var x = 0; x < g.width; x++) {
      g.put(x, y, [
        (t - (x ^ y)) % 256,
        ((t - 128) - (x ^ y)) % 256,
        ((t - 64) - (x ^ y)) % 256,
      ])
    }
  }
  g.draw();
  t += 5;
  if (t > g.height * 2) {
    t = 0;
  }
}

var interval_id = window.setInterval(do_one_frame, 10);

