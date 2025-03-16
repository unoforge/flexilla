import { $, $d, setAttributes } from "@flexilla/utilities";
import { ACTIVE_STATE, INACTIVE_STATE, STATE_TO_FALSE, STATE_TO_TRUE } from "./const";
import { moveIndicator } from "./indicator";

const setAllTriggerToFalse = (activeTrigger: HTMLElement, tabTriggers: HTMLElement[]) => {
  for (const tabTrigger of tabTriggers) {
    if (tabTrigger !== activeTrigger) {
      setAttributes(tabTrigger, { "data-state": INACTIVE_STATE, tabindex: "-1" })
      if (tabTrigger instanceof HTMLAnchorElement) tabTrigger.setAttribute("aria-selected", "false")
    }
  }
};

const setNestedTabsIndicatorCorrectly = ({ indicatorTransformDuration, indicatorTransformEaseing, indicator, triggerElement, tabList }: {  indicatorTransformDuration: number, indicatorTransformEaseing: string, indicator: HTMLSpanElement, triggerElement: HTMLElement, tabList: HTMLElement }) => {
  if (!(indicator instanceof HTMLSpanElement) || !(triggerElement instanceof HTMLElement)) return
  moveIndicator({
    triggerElement,
    indicator_: indicator,
    transformDuration: indicatorTransformDuration,
    transformEasing: indicatorTransformEaseing,
    tabList
  });
}

export const hideAllTabPanels = (activePanel: HTMLElement | undefined, tabPanels: HTMLElement[]) => {
  for (const tabPanel of tabPanels) {
    if (tabPanel !== activePanel) {
      setAttributes(tabPanel, { "data-state": INACTIVE_STATE, "aria-hidden": STATE_TO_TRUE })
      tabPanel.hidden = true
    }
  }
};

export const activeTab = ({ triggerElement, tabTriggers, tabsPanelContainer, showAnimation,  indicatorTransformDuration, indicatorTransformEaseing, tabList }: { triggerElement: HTMLElement, tabTriggers: HTMLElement[], tabsPanelContainer: HTMLElement, showAnimation: string, indicatorTransformDuration: number, indicatorTransformEaseing: string, tabList: HTMLElement }) => {
  const currentTab = $d("[data-tab-panel][data-state=active]", tabsPanelContainer)
  if (currentTab instanceof HTMLElement) {
    setAttributes(currentTab, { "data-state": "hidden" })
    currentTab.hidden = true
  }
  if (!(triggerElement instanceof HTMLElement)) return;
  const toSelectTab = $d(`[data-tab-panel]#${triggerElement.getAttribute("data-target")}`, tabsPanelContainer);
  if (!(toSelectTab instanceof HTMLElement)) return;
  setAllTriggerToFalse(triggerElement, tabTriggers);
  toSelectTab.hidden = false
  setAttributes(toSelectTab, { "data-state": ACTIVE_STATE, "aria-hidden": STATE_TO_FALSE })
  setAttributes(triggerElement, { "data-state": ACTIVE_STATE, tabindex: "0" })
  if (triggerElement instanceof HTMLAnchorElement) triggerElement.setAttribute("aria-selected", "true")

  if (showAnimation && showAnimation !== "") {
    toSelectTab.style.setProperty("--un-tab-show-animation", `${showAnimation}`)
  }

  const indicator = $("[data-tab-indicator]", tabList) as HTMLSpanElement


  moveIndicator({
    triggerElement,
    indicator_: indicator,
    transformDuration: indicatorTransformDuration,
    transformEasing: indicatorTransformEaseing,
    tabList
  });

  const childTab = $d("[data-fx-tabs]", toSelectTab)
  if (childTab instanceof HTMLElement) {
    const childTabListWrapper = $d("[data-tab-list-wrapper]", childTab) || childTab
    const childTabList = $d("[data-tab-list]", childTabListWrapper) as HTMLElement
    const triggerElement = childTabList.querySelector("[data-tabs-trigger][data-state=active]") as HTMLElement
    const childIndicator = childTabList.querySelector("span[data-tab-indicator]") as HTMLSpanElement
    if (childIndicator instanceof HTMLSpanElement && triggerElement instanceof HTMLElement && !childTab.hasAttribute("data-nested-indicator-seteled")) {
      childTab.setAttribute("data-nested-indicator-seteled", '')
      setNestedTabsIndicatorCorrectly({
        indicatorTransformDuration: indicatorTransformDuration,
        indicatorTransformEaseing: indicatorTransformEaseing,
        indicator: childIndicator,
        triggerElement: triggerElement,
        tabList: childTabList
      })
    }
  }

  return { currentTabPanel: toSelectTab }
};

export const handleKeyEvent = (event: KeyboardEvent, tabTriggers: HTMLElement[]) => {
  const currentIndex = tabTriggers.findIndex(
    (tabTrigger) => tabTrigger.getAttribute("data-state") === ACTIVE_STATE
  );

  const direction =
    event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;

  const isValidIndex = (index: number) =>
    !tabTriggers[index].hasAttribute("disabled");

  const getNextIndex = (currentIndex: number, direction: 1 | -1, length: number) => {
    let nextIndex = (currentIndex + direction + length) % length;
    while (!isValidIndex(nextIndex)) {
      nextIndex = (nextIndex + direction + length) % length;
    }
    return nextIndex;
  };

  if (
    event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight"
  ) {
    event.preventDefault();
    const nextValidIndex = getNextIndex(
      currentIndex,
      direction,
      tabTriggers.length
    );
    const currentTrigger_ = tabTriggers[nextValidIndex];
    currentTrigger_.focus();
    currentTrigger_.click();
  }
};