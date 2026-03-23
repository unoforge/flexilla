import { Dropdown } from "@flexilla/dropdown"
import "./../main"

new Dropdown("[data-drop-down-1]", {
    // reajustSize: true
})
new Dropdown("[data-drop-down-resize-demo]", {
    reajustSize: true,
    // minHeight: 140,
    // placement: "left-middle",
    // interactionLock:true
})

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