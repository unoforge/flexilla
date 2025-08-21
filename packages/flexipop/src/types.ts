type Direction = 'top' | 'left' | 'bottom' | 'right';
type Alignment = 'start' | 'middle' | 'end';
export type Placement = `${Direction}-${Alignment}` | Direction

type EventEffect = {
    disableOnScroll?: boolean,
    disableOnResize?: boolean
}

export type PopperOptions = {
    placement?: Placement,
    offsetDistance?: number,
    eventEffect?: EventEffect,
    onUpdate?: ({ x, y, placement }: { x: number, y: number, placement?: Placement }) => void
}

export type Dimensions = {
    popperHeight: number;
    popperWidth: number;
    refHeight: number;
    refWidth: number;
    refLeft: number;
    refTop: number;
    refRight: number;
}

export type ElementType = {
    reference: HTMLElement,
    popper: HTMLElement
}