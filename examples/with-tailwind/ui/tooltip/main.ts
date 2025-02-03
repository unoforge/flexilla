import { Tooltip } from "@flexilla/tooltip"
import "./../../main"

new Tooltip("[data-tooltip-1]")

new Tooltip("[data-tooltip-2]",
  {
    placement: "top"
  }
)


new Tooltip("[data-tooltip-3]",
  {
    placement: "left"
  }
)

new Tooltip("[data-tooltip-4]",
  {
    placement: "right"
  }
)

new Tooltip("[data-tooltip-click]")

