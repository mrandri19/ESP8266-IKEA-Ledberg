async function change_color(r, g, b) {
  const res = await fetch("/rpc/LED.ChangeValue", {
    method: "POST",
    body: JSON.stringify({
      r,
      g,
      b
    })
  })
  console.log(res)
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
