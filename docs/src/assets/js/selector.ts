export const $ = (selector: string, parentElement: HTMLElement = document.body): HTMLElement | null =>
	parentElement.querySelector(selector);

export const $$ = (selector: string, parentElement: HTMLElement = document.body): HTMLElement[] =>
	Array.from(parentElement.querySelectorAll(selector));
