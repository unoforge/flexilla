import { toggleNavbar } from "@flexilla/utilities"

export const initNavbar = () => {
  toggleNavbar({ navbarElement: "[data-app-navbar]" })
}