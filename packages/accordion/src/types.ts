type ExpandedItem = {
    accordionItem: HTMLElement
    trigger: HTMLElement,
    content: HTMLElement,
    value: string,
    isExpanded: boolean
}

export type AccordionType = "single" |"multiple"
export type AccordionOptions = {
    accordionType?: AccordionType,
    defaultValue?: string,
    preventClosingAll?: boolean,
    allowCloseFromContent?:boolean
    onChangeItem?: ({ expandedItem }: { expandedItem?: ExpandedItem }) => void
}

export type AccordionItemMetadata = {
    defaultOpened:boolean,
    accordionTriggerElement: HTMLButtonElement,
    accordionContentElement: HTMLDivElement,
    accordionItemValue: string,
    isItemExpanded: boolean,
}