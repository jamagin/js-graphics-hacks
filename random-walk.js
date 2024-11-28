import { pixel_range_to_unit_interval, hsv_to_rgb } from "./utils.js";


var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var image_data = ctx.createImageData(canvas.width, canvas.height);
var pixel_to_unit_interval = pixel_range_to_unit_interval(canvas.width * canvas.height);

// this is only going to look good for 
function do_one_frame() {
  var x = Math.floor(canvas.width / 2);
  var y = Math.floor(canvas.height / 2);
  var dir = 0;
  var accum = 0;
  function plot() {
    accum++;
    var offset = (y * canvas.width + x) * 4;
    [image_data.data[offset],
    image_data.data[offset + 1],
    image_data.data[offset + 2]] = hsv_to_rgb(pixel_to_unit_interval(accum), 1, 1);
    image_data.data[offset + 3] = 255; // alpha channel
  }
  function oob(x, y) {
    if (x < 0 || y < 0) {
      return true;
    } else if (x >= canvas.width || y >= canvas.height) {
      return true;
    }
    return false;
  }
  function next_point() {
    var dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    var [adv_x, adv_y] = dirs[dir];
    var new_x = x + adv_x;
    var new_y = y + adv_y;
    return [new_x, new_y];
  }
  function fwd() {
    var [new_x, new_y] = next_point();
    if (oob(new_x, new_y)) {
      return false;
    } else {
      x = new_x;
      y = new_y;
      plot();
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
    if (oob(new_x, new_y)) {
      dir = old_dir;
      return false;
    } else {
      x = new_x;
      y = new_y;
      plot();
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
    if (oob(new_x, new_y)) {
      dir = old_dir;
      return false;
    } else {
      x = new_x;
      y = new_y;
      plot();
      return true;
    }
  }
  while (accum < canvas.width * canvas.height) {
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
    if (result) {
      accum++;
    }
  }
  ctx.putImageData(image_data, 0, 0);
}

do_one_frame();
