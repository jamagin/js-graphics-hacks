import { pixel_range_to_unit_interval, hsv_to_rgb } from "./utils.js";


var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var image_data = ctx.createImageData(canvas.width, canvas.height);

function l_system() {
  // this one is for a hilbert curve
  var state = "A"; // the axiom
  var rules = {
    "A": "+BF-AFA-FB+",
    "B": "-AF+BFB+FA-",
  };
  return function () {
    var output = "";
    for (let i = 0; i < state.length; i++) {
      let production = rules[state[i]];
      if (typeof production !== 'undefined') {
        output += production;
      } else {
        output += state[i];
      }
    }
    state = output;
    return output;
  }
}

function do_one_frame() {
  var produce = l_system();
  var moves;
  for (let i = 0; i < 9; i++) {
    moves = produce();
  }
  var moves = produce();
  var pixel_to_unit_interval = pixel_range_to_unit_interval(moves.match(/F/g).length);
  var x = 0;
  var y = 0;
  var dir = 1;
  var accum = 0;
  function plot() {
    accum++;
    var offset = (y * canvas.width + x) * 4;
    [image_data.data[offset],
    image_data.data[offset + 1],
    image_data.data[offset + 2]] = hsv_to_rgb(pixel_to_unit_interval(accum), 1, 1);
    image_data.data[offset + 3] = 255; // alpha channel
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
    x = new_x;
    y = new_y;
    plot();
  }

  function left() {
    var old_dir = dir;
    dir--;
    if (dir < 0) {
      dir = 3;
    }
  }
  function right() {
    var old_dir = dir;
    dir++;
    if (dir > 3) {
      dir = 0;
    }
  }
  for (let i = 0; i < moves.length; i++) {
    switch (moves[i]) {
      case "F":
        fwd();
        break;
      case "+":
        left();
        break;
      case "-":
        right();
        break;
    }
  }
  ctx.putImageData(image_data, 0, 0);
}

do_one_frame();