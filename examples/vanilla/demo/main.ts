import "./../main"
import { expandElement, initCollapsible, collapseElement } from "./../../../packages/collapsible/src/index"


const trigger = document.querySelector("[data-collapse-trigger]")

const el = document.querySelector("[data-collapsible-1]")

if (trigger instanceof HTMLElement && el instanceof HTMLElement) {
    initCollapsible(el, "close")
    trigger.addEventListener("click", () => {
        const state = el.getAttribute("data-state")
        state === "open" ? collapseElement(el) : expandElement(el)
    })
}