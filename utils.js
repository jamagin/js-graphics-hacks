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

export { name, pixel_range_to_unit_interval, hsv_to_rgb };
