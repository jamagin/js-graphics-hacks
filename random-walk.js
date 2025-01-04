import { pixel_range_to_unit_interval, hsv_to_rgb, Graphics2D } from "./utils.js";

var stride = 5;

var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var g = new Graphics2D(canvas);

var steps = 100; // canvas.width * canvas.height;
var pixel_to_unit_interval = pixel_range_to_unit_interval(steps);

function do_one_frame() {
  var current_x = Math.floor(canvas.width / 2);
  var current_y = Math.floor(canvas.height / 2);
  var dir = 0;
  var accum = 0;


  function next_point() {
    var dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    var [adv_x, adv_y] = dirs[dir];
    var new_x = current_x + stride * adv_x;
    var new_y = current_y + stride * adv_y;
    return [new_x, new_y];
  }
  function fwd() {
    var [new_x, new_y] = next_point();
    if (g.oob(new_x, new_y)) {
      return false;
    } else {
      g.plotLine(current_x, current_y, new_x, new_y, hsv_to_rgb(pixel_to_unit_interval(accum), 1, 1));
      current_x = new_x;
      current_y = new_y;
      return true;
    }
  }
  function left() {
    var old_dir = dir;
    dir--;
    if (dir < 0) {
      dir = 3;
    }
    var [new_x, new_y] = next_point();
    if (g.oob(new_x, new_y)) {
      dir = old_dir;
      return false;
    } else {
      g.plotLine(current_x, current_y, new_x, new_y, hsv_to_rgb(pixel_to_unit_interval(accum), 1, 1));
      current_x = new_x;
      current_y = new_y;
      return true;
    }
  }
  function right() {
    var old_dir = dir;
    dir++;
    if (dir > 3) {
      dir = 0;
    }
    var [new_x, new_y] = next_point();
    if (g.oob(new_x, new_y)) {
      dir = old_dir;
      return false;
    } else {
      g.plotLine(current_x, current_y, new_x, new_y, hsv_to_rgb(pixel_to_unit_interval(accum), 1, 1));
      current_x = new_x;
      current_y = new_y;
      return true;
    }
  }
  while (accum < steps) {
    var choice = Math.floor(Math.random() * 3);
    var result;
    switch (choice) {
      case 0:
        result = fwd();
        break;
      case 1:
        result = left();
        break;
      case 2:
        result = right();
        break;
    }
    // if (result) {
    accum++;
    // }
  }
  g.draw();
}

do_one_frame();
