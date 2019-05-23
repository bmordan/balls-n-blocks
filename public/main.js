$(function () {
    const session = $('#playarea').data('session')
    const ws = new WebSocket(`ws://localhost:3000/socket/${session}`)
    let color

    const onDrag = (evt, ui) => {
        const {left, top} = ui.position
        const msg = [session, color, left, top].join("|")
        ws.send(msg)
    }

    ws.onmessage = (msg) => {
        if (!color) {
            color = msg.data
            $(`#${session}`)
              .addClass(color)
              .draggable({ drag: onDrag })
        } else {
            const [_session, color, left, top] = msg.data.split("|")
            const inDom = $(`#${_session}`).size()

            if (inDom) {
                $(`#${_session}`).attr("style", `left:${left}px;top:${top}px;`)
            } else {
                const ball = `<div id="${_session}" class="ball absolute h3 w3 br-100 ${color}" style="left:${left}px;top:${top}px;"></div>`
                $('#playarea').append(ball)
            }
        }
    }
})