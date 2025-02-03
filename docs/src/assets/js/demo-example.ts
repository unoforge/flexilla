import { Dropdown, Tooltip, Modal, Dismissible, Popover } from "@flexilla/flexilla";
import { $$ } from "@flexilla/utilities";



export const initDemoScrip = () => {
    Dropdown.autoInit("[data-fx-dropdown]")
    Popover.autoInit("[data-fx-popover]")

    const tooltipsEls = $$("[data-demo-tooltip]")
    for (const tooltip of tooltipsEls) {
        new Tooltip(tooltip, { placement: "bottom-middle" });
    }

    Modal.init("[data-modal-invite]");
    Dismissible.autoInit("[data-dismissible-demo]")
}