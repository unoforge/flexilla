import { setAttributes } from "@flexilla/utilities"

export const updateOverlayState = (
    { state,  trigger, popper }: {
        state: "open" | "close",
        trigger: HTMLElement,
        popper: HTMLElement
    }) => {
    setAttributes(popper, {
        "data-state": state
    })
    setAttributes(trigger, {
        "aria-expanded": `${state}`
    })
}


export const showOverlay = ({  trigger, popper }: {
    container?: HTMLElement|null,
    trigger: HTMLElement,
    popper: HTMLElement
}) => {
    updateOverlayState({ state: "open", trigger, popper })
}

export const hideOverlay = ({  trigger, popper }: {
    container?: HTMLElement|null,
    trigger: HTMLElement,
    popper: HTMLElement
}) => {
    updateOverlayState({ state: "close", trigger, popper })
}