const name = 'utils';

// import { parseWat } from "./wabt.js";

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


// maximal sequence for a 16 bit LFSR, per wikipedia
// period = 65535 = 3 * 5 * 17 * 257
// mask = binary 1101 0000 0000 1000
// function lfsr(mask = 0xd008, init_state = 0x45) {
//     const wasmModule = wabt.parseWat("lfsr.wat", fetch("lfsr.wat"));
//     const { buffer } = wasmModule.toBinary({ write_debug_names: true });
//     const module = aWait WebAssembly.compile(buffer);
//     let state_g = new WebAssembly.Global({ value: "i32", mutable: true }, init_state);
//     let mask_g = new WebAssembly.Global({ value: "i32", mutable: false }, mask);
//     let instance = aWait WebAssembly.instantiate(module, { env: { state: state_g, mask: mask_g } });
//     return instance.exports.lfsrInner;
// }


export { name, pixel_range_to_unit_interval, hsv_to_rgb };
