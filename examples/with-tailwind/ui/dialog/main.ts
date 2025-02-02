import { Modal, ModalOptions } from "@flexilla/modal"
import "./../../main"

new Modal("[data-modal-test-1]")

new Modal("[data-modal-test-1b]")
let isFailed = true
const options: ModalOptions = {
    animateContent: {
        enterAnimation: "slideIn .5s linear",
        exitAnimation: "slideOut .2s linear"
    },
    beforeHide: () => {
        if (isFailed) {
            isFailed = false
            return { cancelAction: true }
        }

    },

}
new Modal("[data-modal-test-2]", {
    beforeHide: () => {
        console.log("Going")
    },
})
new Modal(
    "[data-modal-test-3]",
    options
)


new Modal(
    "[data-modal-prevent]",
    {
        preventCloseModal: true,
        animateContent: {
            enterAnimation: "slideIn .3s linear",
        },
    },
    "[data-custom-trigger]"
)

new Modal(
    "[data-modal-with-stacked]",
    {
        animateContent: {
            enterAnimation: "slideIn .3s linear",
        }
    },
    "[data-trigger-with-stacked]")

new Modal(
    "[data-modal-prevent-stack]",
    {
        enableStackedModals: true,
        animateContent: {
            enterAnimation: "slideIn .3s linear",
        },
    },
    "[data-custom-trigger-stack]"
)

new Modal(
    "[data-modal-third]",
    {
        enableStackedModals: true,
        animateContent: {
            enterAnimation: "slideIn .3s linear",
        },
    },
    "[data-trigger-third]"
)