import { pixel_range_to_unit_interval, hsv_to_rgb } from "./utils.js";


var canvas = document.getElementById('maincanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

function l_system(rules_string) {
  // this one is for a hilbert curve
  var state = "A"; // the axiom
  var rules = JSON.parse(rules_string);
  console.log(rules);
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

function do_one_frame(event) {
  var x = 0;
  var y = 0;
  var max_x = 0;
  var max_y = 0;
  if (event) {
    x = event.pageX - canvas.offsetLeft;
    y = event.pageY - canvas.offsetTop;
  }
  console.log([x, y]);
  var image_data = ctx.createImageData(canvas.width, canvas.height);
  var iterations = document.getElementById("iterations").value;
  var produce = l_system(document.getElementById("rules").value);
  var moves;
  for (let i = 0; i < iterations - 1; i++) {
    moves = produce();
  }
  var moves = produce();
  var pixel_to_unit_interval = pixel_range_to_unit_interval(moves.match(/F/g).length);
  var dir = 1;
  var accum = 0;
  function plot() {
    accum++;
    max_x = Math.max(x, max_x);
    max_y = Math.max(y, max_y);
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
  canvas.width = max_x + 1;
  canvas.height = max_y + 1;
}

document.getElementById("maincanvas").onclick = do_one_frame;
do_one_frame();
