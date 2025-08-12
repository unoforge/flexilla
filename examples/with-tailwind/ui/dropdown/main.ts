import { Dropdown } from "./../../../../packages/dropdown/src/index"
import "./../../main"

new Dropdown("[data-drop-down-1]")
new Dropdown("[data-drop-down-2]")
new Dropdown(
    "[data-drop-down-3]",
    {
        triggerStrategy: "hover"
    }
)
new Dropdown("[data-drop-down-4]")
new Dropdown("[data-drop-down-5]",
    {
        preventCloseFromInside: true
    }
)
new Dropdown("[data-drop-down-6]",
    {
        preventFromCloseOutside: true
    }
)

new Dropdown("[data-sub-demo]", {
    triggerStrategy: "hover",
    placement: "right-start"
})