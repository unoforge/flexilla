const plugin = require("tailwindcss/plugin");

module.exports = plugin(({ addVariant, e, addComponents }) => {
  const validStateValues = [
    "open",
    "opened",
    "closed",
    "resized",
    "not-open",
    "visible",
    "not-visible",
    "hidden",
    "not-hidden",
    "close",
    "not-close",
    "active",
    "not-active",
    "inactive",
    "not-inactive",
  ];
  const prefix = "fx";

  const selector = "data-state";
  for (const stateValue of validStateValues) {
    const startWithNot = stateValue.startsWith("not-");

    const value = startWithNot
      ? stateValue.substring(stateValue.indexOf("-") + 1)
      : stateValue;
    const variantName = `${prefix}-${stateValue}`;
    const attrGen = `[${selector}="${value}"]`;
    addVariant(`${variantName}`, [
      ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return startWithNot
            ? `.${e(
                `${variantName}${separator}${className}`
              )}[${selector}]:not(${attrGen})`
            : `.${e(`${variantName}${separator}${className}`)}${attrGen}`;
        });
      },
    ]);
    addVariant(`peer-${variantName}`, [
      ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return startWithNot
            ? `.peer:not(${attrGen}) ~ .peer-${e(
                `${variantName}${separator}${className}`
              )}`
            : `.peer${attrGen} ~ .peer-${e(
                `${variantName}${separator}${className}`
              )}`;
        });
      },
    ]);
    addVariant(`group-${variantName}`, [
      ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return startWithNot
            ? `.group:not(${attrGen}) .group-${e(
                `${variantName}${separator}${className}`
              )}`
            : `.group${attrGen} .group-${e(
                `${variantName}${separator}${className}`
              )}`;
        });
      },
    ]);
  }
  //
  addComponents({
    ".ui-popper": {
      position: "fixed",
      top: "var(--fx-popper-placement-y)",
      left: "var(--fx-popper-placement-x)",
    },
    ".ui-animated-modal-content": {
      animation: "var(--un-modal-animation)",
      animationFillMode: "both",
    },
    ".ui-animated-tab-panel": {
      animation: "var(--un-tab-show-animation)",
      animationFillMode: "both",
    },
    ".ui-tabs-indicator": {
      position: "absolute",
      transformOrigin: "0 0",
      width: "var(--un-tab-indicator-width)",
      height: "var(--un-tab-indicator-height)",
      top: "var(--un-tab-indicator-top)",
      left: "var(--un-tab-indicator-left)",
    },
    ".ui-overlay": {
      position: "fixed",
      inset: "0",
    },
  });
});
