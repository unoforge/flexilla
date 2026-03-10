import { createSelect } from "@flexilla/select";
import "./../main";

const singleSelectRoot = document.querySelector<HTMLElement>("[data-demo-select]");
const multiSelectRoot = document.querySelector<HTMLElement>("[data-demo-select-multi]");

type Controller = ReturnType<typeof createSelect>;

const wireTriggerLabel = (root: HTMLElement, controller: Controller, placeholder: string) => {
  const trigger = root.querySelector<HTMLElement>("[data-select-trigger]");
  if (!trigger) return;

  const computeLabel = () => {
    const { selectedValues, items } = controller.getState();
    if (!selectedValues.length) return placeholder;
    const labels = selectedValues
      .map((value) => items.find((item) => item.value === value)?.label ?? value)
      .filter(Boolean);
    return labels.join(", ");
  };

  controller.subscribe(() => {
    trigger.textContent = computeLabel();
  });

  // initialize
  trigger.textContent = computeLabel();
};

if (singleSelectRoot) {
  const select = createSelect();
  select.connect({ root: singleSelectRoot });
  const placeholder = singleSelectRoot.querySelector("[data-select-trigger]")?.textContent?.trim() || "Select";
  wireTriggerLabel(singleSelectRoot, select, placeholder);
}

if (multiSelectRoot) {
  const select = createSelect({ multiple: true });
  select.connect({ root: multiSelectRoot });
  const placeholder = multiSelectRoot.querySelector("[data-select-trigger]")?.textContent?.trim() || "Select";
  wireTriggerLabel(multiSelectRoot, select, placeholder);
}
