function hex_placement () {
  var canvas = document.getElementById('maincanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');
  var radius = 10;
  var already_placed = []

  function circle_at(p) {
    already_placed = already_placed.concat([p]);
    console.log(already_placed);
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
    
  // this could be more efficient through
  // a better representation of already_placed
  function will_collide(p) {
    for(var i = 0; i < already_placed.length; i++) {
      if (distance(p, already_placed[i]) < 2 * radius) {
        return true;
      }
    }
    return false;
  }
  
  function six_nearest(p) {
    var distance = 2.5; // XXX
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

  function order_nearest(p, candidates) {
    return candidates.sort(function(a, b) { 
      return distance(p, a) - distance(p, b);
    });
  }

  function find_alternate(p) {
    var candidates = six_nearest(p);
    var already_seen = {};

    var i = 0;
    while (i < candidates.length) {
      var cx = candidates[i][0];
      var cy = candidates[i][1];
      if (!will_collide([cx, cy])) {
        return [cx, cy];
      }
      already_seen[candidates[i]] = 1;
      var nc = six_nearest(candidates[i]);
      for (var j = 0; j < candidates.length; j++) {
        if (!already_seen[nc[j]]) {
          candidates[candidates.length] = nc[j];
        }
      }
      i++;
      if (i > 50) {
        console.log('oh shit');
        return [0, 0];
      }
    }
  }

  function canvas_click(p) {
    if (!will_collide(p)) {
      circle_at(p);
    } else {
      circle_at(find_alternate(p));
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
