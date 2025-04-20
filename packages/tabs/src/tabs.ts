import { 
    $, 
    $$, 
    $d, 
    dispatchCustomEvent,
    observeChildrenChanges 
} from "@flexilla/utilities";
import type { IndicatorOptions, TabsOptions } from "./types";
import { DEFAULT_INDICATOR, TRANSFORM_DURATION, TRANSFORM_EASING } from "./const";
import { createIndicator } from "./indicator";
import { activeTab, handleKeyEvent, hideAllTabPanels } from "./helpers";
import { FlexillaManager } from "@flexilla/manager"
/**
 * A flexible and accessible tabs component that manages tab panels and their triggers.
 * 
 * @example
 * ```js
 * // Initialize a single tabs instance
 * const tabs = new Tabs('#my-tabs', {
 *   defaultValue: 'tab1',
 *   animationOnShow: 'slide-right',
 *   indicatorOptions: {
 *     className: 'tab-indicator'
 *   }
 * });
 *
 * // Change tab programmatically
 * tabs.changeTab('tab2');
 * ```
 */
class Tabs {
  private tabsElement!: HTMLElement;
  private options!: TabsOptions;
  private indicatorOptions!: IndicatorOptions;
  private defaultTabValue!: string;
  private showAnimation!: string;
  private tabList!: HTMLElement;
  private tabPanels!: HTMLElement[];
  private tabTriggers!: HTMLElement[];
  private activeTabTrigger!: HTMLElement;
  private indicatorClassName!: string;
  private indicatorTransformEaseing!: string;
  private indicatorTransformDuration!: number;
  private panelsContainer!: HTMLElement;
  private cleanupObserver: (() => void) | null = null;

  /**
   * Tabs Components
   * @param tabs 
   * @param options 
   */
  /**
   * Creates a new Tabs instance.
   * 
   * @param {string | HTMLElement} tabs - The tabs container element or selector.
   * @param {TabsOptions} [options={}] - Configuration options for the tabs component.
   * @param {string} [options.defaultValue] - The initial active tab panel's ID.
   * @param {string} [options.animationOnShow] - Animation class to apply when showing tab panels.
   * @param {IndicatorOptions} [options.indicatorOptions] - Configuration for the tab indicator.
   */
  constructor(tabs: string | HTMLElement, options: TabsOptions = {}) {
    const tabsElement = typeof tabs === "string" ? $(tabs) : tabs
    if (!(tabsElement instanceof HTMLElement)) {
      throw new Error("Please Provide a valid HTMLElement for the tabs component");
    }

    this.tabsElement = tabsElement;
    const existingInstance = FlexillaManager.getInstance('tabs', this.tabsElement);
    if (existingInstance) {
      return existingInstance;
    }
    this.panelsContainer = $d("[data-panels-container]", this.tabsElement) || this.tabsElement
    this.options = options;
    this.indicatorOptions = this.options.indicatorOptions || DEFAULT_INDICATOR;
    const { defaultValue, animationOnShow } = this.options;
    this.defaultTabValue = defaultValue || this.tabsElement.dataset.defaultValue || this.getDefActivePanelValue(this.panelsContainer) || "";
    this.showAnimation = animationOnShow || this.tabsElement.dataset.showAnimation || "";
    const tabListWrapper = $d("[data-tab-list-wrapper]", this.tabsElement) || this.tabsElement
    this.tabList = $d("[data-tab-list]", tabListWrapper) as HTMLElement;
    const panels = $$("[data-tab-panel]", this.panelsContainer);
    this.tabPanels = panels.filter((panel) => panel.parentElement === this.panelsContainer)
    this.validateTabElements(this.tabList, this.tabPanels);
    this.tabTriggers = $$("[data-tabs-trigger]", this.tabList);
    if (this.tabTriggers.length <= 0) {
      throw new Error("No trigger found, Tab component must have at least one trigger");
    }
    const defaultActiveTrigger = $("[data-tabs-trigger][data-state=active]", this.tabList)
    this.activeTabTrigger = $(`[data-tabs-trigger][data-target='${this.defaultTabValue}']`, this.tabList) || defaultActiveTrigger || this.tabTriggers[0];
    const { transformEasing, transformDuration, className } = this.indicatorOptions;
    this.indicatorClassName = className || this.tabsElement.getAttribute("data-indicator-class-name") || "";
    this.indicatorTransformEaseing = transformEasing || this.tabsElement.dataset.indicatorTransformEasing || TRANSFORM_EASING;
    this.indicatorTransformDuration = transformDuration || parseInt(this.tabsElement.dataset.indicatorTransformDuration || "") || TRANSFORM_DURATION;
    this.initTabs();
  }

