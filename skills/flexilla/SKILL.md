---
name: flexilla
description: Use this skill when an AI assistant needs to help someone use Flexilla, a headless, framework-agnostic library for interactive UI components (accordion, tabs, dropdown, modal, tooltip, etc.).
license: MIT
---

# Flexilla Skill

Flexilla is a headless, framework-agnostic JavaScript library for interactive UI components. It gives you behavior, state management, and accessibility wiring while you control the markup and styling.

## Goal

Help users build accurate Flexilla integrations without inventing components, options, HTML attributes, or CSS patterns that don't exist.

## How Flexilla Works

Flexilla has three parts working together:

1. **Your HTML** — semantic markup with `data-*` attributes for structure
2. **Flexilla's JavaScript** — behavior, state management, accessibility
3. **Your CSS** — styling driven by `data-state`, `aria-expanded`, and component-specific attributes

## Source of truth

Use the files in this skill first.

- [references/best-practices.md](./references/best-practices.md) — verified usage rules and source-of-truth guidance
- [references/styling.md](./references/styling.md) — CSS, Tailwind CSS v4, and UnoCSS styling approaches
- [references/utilities.md](./references/utilities.md) — shared utilities (theme, keyboard nav, toggler, etc.)
- [references/flexipop.md](./references/flexipop.md) — positioning engine (CreatePopper, CreateOverlay, placements, CSS vars)
- [references/things-to-avoid.md](./references/things-to-avoid.md) — common mistakes and invented APIs

Component files:
- [components/accordion.md](./components/accordion.md)
- [components/autocomplete.md](./components/autocomplete.md)
- [components/auto-resize-area.md](./components/auto-resize-area.md)
- [components/collapse.md](./components/collapse.md)
- [components/custom-range.md](./components/custom-range.md)
- [components/dismissible.md](./components/dismissible.md)
- [components/dropdown.md](./components/dropdown.md)
- [components/modal.md](./components/modal.md)
- [components/offcanvas.md](./components/offcanvas.md)
- [components/pin-input.md](./components/pin-input.md)
- [components/popover.md](./components/popover.md)
- [components/select-core.md](./components/select-core.md) — headless state engine (no DOM)
- [components/select.md](./components/select.md)
- [components/tabs.md](./components/tabs.md)
- [components/tooltip.md](./components/tooltip.md)

## Working Rules

1. Never invent components, options, data-attributes, or methods not present in these skill files or the public docs at `https://flexilla.unoforge.com`.
2. Prefer the data-attribute auto-init pattern for simple cases. Use JS instantiation only when options are needed.
3. Flexilla is headless — always tell the user they need to write CSS for open/close states.
4. When a component uses Flexipop for positioning, mention the required CSS: `position: fixed; top: var(--fx-popper-placement-y); left: var(--fx-popper-placement-x);` (or the `ui-popper` utility class).
5. Components that need styles for state changes use `data-state="open"` / `data-state="close"` and `aria-expanded="true"` / `aria-expanded="false"`.
6. All components support dual initialization: `new Component(selector, options)` and `Component.autoInit()`.

## Installation

### Full library
```bash
npm i @flexilla/flexilla
```

### Individual packages
```bash
npm i @flexilla/accordion
npm i @flexilla/modal
npm i @flexilla/dropdown
# etc.
```

## Initialization Patterns

### Manual (JS instantiation)
```js
import { Accordion } from "@flexilla/accordion";
const accordion = new Accordion("#my-accordion", { accordionType: "multiple" });
```

### Auto init (data-attribute driven)
```js
import { Accordion } from "@flexilla/accordion";
Accordion.autoInit(); // scans for [data-fx-accordion]
```

All components follow this pattern with their own `[data-fx-*]` selector.

## Component Overview

### Disclosure
| Component | Package | Auto-init selector | Popper? |
|-----------|---------|-------------------|---------|
| Accordion | `@flexilla/accordion` | `[data-fx-accordion]` | No |
| Collapse | `@flexilla/collapse` | `[data-fx-collapse]` | No |

