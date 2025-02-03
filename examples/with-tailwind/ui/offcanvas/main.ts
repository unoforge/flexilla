import { OffCanvas} from "@flexilla/offcanvas"
import "./../../main"

OffCanvas.init("[data-slideover-from-left]",

)


new OffCanvas(
    "[data-slideover-from-top]",
)
new OffCanvas("[data-slideover-from-bottom]",
    {
        backdrop:"ui-overlay bg-gray8/50"
    }
)

new OffCanvas("[data-slideover-from-right]",
    {
    }
)
new OffCanvas("[data-offcanvas-withbackdrop]")
new OffCanvas("[data-offcanvas-backdrop-blur]")

new OffCanvas("[data-offcanvas-bodyscroll]")
new OffCanvas("[data-offcanvas-bodyscroll-overlay]",
    {
        allowBodyScroll: true
    }
)
new OffCanvas("[data-offcanvas-static-overlay]")

new OffCanvas("[data-offcanvas-static-overlay-2]",
    {
        staticBackdrop: true
    }
)