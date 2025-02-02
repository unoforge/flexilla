import "./../main"
import { Accordion } from "@flexilla/accordion"

new Accordion('[data-accordion-1]',{
    accordionType:"single",
    allowCloseFromContent:true
})

new Accordion("[data-accordion-nested]")
new Accordion("[data-accordion-nested-child]")

new Accordion('[data-accordion-2]',
    {
        defaultValue: "accordion-1",
    }
)

new Accordion(
    '[data-accordion-3]',
    {
        defaultValue: "accordion-2",
        accordionType: "multiple"
    }
)

new Accordion(
    '[data-accordion-4]',
    {
        defaultValue: "accordion-2",
        preventClosingAll: true
    }
)


new Accordion(
    document.querySelector('[data-accordion-5]') as HTMLElement,
    {
        defaultValue: "accordion-1",
    }
)