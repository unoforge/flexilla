export type IndicatorOptions = {
    transformDuration?: number,
    transformEasing?: string,
}

export type TabsOptions = {
    defaultValue?: string,
    animationOnShow?: string,
    indicatorOptions?: IndicatorOptions,
    onChange?: () => void,
    onChangeTab?: ({ currentTrigger, currentPanel }: { currentTrigger?: HTMLElement, currentPanel?: HTMLElement }) => void
};
