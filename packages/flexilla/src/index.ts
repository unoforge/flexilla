import "./flexilla.css"
import { Accordion } from "@flexilla/accordion"
import { AutoResizeTextArea } from "@flexilla/auto-resize-area"
import { Collapse } from "@flexilla/collapse"
import { CustomRange } from "@flexilla/custom-range"
import { Dismissible } from "@flexilla/dismissible"
import { Dropdown } from "@flexilla/dropdown"
import { Modal } from "@flexilla/modal"
import { OffCanvas } from "@flexilla/offcanvas"
import { Tabs } from "@flexilla/tabs"
import { Tooltip } from "@flexilla/tooltip"
// import {} from "@flexilla/pin-input"

import type { AccordionOptions } from "@flexilla/accordion"
import type { CollapseOptions } from "@flexilla/collapse"
import type { ModalOptions } from "@flexilla/modal"
import type { OffcanvasOptions } from "@flexilla/offcanvas"
import type { TabsOptions } from "@flexilla/tabs"
import type { DropdownOptions } from "@flexilla/dropdown"
import type { TooltipOptions } from "@flexilla/tooltip"
import { Popover, type PopoverOptions } from "@flexilla/popover"
import type { FlexillaOptions } from "./types"
import { PinInput, PinInputOptions } from "@flexilla/pin-input"

/**
 * Automaticaly init Components based on data-attribute or provided selector for each component via options
 * @param options 
 */
const initFlexilla = (
    options: FlexillaOptions
) => {
    Accordion.autoInit(options.accordion)
    AutoResizeTextArea.autoInit(options.autoresize)
    Collapse.autoInit(options.collapse)
    CustomRange.autoInit(options.customRange)
    Dismissible.autoInit(options.dismissible)
    Dropdown.autoInit(options.dropdown)
    Modal.autoInit(options.modal)
    OffCanvas.autoInit(options.offcanvas)
    Tabs.autoInit(options.tabs)
    Popover.autoInit(options.popover)
    // Tooltip.autoInit(options.tooltip)
}

export {
    Accordion, AutoResizeTextArea, Collapse,
    CustomRange, Dismissible, Dropdown, Modal, OffCanvas, Tabs, Tooltip, Popover,
    PinInput,
    initFlexilla
}
export type {
    AccordionOptions, CollapseOptions
    , ModalOptions, TabsOptions, OffcanvasOptions, FlexillaOptions,
    DropdownOptions, TooltipOptions, PopoverOptions,
    PinInputOptions
}