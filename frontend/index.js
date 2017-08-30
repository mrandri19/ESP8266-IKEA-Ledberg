$(document).ready(() => {
    const esp_ip = "192.168.10.109"
    const ws = new WebSocket(`ws://${esp_ip}/rpc/`)
    console.log("creating ws")
    const rpc_frame = {
        method: "LED.ChangeValue"
    }

    ws.onopen = evt => {
        console.log("ws opened", evt)
        ws.send(JSON.stringify(rpc_frame))
    }

    ws.onmessage = evt => console.log("ws got a message", JSON.parse(evt.data).result.hello)

    ws.onclose = evt => console.log("ws closed", evt)


    const slider = $('#ex1').slider().data('slider')
    slider.on('slideStop', () => console.log(`value changed: ${slider.getValue()}`))

})
