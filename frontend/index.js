$(document).ready(() => {
    const esp_ip = "192.168.10.109"
    const ws = new WebSocket(`ws://${esp_ip}/rpc/`)
    console.log("creating ws")

    ws.onclose = evt => console.log("ws closed", evt)
    ws.onopen = evt => console.log("ws opened", evt)

    ws.onmessage = evt => {
        let data = JSON.parse(evt.data)
        console.log("ws got a message", data)
        if ("error" in data) {
            console.log("Error:", data.error.code, data.error.message)
            $("#result").text("Error");
        }
        if ("result" in data) {
            console.log("Success new value:", data.result.msg)
            $("#result").text("Success new value:" + data.result.msg);
        }
    }

    const slider = $('#ex1').slider().data('slider')
    slider.on('slideStop', () => {
        console.log(`value changed: ${slider.getValue()}`)
        const rpc_frame = {
            method: "LED.ChangeValue",
            args: {
                new_value: slider.getValue()
            }
        }
        ws.send(JSON.stringify(rpc_frame))
        console.log("sent ws message")
    })

})
