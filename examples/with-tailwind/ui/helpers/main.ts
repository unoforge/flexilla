
import { toggleNavbar } from "@flexilla/utilities/toggler"
import { $ } from "@flexilla/utilities/selector"
import "./../main"

const navbar = $("[data-app-navbar]")
if (navbar instanceof HTMLElement) {
    toggleNavbar({
        navbarElement: navbar,
        allowBoyScroll: false
    })
}
