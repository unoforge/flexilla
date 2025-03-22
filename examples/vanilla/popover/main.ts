// import {} from "@flexilla"
import { Popover } from "@flexilla/popover"
import "./../main"

new Popover('[data-popover-content]', {
  triggerStrategy: "click",
  preventCloseFromInside: true,
  offsetDistance: 0
})
