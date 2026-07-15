# Custom Range

Package: `@flexilla/custom-range` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-custom-range]`

Adds a visual fill indicator to `<input type="range">` elements.

## Structure

```html
<div data-fx-custom-range data-range-indicator="bg-primary h-full rounded">
  <input type="range" data-input-range min="0" max="100" value="50" />
  <span class="range-indicator"></span>
</div>
```

The `data-range-indicator` attribute accepts CSS class names for the indicator span. An indicator element inside the wrapper is optional — the component creates one if missing.

## Options

| Option | Type | Description |
|--------|------|-------------|
| `rangeIndicator` | `string` | CSS class string for the indicator span |

Pass via `data-range-indicator` attribute or as second constructor argument.

## JS Initialization

```js
import { CustomRange } from "@flexilla/custom-range";

new CustomRange('[data-custom-range-wrapper]');
// or
CustomRange.autoInit();
```

## Methods

| Method | Description |
|--------|-------------|
| `cleanup()` | Remove event listeners |

## Events

No custom events emitted.

## Avoid

Do not use this component on non-range inputs. Only `<input type="range">` is supported.
