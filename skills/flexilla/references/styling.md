# Styling Guide

Flexilla is headless — it does not ship visual styles. You control all presentation using the `data-*` attributes that Flexilla manages.

## Common State Attributes

| Attribute | Values | Set on | Used by |
|-----------|--------|--------|---------|
| `data-state` | `"open"` / `"close"` | content elements | All components |
| `data-state` | `"active"` / `"inactive"` | tab panels | Tabs |
| `aria-expanded` | `"true"` / `"false"` | triggers | Accordion, Collapse, Dropdown, Popover, Tooltip |
| `aria-hidden` | `"true"` / `"false"` | content | Modal, Offcanvas |

## Pure CSS

Use attribute selectors to style states:

```css
[data-state="open"] {
  display: block;
}
[data-state="close"] {
  display: none;
}

/* Accordion content animation */
[data-accordion-content] {
  overflow: hidden;
  transition: height 0.2s ease;
  height: 0;
}
[data-accordion-content][data-state="open"] {
  height: auto;
}

/* Popper positioning */
.ui-popper {
  position: fixed;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
}
```

## Tailwind CSS v4

Define custom variants in your CSS:

```css
@import "tailwindcss";

@custom-variant fx-open (&[data-state="open"]);
@custom-variant fx-close (&[data-state="close"]);
@custom-variant fx-active (&[data-state="active"]);

@utility ui-popper {
  position: fixed;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
}
@utility ui-overlay {
  @apply fixed inset-0 z-40;
}
@utility ui-animated-modal-content {
  animation: var(--un-modal-animation);
  animation-fill-mode: both;
}
```

Usage:
```html
<div class="hidden fx-open:block ui-popper">...</div>
```

For Tailwind CSS v3, use the `@flexilla/tailwind-plugin` package which provides `fx-open:`, `fx-active:`, `fx-not-*:` variants and `ui-popper`, `ui-overlay`, `ui-tabs-indicator` utilities.

## UnoCSS

Use the `@unifydev/flexilla` preset:

```ts
// uno.config.ts
import { flexillaPreset } from "@unifydev/flexilla"
import { presetUno } from "unocss"

export default defineConfig({
  presets: [presetUno(), flexillaPreset()]
})
```

Provides these variants:

| Variant | CSS Equivalent |
|---------|---------------|
| `fx-open:*` | `&[data-state="open"]` |
| `fx-close:*` | `&[data-state="close"]` |
| `fx-active:*` | `&[data-state="active"]` |
| `fx-visible:*` | `&[data-visible]` |
| `group-fx-open:*` | `.group[data-state="open"] &` |
| `peer-fx-open:*` | `.peer[data-state="open"] ~ &` |

And these utilities:

| Utility | CSS |
|---------|-----|
| `ui-popper` | `position: fixed; top: var(--fx-popper-placement-y); left: var(--fx-popper-placement-x);` |
| `ui-overlay` | `position: fixed; inset: 0; z-index: 40;` |
| `ui-tabs-indicator` | Animated tab indicator positioning |
| `ui-animated-tab-panel` | Panel show/hide animation support |
| `ui-animated-modal-content` | Modal enter/exit animation support |

## Flexipop Positioning

Components that use Flexipop (Dropdown, Popover, Tooltip, Select, Autocomplete) need:

```css
.content-element {
  position: fixed;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
}
```

For absolute positioning (within a relative parent):
```css
.content-element {
  position: absolute;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
}
```

## Animation Pattern

Modal content enter/exit:
```css
.modal-content {
  animation: var(--un-modal-animation);
  animation-fill-mode: both;
}
```

Configure via `animateContent` option or `data-enter-animation` / `data-exit-animation` attributes.
