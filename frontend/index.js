const esp_ip = "192.168.10.111"
const ws = new WebSocket(`ws://${esp_ip}/rpc/`)
console.log("creating ws")

ws.onclose = evt => console.log("ws closed", evt)
ws.onopen = evt => console.log("ws opened", evt)

ws.onmessage = evt => {
    let data = JSON.parse(evt.data)
    console.log("ws got a message", data)
    if ("error" in data) {
        console.log("Error:", data.error.code, data.error.message)
    }
    if ("result" in data) {
        console.log("Success new value:", data.result.msg)
    }
}

const canvas = document.getElementById('picker');

// Makes the canvas always as large as its container
window.onload = window.onresize = () => {


    canvas.width = canvas.height = document.getElementById('main').clientWidth;
    const { width, height } = canvas;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height)
    const { data } = imageData

    function setPixel(data, x, y, r, g, b, a) {
        index = (x + y * imageData.width) * 4;
        data[index + 0] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = a;
    }

    function drawRGBScale(data, width, height) {
        for (let x = 0; x < width; x++) {
            const computed_b = 255 - ((x / width) * 255)
            const computed_r = ((x / width) * 255)

            for (let y = 0; y < height; y++) {
                const computed_g = (y / height) * 255
                setPixel(data, x, y, computed_r, computed_g, computed_b, 255)
            }
        }
    }

    function drawHSVScale(data, width, height) {
        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         *
         * @param   {number}  h       The hue
         * @param   {number}  s       The saturation
         * @param   {number}  l       The lightness
         * @return  {Array}           The RGB representation
         */
        function HSLtoRGB(h, s, l) {
            var r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        const luminance = .50
        for (let x = 0; x < width; x++) {
            const computed_hue = (x / width) * 360

            for (let y = 0; y < height; y++) {
                const computed_saturation = y / height
                const [computed_r, computed_g, computed_b] = HSLtoRGB(computed_hue / 360, computed_saturation, luminance)
                setPixel(data, x, y, computed_r, computed_g, computed_b, 255)
            }
        }
    }


    drawRGBScale(data, width, height)
    // drawHSVScale(data, width, height)


    ctx.putImageData(imageData, 0, 0);


}
canvas.addEventListener('click', event => {

    const ctx = canvas.getContext('2d');
    const x = event.layerX
    const y = event.layerY
    const { data: [r, g, b, a] } = ctx.getImageData(x, y, 1, 1)
    console.log("color changed:", r, g, b, "coordinates:", x, y)
    const rpc_frame = {
        method: "LED.ChangeValue",
        args: {
            r: r,
            g: g,
            b: b
        }
    }
    ws.send(JSON.stringify(rpc_frame))
    console.log("sent ws message")
})

