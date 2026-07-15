# Things to Avoid

## General

1. **Do not invent components, options, data-attributes, or methods** that don't exist in Flexilla. Always refer to the skill files or public docs at `https://flexilla.unoforge.com`.

2. **Do not use web component syntax** — Flexilla is not a web components library. Use HTML elements with `data-*` attributes, not `<fx-accordion>` custom tags or `is="fx-dropdown"`.

3. **Do not skip `data-*` connection attributes** — each component requires specific data attributes to link triggers, content, and options.

4. **Do not forget CSS** — Flexilla is headless. A component will work (change attributes) but will be invisible without CSS for `data-state` selectors.

5. **Do not invent `variant`, `intent`, `size`, `color`, or `theme` options** — those are design system concepts. Flexilla components have no visual variants.

## Per-Component

### Accordion
- ❌ Do not invent `disabled` or `collapsible` item-level options. They don't exist.
- ❌ Do not use accordion for single collapsible items — use `@flexilla/collapse`.

### Autocomplete
- ❌ Do not use `data-autocomplete-*` for Select. Autocomplete has its own attribute namespace.
- ❌ Do not use Autocomplete when you don't need search filtering. Use `@flexilla/select` instead.

### Collapse
- ❌ Do not use Collapse for linked/accordion-style sections. Use `@flexilla/accordion`.

### Dropdown
- ❌ Do not use Dropdown for searchable select lists. Use `@flexilla/select`.
- ❌ Do not use Dropdown for simple hover tooltips. Use `@flexilla/tooltip`.

### Modal
- ❌ Do not use `<div role="dialog">` instead of `<dialog>`. Flexilla Modal requires the native `<dialog>` element.
- ❌ Do not invent a `size`, `fullscreen`, or `centered` option. Modal handles positioning via your CSS.

### Offcanvas
- ❌ Do not use Offcanvas for centered dialogs. Use `@flexilla/modal` for overlays that appear in the center.
- ❌ Do not invent `position` or `side` options — the side is controlled by your CSS (translate, left, right, top, bottom transforms).

### Pin Input
- ❌ Do not use PinInput for regular text inputs. Each input must have `maxlength="1"`.
- ❌ Do not use `<input type="number">` — use `type="text"` with a validation regex or `inputmode="numeric"`.

### Popover
- ❌ Do not use Popover for tooltips. Use `@flexilla/tooltip`.

### Select
- ❌ Do not use `data-autocomplete-id` on Select components. Select uses `data-select-id`.
- ❌ Do not use Select with `<select>` elements. Flexilla Select replaces native selects with custom markup.

### Tabs
- ❌ Do not use `<a href="#tab1">` for tab activation. Use `data-target="tab1"` instead.
- ❌ Do not use Tabs for accordion-style content. Use `@flexilla/accordion`.

### Tooltip
- ❌ Do not use Tooltip for rich interactive content. It's for short labels and descriptions.
- ❌ Do not use Tooltip with `triggerStrategy: "click"` unless you have a specific reason. Default is hover.

### Toast
- ❌ Do not add `data-*` attributes to your markup — Toast is a function API, not a DOM-trigger component.
- ❌ Do not import any CSS file — all styles are encapsulated in a Shadow DOM.
- ❌ Do not use `new Toast()` — the class export uses **static methods** only (`Toast.success()`, `Toast.error()`). There is no instance API.
- ❌ Do not try to style toast elements with external CSS — Shadow DOM encapsulates all styles. Use `toast.config()` instead.
- ❌ Do not forget to pass `{ id }` when updating a loading toast — without it, a new toast is created instead of replacing the existing one.
