const name = 'utils';

function pixel_range_to_unit_interval(n) {
    return function (x) {
        return x / n;
    }
}

// h, s, v in [0, 1]
// https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB_alternative
// but modified so that h is [0, 1] instead of [0, 360]
// and return [0, 255] for convenience
function hsv_to_rgb(h, s, v) {
    function f(n) {
        var k = (n + 4 * h) % 6;
        return 256 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1)));
    }
    return [f(5), f(3), f(1)];
}


class Graphics2D {
    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.data = this.ctx.createImageData(this.width, this.height); // blank black
    }

    put(x, y, rgb) {
        var offset = (y * this.width + x) * 4;
        [this.data.data[offset],
        this.data.data[offset + 1],
        this.data.data[offset + 2]] = rgb;
        this.data.data[offset + 3] = 255; // alpha channel
    }

    get(x, y) {
        var offset = (y * this.width + x) * 4;
        return this.data.data.slice(offset, offset + 4);
    }

    doLine(x1, y1, x2, y2, action, combiner, arg) {
        var sum = [];
        if (x1 === x2) {
            var [start, end] = [y1, y2].toSorted();
            for (var y = start; y <= end; y++) {
                sum = combiner(sum, action(x1, y, arg));
            }
        } else if (y1 === y2) {
            var [start, end] = [x1, x2].toSorted();
            for (var x = start; x <= end; x++) {
                sum = combiner(sum, action(x, y1, arg));
            }
        }
        return sum
    }

    noOp(sum, another) { }

    plotLine(x1, y1, x2, y2, rgb) {
        var put = this.put.bind(this);
        return this.doLine(x1, y1, x2, y2, put, this.noOp, rgb);
    }

    collectOp(sum, another) {
        return sum.concat(another);
    }

    checkLine(x1, y1, x2, y2) {
        var get = this.get.bind(this);
        var pixels = this.doLine(x1, y1, x2, y2, get, this.collectOp);
        return pixels.every(a => a[3] === 0); // alpha channel
    }

    oob(x, y) {
        if (x < 0 || y < 0) {
            return true;
        } else if (x >= this.width || y >= this.height) {
            return true;
        }
        return false;
    }

    draw() {
        this.ctx.putImageData(this.data, 0, 0);
    }
}
export { name, pixel_range_to_unit_interval, hsv_to_rgb, Graphics2D };
