# Select

Package: `@flexilla/select` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-select]`
Popper: Yes

DOM binding layer for `@flexilla/select-core`. A full-featured dropdown select with search, keyboard navigation, multiple selection, summary modes, and custom templates.

## Structure

```html
<div data-fx-select>
  <button data-select-trigger data-select-id="demo">
    <span data-selected-value data-select-id="demo">
      <template data-selected-model>
        <span data-bind="label"></span>
      </template>
    </span>
  </button>
  <input type="hidden" data-select-value data-select-id="demo" />
  <div data-select-content data-select-id="demo" data-placement="bottom-start">
    <input type="text" data-select-input data-select-id="demo" placeholder="Search..." />
    <template data-select-empty>
      <div class="p-2 text-sm opacity-60">No results</div>
    </template>
    <ul>
      <li data-select-item="vue" data-label="Vue.js">Vue.js</li>
      <li data-select-item="react" data-label="React">React</li>
      <li data-select-item="svelte" data-label="Svelte">Svelte</li>
    </ul>
  </div>
</div>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `defaultValue` | `string` | — | Default selected value(s) |
| `filter` | `(query, item) => boolean` | defaultFilter | Custom filter |
| `searchDebounce` | `number` | — | Search debounce in ms |
| `placement` | `Placement` | — | Popper placement |
| `offsetDistance` | `number` | — | Gap |
| `preventFromCloseOutside` | `boolean` | — | Keep open on outside click |
| `preventCloseFromInside` | `boolean` | — | Keep open on inside click |
| `readjustHeight` | `boolean` | — | Auto-adjust height to viewport |
| `minHeight` | `number` | — | Min height |
| `summary` | `SelectSummaryOptions` | — | Summary display config |

### Summary Modes

Use `data-select-summary-mode` on `data-selected-value`:

| Mode | Description |
|------|-------------|
| `"chips"` | Render inline `<template data-selected-model>` as chips |
| `"count"` | Show count (e.g., "3 selected") — uses `data-select-summary-count-singular` / `data-select-summary-count-plural` |
| `"compact"` | Show truncated list — uses `data-select-summary-limit` / `data-select-summary-compact-text` |

## Methods (implements SelectCore)

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Open/close/toggle dropdown |
| `select(value)` / `unselect(value)` / `clear()` | Manage selection |
| `highlightNext()` / `highlightPrev()` / `highlight(index)` | Navigate items |
| `setSearch(query)` | Programmatically set search |
| `registerItem(item)` / `unregisterItem(value)` | Dynamic item management |
| `getItem(value)` / `hasItem(value)` | Check items |
| `getState()` | Get current state |
| `subscribe(listener)` | Subscribe to state changes |
| `cleanup()` | Remove listeners |

## CSS

Content element needs popper positioning (`ui-popper` class or manual `position: fixed; top/left: var(--fx-popper-placement-*)`).

## Notes

- Clear button: `data-select-clear` / `data-select-clear-all`
- Remove button (multi): `data-select-remove`
- Template bindings: `data-bind="label"`, `data-bind="initials"`, `data-bind-style="badgeStyle"`

## Avoid

Do not use `data-autocomplete-id` or `data-autocomplete-*` attributes with `@flexilla/select` — those are for Autocomplete. Select uses `data-select-id` and `data-select-*` attributes only.