  private validateTabElements(tabList: HTMLElement | null, tabPanels: HTMLElement[]) {
    if (!(tabList instanceof HTMLElement)) {
      throw new Error("TabList Element is required, tabList must have a data-tab-list attribute and be direct descendant of the tabs or must be wrapped inside another element with data-tab-list-wrapper");
    }
    const isValidTabPanels = tabPanels.every(element => element instanceof HTMLElement)
    if (!isValidTabPanels) {
      throw new Error("TabPanels Element are required, tabPanels must have a data-tab-panel attribute and be direct descendant of the tabs or the panels container (data-panels-container)");
    }
  }

  private getDefActivePanelValue = (panelsContainer: HTMLElement) => {
    const panel = $d("[data-tab-panel][data-state=active]", panelsContainer)
    return panel?.getAttribute("id")
  }

  private initTabs() {
    if (!this.tabsElement.hasAttribute("data-fx-tabs")) {
      this.tabsElement.setAttribute("data-fx-tabs", "");
    }
    this.initializeTab(
      {
        tabTriggers: this.tabTriggers,
        tabPanels: this.tabPanels,
        tabsPanelContainer: this.panelsContainer,
        showAnimation: this.showAnimation,
        indicatorTransformDuration: this.indicatorTransformDuration,
        indicatorTransformEaseing: this.indicatorTransformEaseing,
        activeTabTrigger: this.activeTabTrigger,
        indicatorClassName: this.indicatorClassName,
        tabList: this.tabList
      }
    );

    // Initialize observer
    this.cleanupObserver = observeChildrenChanges({
      container: this.panelsContainer,
      attributeToWatch: 'data-tab-panel',
      onChildAdded: this.reload
    });

    FlexillaManager.register('tabs', this.tabsElement, this)
  }
  private handleGlobalTabChanges = (triggerElement: HTMLElement) => {
    const isCurrent = triggerElement.ariaSelected === "true" || this.activeTabTrigger === triggerElement
    // if always selected then return void and don't do anything
    if (isCurrent) return

    this.activeTabTrigger = triggerElement;
    const tabAct = activeTab({
      triggerElement,
      tabTriggers: this.tabTriggers,
      tabsPanelContainer: this.panelsContainer,
      showAnimation: this.showAnimation,
      indicatorTransformDuration: this.indicatorTransformDuration,
      indicatorTransformEaseing: this.indicatorTransformEaseing,
      tabList: this.tabList
    });
    this.options.onChangeTab && (this.options.onChangeTab({
      currentTrigger: triggerElement,
      currentPanel: tabAct?.currentTabPanel
    }));
    dispatchCustomEvent(this.tabsElement, "change-tab", {
      currentTrigger: triggerElement,
      currentPanel: tabAct?.currentTabPanel
    });
  }

  private handleTabChanges = (e: MouseEvent) => {
    const triggerElement = e.currentTarget as HTMLElement;
    e.preventDefault();
    this.handleGlobalTabChanges(triggerElement)
  }

  private handleKeyEventChanges = (event: KeyboardEvent) => {
    handleKeyEvent(event, this.tabTriggers)
  }

  private attachTriggerEvents(triggerElement: HTMLElement) {
    if (!(triggerElement instanceof HTMLElement)) return;
    triggerElement.addEventListener("click", this.handleTabChanges);
    triggerElement.addEventListener("keydown", this.handleKeyEventChanges);
  }

  private cleanupSingle = (triggerElement: HTMLElement) => {
    if (!(triggerElement instanceof HTMLElement)) return;
    triggerElement.removeEventListener("click", this.handleTabChanges);
    triggerElement.removeEventListener("keydown", this.handleKeyEventChanges);
  }

