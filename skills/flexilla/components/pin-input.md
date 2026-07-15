# Pin Input

Package: `@flexilla/pin-input` (also available via `@flexilla/flexilla`)
Auto-init: `fx-pin-input` (tag/attribute name, not `data-fx-*`)

PIN/OTP input with automatic focus movement, paste support, and keyboard navigation.

## Structure

```html
<div class="flex gap-2" fx-pin-input>
  <input type="text" data-pin-input maxlength="1" class="w-10 h-10 text-center" />
  <input type="text" data-pin-input maxlength="1" class="w-10 h-10 text-center" />
  <input type="text" data-pin-input maxlength="1" class="w-10 h-10 text-center" />
  <input type="text" data-pin-input maxlength="1" class="w-10 h-10 text-center" />
</div>
```

Note: PinInput's `autoInit()` uses `fx-pin-input` (a bare attribute/tag name) as its default selector — not the usual `data-fx-*` pattern. Add `fx-pin-input` to the wrapper element for auto-init to find it. For manual init, any selector works.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `validation` | `RegExp` | `/.*/` | Regex to validate each character |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` (getter) | Current full PIN string |
| `isComplete` | `boolean` (getter) | Whether all inputs are filled |

## Methods

| Method | Description |
|--------|-------------|
| `onChange(callback)` | Listen for value changes |
| `cleanup()` | Remove event listeners |

## JS Initialization

```js
import { PinInput } from "@flexilla/pin-input";

// manual — both forms are equivalent
new PinInput("#my-pin-input", { validation: /^[0-9]$/ });
// or
PinInput.init("#my-pin-input", { validation: /^[0-9]$/ });

// auto
PinInput.autoInit(); // scans for [fx-pin-input] elements
```

## Avoid

Do not use PinInput for regular text inputs. It is specifically designed for one-character-per-field OTP/PIN flows. Each `<input>` must have `maxlength="1"`.
