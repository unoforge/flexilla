import { toggleNavbar } from "@flexilla/utilities"


toggleNavbar({
    navbarElement: "[data-app-navbar]", onToggle: ({ isExpanded }) => {
        document.body.classList[!isExpanded ? "add" : "remove"]("overflow-y-hidden")
    }
})