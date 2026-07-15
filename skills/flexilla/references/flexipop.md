# Flexipop — Positioning Engine

Package: `flexipop` (unscoped)
Subpath: `flexipop/create-overlay` for the `CreateOverlay` wrapper

Flexipop is the positioning engine used by Dropdown, Popover, Tooltip, Select, and Autocomplete. It has two layers:

1. **`CreatePopper`** — low-level positioning engine (computes x/y coordinates, handles viewport collisions, flip, and height readjustment)
2. **`CreateOverlay`** — higher-level overlay manager built on `CreatePopper` (adds trigger strategies, click-outside/Escape closing, lifecycle callbacks)

## CreatePopper

```js
import { CreatePopper } from "flexipop";

const popper = new CreatePopper(referenceEl, popperEl, {
  placement: "bottom",
  offsetDistance: 10,
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placement` | `Placement` | `"bottom"` | Position relative to reference |
| `offsetDistance` | `number` | `10` | Gap in px between reference and popper |
| `eventEffect` | `{ disableOnScroll?, disableOnResize? }` | `{}` | Control repositioning on scroll/resize |
| `onUpdate` | `({ x, y, placement }) => void` | — | Called after each position calculation |
| `readjustHeight` | `boolean` | `false` | Adjust maxHeight/overflowY to fit viewport |
| `minHeight` | `number` | `140` | Min height when readjustHeight is active |

### Placement

```ts
type Placement = `${Direction}-${Alignment}` | Direction;
type Direction = "top" | "bottom" | "left" | "right";
type Alignment = "start" | "middle" | "end";
```

| Direction | Alignments |
|---|---|
| `top` | `top-start`, `top-middle`, `top-end` |
| `bottom` | `bottom-start`, `bottom-middle`, `bottom-end` |
| `left` | `left-start`, `left-middle`, `left-end` |
| `right` | `right-start`, `right-middle`, `right-end` |

Bare directions (e.g., `"bottom"`) default to middle alignment. Flexipop auto-flips to the opposite side when there isn't enough space.

### Methods

| Method | Description |
|--------|-------------|
| `updatePosition()` | Recalculate and apply position |
| `setOptions({ placement, offsetDistance })` | Update placement/offset, then reposition |
| `resetPosition()` | Clear all positioning styles |
| `cleanupEvents()` | Remove window listeners and clear styles |

### CSS Custom Properties

Set on the popper element during positioning:

| Property | Description |
|----------|-------------|
| `--fx-popper-placement-x` | Computed `left` in px |
| `--fx-popper-placement-y` | Computed `top` in px |
| `--trigger-width` | Reference element width in px |

The popper also receives `data-show-placement` reflecting the resolved placement (may differ from requested if a flip occurred).

### Required CSS

```css
.myPopper {
  position: fixed; /* or absolute if within a relative parent */
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
}
```

Or use the `ui-popper` utility class (from UnoCSS preset or Tailwind plugin).

## CreateOverlay

Higher-level wrapper that adds trigger management, click-outside/Escape closing, and lifecycle callbacks on top of `CreatePopper`.

```js
import { CreateOverlay } from "flexipop/create-overlay";

const overlay = new CreateOverlay({
  trigger: "#myTrigger",
  content: "#myContent",
  options: {
    triggerStrategy: "click",
    placement: "bottom",
    offsetDistance: 10,
  },
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `triggerStrategy` | `"click"` \| `"hover"` \| `"manual"` | `"click"` | How the overlay is triggered |
| `placement` | `Placement` | `"bottom"` | Popper placement |
| `offsetDistance` | `number` | `6` | Gap in px |
| `defaultState` | `"open"` \| `"close"` | `"close"` | Initial state |
| `preventFromCloseOutside` | `boolean` | `false` | Prevent close on outside click |
| `preventCloseFromInside` | `boolean` | `false` | Prevent close on inside click |
| `readjustHeight` | `boolean` | `false` | Adjust maxHeight to fit viewport |
| `minHeight` | `number` | `140` | Min height when readjustHeight is active |
| `popper.eventEffect` | `{ disableOnScroll?, disableOnResize? }` | — | Repositioning control |
| `beforeShow` | `() => void` | — | Called before show |
| `beforeHide` | `() => { cancelAction?: boolean } \| void` | — | Called before hide, can cancel |
| `onShow` | `() => void` | — | Show callback |
| `onHide` | `() => void` | — | Hide callback |
| `onToggle` | `({ isHidden }) => void` | — | Toggle callback |

### Trigger Strategies

| Strategy | Behavior |
|---|---|
| `click` *(default)* | Toggle on trigger click, close on outside click / Escape |
| `hover` | Open on mouseenter, close on mouseleave (with delay). Also toggles on click. |
| `manual` | No trigger events. Control entirely via `show()` / `hide()`. |

### Methods

| Method | Description |
|--------|-------------|
| `show()` | Show overlay (position, attach listeners, trigger callbacks) |
| `hide()` | Hide overlay (respects `beforeHide` cancellation) |
| `setShowOptions({ placement, offsetDistance })` | Show with updated positioning |
| `setPopperOptions({ placement, offsetDistance })` | Update positioning without showing |
| `setPopperTrigger(trigger, { placement?, offsetDistance? })` | Swap trigger element |
| `refreshPopper()` | Recalculate position (call when trigger moves or content resizes) |
| `cleanup()` | Remove all listeners and clean up popper |

### Cancelable Hide

`beforeHide` returning `{ cancelAction: true }` prevents closing. A `before-hide` custom event is also dispatched on the content element — call `event.detail.setExitAction(true)` to cancel.

## When to Use Which

- **`CreatePopper`** — you only need positioning (custom tooltip with your own event handling, or building a component from scratch)
- **`CreateOverlay`** — you need trigger management, click-outside closing, and lifecycle hooks (used internally by Dropdown, Popover, Tooltip, Select, Autocomplete)

Most users will never instantiate these directly — they use the higher-level component packages. But understanding Flexipop is useful when debugging positioning issues or building custom overlay components.