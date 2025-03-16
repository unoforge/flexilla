import { $ } from "@flexilla/utilities"
import "./../main"
import { Collapse } from "@flexilla/collapse"

const el = $("[data-collapsible-1]")

Collapse.init("[data-collapsible-1]")
if (el) {
    el.addEventListener("aftershow", () => {
        console.log("Collapse shown")
    });

    el.addEventListener("beforeshow", () => {
        console.log("Collapse before shown")
    });
}


new Collapse("[data-collapsible-4]")


new Collapse("[data-collapsible-5]")


