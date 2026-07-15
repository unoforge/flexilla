# Autocomplete

Package: `@flexilla/autocomplete` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-autocomplete]`
Popper: Yes

Builds on `@flexilla/select-core` for searchable autocomplete with popover positioning.

## Structure

```html
<div data-fx-autocomplete>
  <input type="text" data-select-input data-autocomplete-id="myAuto" />
  <input type="hidden" data-autocomplete-value data-select-id="myAuto" />
  <div data-select-content data-select-id="myAuto" data-placement="bottom-start">
    <template data-select-empty>
      <div class="p-2 text-sm opacity-60">No results found</div>
    </template>
    <ul>
      <li data-select-item="vue" data-label="Vue">Vue</li>
      <li data-select-item="react" data-label="React">React</li>
      <li data-select-item="svelte" data-label="Svelte">Svelte</li>
    </ul>
  </div>
  <div data-selected-value data-select-id="myAuto">
    <template data-selected-model>
      <span data-bind="label"></span>
    </template>
  </div>
</div>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `defaultValue` | `string` | — | Default selected value |
| `filter` | `(query, item) => boolean` | defaultFilter | Custom filter function |
| `searchDebounce` | `number` | — | Debounce search in ms |
| `placement` | `Placement` | — | Popover placement |
| `offsetDistance` | `number` | — | Gap between input and popover |
| `preventFromCloseOutside` | `boolean` | — | Keep open on outside click |
| `preventCloseFromInside` | `boolean` | — | Keep open on inside click |
| `readjustHeight` | `boolean` | — | Auto-adjust height to viewport |
| `minHeight` | `number` | — | Min height when readjusting |

## Methods (implements SelectCore)

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Open/close/toggle popover |
| `select(value)` / `unselect(value)` / `clear()` | Manage selection |
| `highlightNext()` / `highlightPrev()` / `highlight(index)` | Navigate items |
| `setSearch(query)` | Programmatically set search |
| `registerItem(item)` / `unregisterItem(value)` | Dynamic item management |
| `getItem(value)` / `hasItem(value)` | Check items |
| `getState()` | Get current state object |
| `subscribe(listener)` | Subscribe to state changes |
| `cleanup()` | Remove listeners |

## CSS

The content element needs popper positioning:
```css
position: fixed;
top: var(--fx-popper-placement-y);
left: var(--fx-popper-placement-x);
```
Or use the `ui-popper` utility class.

## Notes

- Use `data-select-summary-mode="chips"` on `data-selected-value` for chip-style display
- Multi-select: set `data-multiple` on trigger or `multiple: true` in options
- Clear button: `data-select-clear` / `data-select-clear-all`
- Remove button (multi): `data-select-remove`

## Avoid

Do not use `@flexilla/autocomplete` for basic select behavior — use `@flexilla/select` instead. Autocomplete is specifically for search-first, input-driven selection.
