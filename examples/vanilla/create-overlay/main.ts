import "./../main";
import { CreateOverlay } from "flexipop/create-overlay";
import type { Placement } from "flexipop/create-overlay";

const createRows = (label: string) =>
    Array.from({ length: 5 }, (_, index) => `
      <div class="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
        <p class="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">${label} row ${index + 1}</p>
        <p class="mt-2 text-sm leading-6 text-stone-700">
          Long content block used to force a tall overlay and validate the height adjustment workflow.
        </p>
      </div>
    `).join("");

const setPanelContent = (selector: string, label: string) => {
    const container = document.querySelector<HTMLElement>(selector);
    if (!container) return;
    container.innerHTML = createRows(label);
};

[
    "default",
    "readjust",
    "left-start",
    "left-middle",
    "left-end",
    "right-start",
    "right-middle",
    "right-end"
].forEach((label) => setPanelContent(`[data-demo-fill="${label}"]`, label));

const bindStatus = ({
    triggerSelector,
    panelSelector,
    statusSelector,
    label
}: {
    triggerSelector: string
    panelSelector: string
    statusSelector: string
    label: string
}) => {
    const trigger = document.querySelector<HTMLElement>(triggerSelector);
    const panel = document.querySelector<HTMLElement>(panelSelector);
    const status = document.querySelector<HTMLElement>(statusSelector);

    if (!trigger || !panel || !status) return () => undefined;

    const update = () => {
        const triggerRect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const computed = window.getComputedStyle(panel);

        status.textContent = [
            `${label}`,
            `state        : ${panel.dataset.state || "close"}`,
            `trigger left : ${Math.round(triggerRect.left)}px`,
            `space left   : ${Math.round(triggerRect.left)}px`,
            `space right  : ${Math.round(window.innerWidth - triggerRect.right)}px`,
            `trigger top  : ${Math.round(triggerRect.top)}px`,
            `space top    : ${Math.round(triggerRect.top)}px`,
            `space bottom : ${Math.round(window.innerHeight - triggerRect.bottom)}px`,
            `panel width  : ${Math.round(panelRect.width)}px`,
            `panel height : ${Math.round(panelRect.height)}px`,
            `max-height   : ${computed.maxHeight || "none"}`,
            `overflow-y   : ${computed.overflowY || "visible"}`
        ].join("\n");
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(panel);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });

    return update;
};

const updateDefaultStatus = bindStatus({
    triggerSelector: "#overlay-default-trigger",
    panelSelector: "#overlay-default",
    statusSelector: "#overlay-default-status",
    label: "Default overlay"
});

const updateReadjustStatus = bindStatus({
    triggerSelector: "#overlay-readjust-trigger",
    panelSelector: "#overlay-readjust",
    statusSelector: "#overlay-readjust-status",
    label: "Readjusted overlay"
});

new CreateOverlay({
    trigger: "#overlay-default-trigger",
    content: "#overlay-default",
    options: {
        placement: "bottom",
        offsetDistance: 10,
        triggerStrategy: "click",
        preventCloseFromInside: true,
        onShow: updateDefaultStatus,
        onHide: updateDefaultStatus
    }
});

new CreateOverlay({
    trigger: "#overlay-readjust-trigger",
    content: "#overlay-readjust",
    options: {
        placement: "bottom",
        offsetDistance: 10,
        triggerStrategy: "click",
        preventCloseFromInside: true,
        readjustHeight: true,
        minHeight: 160,
        onShow: updateReadjustStatus,
        onHide: updateReadjustStatus
    }
});

const horizontalConfigs: Array<{ id: string, placement: Placement, label: string }> = [
    { id: "left-start", placement: "left-start", label: "Left start overlay" },
    { id: "left-middle", placement: "left-middle", label: "Left middle overlay" },
    { id: "left-end", placement: "left-end", label: "Left end overlay" },
    { id: "right-start", placement: "right-start", label: "Right start overlay" },
    { id: "right-middle", placement: "right-middle", label: "Right middle overlay" },
    { id: "right-end", placement: "right-end", label: "Right end overlay" }
];

horizontalConfigs.forEach(({ id, placement, label }) => {
    const updateStatus = bindStatus({
        triggerSelector: `#overlay-${id}-trigger`,
        panelSelector: `#overlay-${id}`,
        statusSelector: `#overlay-${id}-status`,
        label
    });

    new CreateOverlay({
        trigger: `#overlay-${id}-trigger`,
        content: `#overlay-${id}`,
        options: {
            placement,
            offsetDistance: 12,
            triggerStrategy: "click",
            preventCloseFromInside: true,
            readjustHeight: true,
            minHeight: 160,
            onShow: updateStatus,
            onHide: updateStatus
        }
    });
});
