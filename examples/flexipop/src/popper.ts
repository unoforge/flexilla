import { CreatePopper, type Placement } from "./../../packages/flexipop/src/index"

const triggers = Array.from(document.querySelectorAll("[data-trigger-popper]")) as HTMLButtonElement[]
const popperEl = document.querySelector("[data-popper-el]")
const reference = document.querySelector("[data-reference-el]")

if (popperEl instanceof HTMLElement && reference instanceof HTMLElement) {
    let currentPosition: Placement = "bottom"
    const popper = new CreatePopper(reference, popperEl, {
        placement: currentPosition
    })
    popper.updatePosition()
    for (const trigger of triggers) {
        trigger.addEventListener("click", () => {
            const position = trigger.getAttribute("data-set-placement") as Placement
            if (position !== currentPosition) {
                popperEl.innerHTML = position
                popperEl.style.opacity = "0"
                // change placment here
                popper.setOptions({
                    placement: position
                })
                currentPosition = position
                popperEl.style.opacity = "1"
            }
        })
    }
}

const triggerDemo = document.querySelector("[data-trigger-it]") as HTMLButtonElement
const elDemo = document.querySelector("[data-popper-el-demo]") as HTMLElement

if (triggerDemo && elDemo) {
    const popper = new CreatePopper(triggerDemo, elDemo, {
        placement: "right",
        onUpdate({ placement }) {
            console.log(placement)
        }
    })
    popper.updatePosition()

}