### Overlays
| Component | Package | Auto-init selector | Popper? |
|-----------|---------|-------------------|---------|
| Modal | `@flexilla/modal` | `[data-fx-modal]` | No |
| Offcanvas | `@flexilla/offcanvas` | `[data-fx-offcanvas]` | No |
| Dropdown | `@flexilla/dropdown` | `[data-fx-dropdown]` | Yes |
| Popover | `@flexilla/popover` | `[data-fx-popover]` | Yes |
| Tooltip | `@flexilla/tooltip` | `[data-fx-tooltip]` | Yes |

### Navigation
| Component | Package | Auto-init selector | Popper? |
|-----------|---------|-------------------|---------|
| Tabs | `@flexilla/tabs` | `[data-fx-tabs]` | No |

### Forms
| Component | Package | Auto-init selector |
|-----------|---------|-------------------|
| Select | `@flexilla/select` | `[data-fx-select]` |
| Select Core (headless) | `@flexilla/select-core` | N/A (no DOM) |
| Autocomplete | `@flexilla/autocomplete` | `[data-fx-autocomplete]` |
| Pin Input | `@flexilla/pin-input` | `fx-pin-input` (tag name) |
| Auto Resize Textarea | `@flexilla/auto-resize-area` | `[data-fx-autoresize]` |

### Utilities
| Component | Package | Auto-init selector |
|-----------|---------|-------------------|
| Custom Range | `@flexilla/custom-range` | `[data-fx-custom-range]` |
| Dismissible | `@flexilla/dismissible` | `[data-fx-dismissible]` |

### Infrastructure
| Package | Description | Used by |
|---------|-------------|---------|
| `flexipop` | Positioning engine (`CreatePopper`, `CreateOverlay`) | Dropdown, Popover, Tooltip, Select, Autocomplete |
| `@flexilla/select-core` | Headless state engine for select-like components | Select, Autocomplete |

## Answering Pattern

1. **Identify the component** needed.
2. **Open the relevant component file** from `components/*.md`.
3. **Give the smallest working example** with HTML structure, CSS for states, and JS initialization.
4. **Call out important options** — placement, trigger strategy, animation, etc.
5. **Add one short "avoid" note** when there is a common mistake.

### Example Answer (good)

> To add a dropdown:
> ```html
> <button data-dropdown-trigger data-dropdown-id="myDropdown">Open</button>
> <div id="myDropdown" class="ui-popper">Dropdown content</div>
> ```
> ```js
> import { Dropdown } from "@flexilla/dropdown";
> new Dropdown("#myDropdown", { placement: "bottom" });
> ```
> CSS needed: `#myDropdown { display: none; } #myDropdown[data-state="open"] { display: block; }`
> Key options: `triggerStrategy` (click|hover), `placement`, `offsetDistance`.
> Avoid: Do not invent a `variant` option — dropdowns have no variants.

### Example Answer (bad)

> Use `<div is="fx-dropdown" variant="primary">`.
> ❌ Flexilla uses data attributes, not web component `is` syntax. There is no `variant` option.

## Common Data-Attribute Conventions

| Attribute | Purpose |
|-----------|---------|
| `data-fx-{component}` | Auto-init target (e.g., `data-fx-accordion`) |
| `data-state` | Open/close state (`"open"` or `"close"`) — Tabs use `"active"` / `"inactive"` for panels |
| `data-fx-popper` | Identifies popper target elements |
| `data-default-value` | Default selected/active item |
| `data-placement` | Popper placement (e.g., `"bottom-start"`) |
| `data-offset-distance` | Gap in px between trigger and content |
| `data-prevent-close-inside` | Prevent close on inside click |
| `data-prevent-close-outside` | Prevent close on outside click |

## UnoCSS / Tailwind Variants

When using `@unifydev/flexilla` (UnoCSS) or `@flexilla/tailwind-plugin`:
- `fx-open:*` — applied when `data-state="open"`
- `fx-close:*` — applied when `data-state="close"`
- `fx-active:*` — applied when item is active (tabs, accordion)
- `fx-visible:*` — applied when element is visible
- `ui-popper` — utility class with fixed positioning and popper CSS vars
- `ui-overlay` — utility class for overlay/backdrop

## Loading Files

Do not load everything at once. Read only the files relevant to the current task. See the component overview above to find the right file.
