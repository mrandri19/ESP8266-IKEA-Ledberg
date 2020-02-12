const esp_ip = "192.168.1.112"
const ws = new WebSocket(`ws://${esp_ip}/rpc/`)
console.log("creating ws")

let occupied = true

ws.onclose = evt => (occupied = true)
ws.onopen = evt => (occupied = false)

ws.onmessage = evt => {
  let data = JSON.parse(evt.data)
  if ("error" in data) {
    console.error("Error:", data.error.code, data.error.message)
  }
  if ("result" in data) {
    occupied = false
  }
}

function change_color(r, g, b) {
  if (!occupied) {
    occupied = true
    const rpc_frame = {
      method: "LED.ChangeValue",
      args: {
        r: r,
        g: g,
        b: b
      }
    }

    ws.send(JSON.stringify(rpc_frame))
  }
}

// Simple example, see optional options for more configuration.
const pickr = Pickr.create({
  el: ".color-picker",
  theme: "classic", // or 'monolith', or 'nano'

  components: {
    // Main components
    preview: true,
    showAlways: true,
    hue: true,
    inline: true,
    showAlways: true,
    interaction: {
      hex: true,
      rgba: true,
      hsla: true,
      hsva: true,
      cmyk: true,
      input: true,
      clear: true,
      save: true
    }
  }
})
pickr.show()

pickr.on("change", (color, instance) => {
  const [r, g, b, a] = color.toRGBA()
  change_color(r | 0, g | 0, b | 0)
})
