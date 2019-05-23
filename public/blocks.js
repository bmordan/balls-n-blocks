function shuffle(array, result) {
    result = result || []
    const roll = Math.floor(Math.random() * (array.length - 1))
    result.push(array.splice(roll, 1)[0])
    return !array.length ? result : shuffle(array, result)
}

class Tick extends EventTarget {
    constructor() {
        super()
        this.tick = new Event("tick")
        this.tock = new Event("tock")
        setInterval(() => { this.dispatchEvent(this.tick) }, 100)
        setInterval(() => { this.dispatchEvent(this.tock) }, 2400)
    }
}

class Block {
    constructor(parent_id, type) {
        this.id = new Date().getTime().toString().substring(7,13)
        switch(type) {
            case "-":
                $(`#${parent_id}`).append(`<div id="${this.id}" class="w-10 h4 bg-navy"></div>`)
                $(`#${this.id}`).droppable({
                    accept: ".ball",
                    tolerance: "pointer",
                    over: (evt, ui) => {
                        console.log("kill", ui.draggable)
                    }
                })
                break;
            case " ":
                $(`#${parent_id}`).append(`<div id="${this.id}" class="w-10 h4"></div>`)
                break;
            default:
                return null
        }
    }
}

class Row extends Tick {
    constructor() {
        super()
        this.id = new Date().getTime().toString().substring(7,13)
        this.left = 0
        this.top = -60
        this.viewport_max = $(window).height()
        $('#playarea').append(`<div id="${this.id}" class="absolute left-0 right-0 h3 flex" style="${this.setPos()}"></div>`)
        const spaces = Math.floor(Math.random() * 3) + 1
        const blocks = 10 - spaces
        const row = new Array(spaces).fill(" ").concat(new Array(blocks).fill("-"))
        this.row = shuffle(row).map(type => new Block(this.id, type))
        this.addEventListener('tick', this.move)
        this.el = $(`#${this.id}`)
    }

    setPos () {
        return `left:${this.left}px;top:${this.top}px;`
    }

    move () {
        this.top += 10
        this.el.attr("style", this.setPos())
        this.shouldRemove()     
    }

    shouldRemove () {
        if(this.top > this.viewport_max) {
            this.el.remove()
            this.removeEventListener('tick', this.move)
        }
    }
}

class RowGenerator extends Tick {
    constructor() {
        super()
        this.addEventListener("tock", this.genRow)
    }

    genRow () {
        new Row()
    }
}

$(function () {
    new RowGenerator()
})