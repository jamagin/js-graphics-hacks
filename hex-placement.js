function hex_placement () {
  var canvas = document.getElementById('maincanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var radius = 10;

  // for faster collision-checking:
  // this is a 2 dimensional array, 50 x 50
  // breaking the canvas into 2500 regions
  // and within each is a list of points placed
  // in that region
  var already_placed = [];
  for (var x = 0; x < 50; x++) {
    already_placed[x] = [];
    for (var y = 0; y < 50; y++) {
      already_placed[x][y] = [];
    }
  }

  function will_collide(p) {
    var grid_x = Math.round(p[0]/50);
    var grid_y = Math.round(p[1]/50);
    // need to check around it
    var around = Math.ceil(2*radius / 50);
    for (var gx = grid_x - around; gx < grid_x + around; gx++) {
      for (var gy = grid_y - around; gy < grid_y + around; gy++) {
        for(var i = 0; i < already_placed[gx][gy].length; i++) {
          if (distance(p, already_placed[gx][gy][i]) < 2 * radius) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  function circle_at(p) {
    var grid_x = Math.round(p[0]/50);
    var grid_y = Math.round(p[1]/50);
    already_placed[grid_x][grid_y][(already_placed[grid_x][grid_y]).length] = p;
    ctx.beginPath();
    ctx.arc(p[0], p[1], radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.stroke();
  }

  function distance(p, q) {
    var dx = p[0] - q[0];
    var dy = p[1] - q[1];
    return Math.sqrt(dx*dx + dy*dy);
  }
  
  function six_nearest(p) {
    var distance = 2.25; // XXX
    var candidates = [];
    var i = 0;
    for (var theta = Math.PI/6; theta < Math.PI * 2; theta += Math.PI/3) {
      candidates[i++] = [
        p[0] + radius * distance * Math.sin(theta),
        p[1] + radius * distance * Math.cos(theta)
      ];
    }
    return candidates;
  }

  function find_alternate(p) {
    var candidates = six_nearest(p);
    var already_seen = {};

    var i = 0;
    while (i < candidates.length) {
      console.log('i ' + i);
      var cx = candidates[i][0];
      var cy = candidates[i][1];
      if (cx > radius && cx < canvas.width - radius &&
          cy > 0 && cy < canvas.height - radius &&
          !will_collide([cx, cy])) {
        console.log('match');
        return [cx, cy];
      }
      already_seen[candidates[i]] = 1;
      var nc = six_nearest(candidates[i]);
      for (var j = 0; j < nc.length; j++) {
        if (!already_seen[nc[j]]) {
          candidates[candidates.length] = nc[j];
        }
      }
      i++;
      if (i > 200) {
        console.log('oh shit');
        return false;
      }
    }
  }

  function canvas_click(p) {
    if (!will_collide(p)) {
      circle_at(p);
    } else {
      var alternate = find_alternate(p);
      if (alternate) {
        circle_at(alternate);
      }
    }
  }

  canvas.addEventListener('click', function (event) {
    var target = event.target;
    var x = event.clientX - target.offsetLeft - target.scrollLeft;   
    var y = event.clientY - target.offsetTop - target.scrollTop;
    canvas_click([x, y]);
  });
}

window.addEventListener('load', hex_placement);
