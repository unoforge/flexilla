type AttributeMap = { [key: string]: string }
export type TogglerOptions = {
	trigger?: HTMLElement | string|null,
	onToggle?: ({ isExpanded }: { isExpanded: boolean }) => void,
	targets: {
		element: HTMLElement | string,
		attributes: { initial: AttributeMap, to: AttributeMap }
	}[]
}