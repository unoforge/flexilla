import { Tabs } from "./../../../packages/tabs/src/index"
import "./../main"


export const $$ = (selector: string, parentElement: HTMLElement = document.body): HTMLElement[] =>
    Array.from(parentElement.querySelectorAll(selector));

export const $d = (selector: string, parentElement: HTMLElement = document.body): HTMLElement | undefined => {
    const allItems = $$(selector, parentElement);
    // Find the first direct descendant
    const directDescendant = Array.from(allItems).find((item) => item.parentElement === parentElement);
    return directDescendant
};

const tab = document.querySelector("[data-tabs]") as HTMLElement



new Tabs("[data-tabs-nested2]")

new Tabs("[data-with-indicator]")

new Tabs("[data-tab-animated-key]",
    {
        indicatorOptions: {
            className: "ui-tabs-indicator rd bg-zinc2 dark-bg-zinc8 absolute top-0 left-0",
        },
    }
)

new Tabs("[data-vertical-tab]")

new Tabs("[data-vertical-tab-2]",
    {
        indicatorOptions: {
            className: "ui-tabs-indicator rd bg-zinc2 dark-bg-zinc8 absolute top-0 left-0"
        }
    }
)

new Tabs('[data-tab-default-indicator]',
    {
        indicatorOptions: {
            className: "ui-tabs-indicator rd bg-zinc2 dark-bg-zinc8 absolute top-0 left-0"
        },
    }
)

    let id = 4;
const addNewTab = (tabEl: HTMLElement) => {

    const tabListWrapper = $d("[data-tab-list-wrapper]", tabEl) || tabEl
    const tabList = $d("[data-tab-list]", tabListWrapper)
    const panelsContainer = $d("[data-panels-container]", tabEl) || tabEl

    if (tabList) {
        const newTabItem = document.createElement('li');
        newTabItem.setAttribute('role', 'presentation');
        newTabItem.className = 'flex';
        const newTabLink = document.createElement('a');
        newTabLink.href = '#link';
        newTabLink.setAttribute('data-tabs-trigger', '');
        newTabLink.setAttribute('data-target', `tab${id}`);
        newTabLink.tabIndex = 0;
        newTabLink.className = 'px4 py2 rd text-zinc7 dark-text-zinc3 disabled-cursor-not-allowed disabled-op80 fx-active-bg-zinc2 dark-fx-active-bg-zinc8 outline outline-1 outline-transparent focus-outline-blue5 dark-focus-outline-blue4';
        newTabLink.textContent = `Tabs${id}`;
        newTabItem.appendChild(newTabLink);
        tabList.appendChild(newTabItem);
    }

    // Add new panel
    if (panelsContainer) {
        const newPanel = document.createElement('section');
        newPanel.setAttribute('role', 'tabpanel');
        newPanel.setAttribute('tabindex', '0');
        newPanel.setAttribute('data-tab-panel', '');
        newPanel.setAttribute('id', `tab${id}`);
        newPanel.setAttribute('aria-labelledby', `tab${id}`);
        newPanel.className = 'hidden fx-active-flex ring-offset-zinc950 p20 focus-visible-outline-none focus-visible-ring-2 focus-visible-ring-red5 focus-visible-ring-offset-2 b b-zinc2 dark-b-zinc8 rd-md mt2';
        newPanel.textContent = `Tab ${id} Content`;
        panelsContainer.appendChild(newPanel);
        // The observer will automatically trigger reload
    }

    id++;
}


const trigger = document.querySelector("[data-add-new-tab]") as HTMLButtonElement

if (trigger) {
    new Tabs(tab);
    trigger.addEventListener("click", () => {
        addNewTab(tab);
    });
}
