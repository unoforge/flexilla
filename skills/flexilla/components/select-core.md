# Select Core

Package: `@flexilla/select-core`
Popper: No (headless — no DOM, no positioning)

Headless state engine for select-like components. Pure logic, zero runtime dependencies, no DOM. Manages open state, highlighted index, selected values, search query, and an item registry with O(1) Map-based lookups. Used internally by `@flexilla/select` and `@flexilla/autocomplete`.

## When to Use

- You need select/autocomplete state logic without DOM coupling (e.g., wrapping for React/Vue/Svelte)
- You want full control over rendering and positioning
- For standard use cases, prefer `@flexilla/select` or `@flexilla/autocomplete` — they wire the DOM for you

## Create Instance

```js
import { createSelectCore } from "@flexilla/select-core";

const select = createSelectCore({ multiple: false });
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple selected values |

## Types

```ts
type SelectItem = {
  value: string;
  label?: string;
  disabled?: boolean;
  data?: Record<string, string>;
};

type SelectState = {
  open: boolean;
  highlightedIndex: number | null;
  selectedValues: string[];
  search: string;
  items: SelectItem[];
};
```

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Set `open: true` |
| `close()` | Set `open: false` |
| `toggle()` | Toggle `open` |
| `select(value)` | Add value to selectedValues (replaces in single mode) |
| `unselect(value)` | Remove value from selectedValues |
| `clear()` | Clear all selected values |
| `toggleValue(value)` | Toggle selection of a value (respects `multiple`) |
| `highlightNext()` | Highlight next enabled item (circular) |
| `highlightPrev()` | Highlight previous enabled item (circular) |
| `highlight(index)` | Set highlighted index explicitly (or `null`) |
| `setSearch(query)` | Set search string |
| `registerItem(item)` | Add/update an item in the registry |
| `unregisterItem(value)` | Remove an item from the registry |
| `getItem(value)` | O(1) lookup by value |
| `hasItem(value)` | O(1) existence check |
| `getState()` | Get current state snapshot |
| `subscribe(listener)` | Listen for state changes — returns unsubscribe function |

## Usage Pattern

```js
const select = createSelectCore({ multiple: false });

// Register items
select.registerItem({ value: "apple", label: "Apple" });
select.registerItem({ value: "banana", label: "Banana", disabled: true });
select.registerItem({ value: "cherry", label: "Cherry" });

// Subscribe to changes
const unsubscribe = select.subscribe((state) => {
  console.log("open:", state.open);
  console.log("selected:", state.selectedValues);
  console.log("highlighted:", state.highlightedIndex);
  console.log("search:", state.search);
});

// Interact
select.open();
select.highlightNext();
select.select("apple");
select.setSearch("ch");
select.clear();
select.close();

// Cleanup
unsubscribe();
```

## Shared DOM Utilities

`@flexilla/select-core` also exports DOM helpers used by the DOM-binding packages:

| Export | Description |
|--------|-------------|
| `defaultFilter` | Case-insensitive label/value includes filter |
| `getBooleanAttr(el, attr)` | Read boolean data attribute |
| `getNumberAttr(el, attr)` | Read numeric data attribute |
| `setItemVisibility(el, visible)` | Toggle `data-hidden` on item elements |
| `parseDefaultValues(str)` | Split comma-separated values |
| `serializeSelectedValues(arr)` | Join selected values with commas |
| `collectItemData(el, omitKeys?)` | Extract dataset as object |
| `resolveOverlayOptions(...)` | Resolve overlay config from data attributes + options |

## Selector Constants

| Constant | Selector |
|----------|----------|
| `SELECT_TRIGGER` | `[data-select-trigger]` |
| `SELECT_ITEM` | `[data-select-item]` |
| `SELECT_INPUT` | `[data-select-input]` |
| `SELECT_VALUE` | `[data-select-value]` |
| `SELECT_HIDDEN_VALUE` | `[data-select-hidden-value]` |
| `SELECT_CLEAR` | `[data-select-clear]` |
| `SELECT_CLEAR_ALL` | `[data-select-clear-all]` |
| `SELECT_REMOVE` | `[data-select-remove]` |
| `AUTOCOMPLETE_HIDDEN_VALUE` | `[data-autocomplete-value]` |

## Avoid

- Do not use `select-core` directly if you just need a dropdown select — use `@flexilla/select`
- Do not use `select-core` for autocomplete — use `@flexilla/autocomplete`
- Do not mutate the state object returned by `getState()` directly — always use the methods