  /**
   * Cleans up the tabs instance by removing event listeners, attributes, and references.
   * 
   * @public
   * @returns {void}
   */
  cleanup = (): void => {
    if (!this.tabsElement) return;
    for (const trigger of this.tabTriggers) {
      this.cleanupSingle(trigger)
    }
    
    // Clean up the observer
    if (this.cleanupObserver) {
      this.cleanupObserver();
      this.cleanupObserver = null;
    }
    
    FlexillaManager.removeInstance('tabs', this.tabsElement)
    this.tabTriggers = [];
    this.tabPanels = [];
  }

  reload = () => {
    this.cleanup()
    const tabListWrapper = $d("[data-tab-list-wrapper]", this.tabsElement) || this.tabsElement
    this.tabList = $d("[data-tab-list]", tabListWrapper) as HTMLElement;
    const panels = $$("[data-tab-panel]", this.panelsContainer);
    this.tabPanels = panels.filter((panel) => panel.parentElement === this.panelsContainer)
    this.validateTabElements(this.tabList, this.tabPanels);
    this.tabTriggers = $$("[data-tabs-trigger]", this.tabList);
    this.initTabs()
  }



  private initializeTab(
    { tabTriggers, tabPanels, tabsPanelContainer, showAnimation, indicatorTransformDuration, indicatorTransformEaseing, activeTabTrigger, indicatorClassName, tabList }: { tabTriggers: HTMLElement[], tabPanels: HTMLElement[], tabsPanelContainer: HTMLElement, showAnimation: string, indicatorTransformDuration: number, indicatorTransformEaseing: string, activeTabTrigger: HTMLElement, indicatorClassName: string, tabList: HTMLElement }
  ) {
    createIndicator({
      activeTabTrigger,
      indicatorClassName,
      tabList
    });
    for (const tabTrigger of tabTriggers) {
      this.attachTriggerEvents(tabTrigger);
    }

    const activePanel = $d(`[data-tab-panel]#${activeTabTrigger.getAttribute("data-target")}`, tabsPanelContainer)
    hideAllTabPanels(activePanel, tabPanels)

    const tabAct = activeTab({
      triggerElement: activeTabTrigger,
      tabTriggers,
      tabsPanelContainer: tabsPanelContainer,
      showAnimation,
      indicatorTransformDuration,
      indicatorTransformEaseing,
      tabList: tabList
    });

    this.options.onChangeTab && (this.options.onChangeTab({
      currentTrigger: activeTabTrigger,
      currentPanel: tabAct?.currentTabPanel
    }));
  }

  /**
   * @param tabValue {string} the value of the targeted tabpanel
   */
  /**
   * Changes the active tab programmatically.
   * 
   * @param {string} tabValue - The ID of the tab panel to activate.
   * @example
   * ```js
   * // Switch to the tab panel with ID 'tab2'
   * tabs.changeTab('tab2');
   * ```
   */
  changeTab = (tabValue: string) => {
    const triggerElement = $(`[data-tabs-trigger][data-target='${tabValue}']`, this.tabList)
    if (!(triggerElement instanceof HTMLElement)) return
    this.handleGlobalTabChanges(triggerElement)
  }

  /**
   * Automatically initializes all tabs components in the document that match the selector.
   * 
   * @param {string} [selector='[data-fx-tabs]'] - The selector to find tabs components.
   * @example
   * ```js
   * // Initialize all tabs with default selector
   * Tabs.autoInit();
   * 
   * // Initialize tabs with custom selector
   * Tabs.autoInit('.custom-tabs');
   * ```
  */
  static autoInit = (selector: string = "[data-fx-tabs]") => {
    const tabsEls = $$(selector)
    for (const tabs of tabsEls) new Tabs(tabs)
  }

  /**
   * Creates and initializes a new Tabs instance.
   * 
   * @param {string | HTMLElement} tabs - The tabs container element or selector.
   * @param {TabsOptions} options - Configuration options for the tabs component.
   * @returns {Tabs} A new Tabs instance.
   * @example
   * ```js
   * const tabs = Tabs.init('#my-tabs', {
   *   defaultValue: 'tab1',
   *   indicatorOptions: {
   *     className: 'custom-indicator'
   *   }
   * });
   * ```
   */
  static init = (tabs: string | HTMLElement, options: TabsOptions): Tabs => new Tabs(tabs, options)
}

export default Tabs
