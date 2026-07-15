# Toast

Package: `@flexilla/toast`
Auto-init: None — Toast is a function API, not a DOM-trigger component.
Popper: No
CSS required: None — styles are injected into a Shadow DOM.

A lightweight, framework-agnostic toast notification component inspired by Sonner.
Unlike other Flexilla components, Toast is **not** a DOM-trigger component — there are no `data-*` attributes to add to your markup.
Everything happens through the JavaScript API.

All styles are encapsulated in a Shadow DOM. You do **not** need any CSS, Tailwind plugin, or UnoCSS preset.

## Installation

```bash
npm i @flexilla/toast
```

## Usage

```js
import toast from "@flexilla/toast";

// simplest call
toast("Event has been created.");

// typed variants
toast.success("Settings saved!");
toast.error("Something went wrong.");
toast.warning("Please review.");
toast.info("New version available.");
toast.loading("Processing…");   // auto-dismiss disabled
```

The `toast()` function returns a string|number ID that can be used to update or dismiss the toast later.

## Structure

No HTML markup is needed. Toast renders into its own shadow DOM container (`<div data-fx-toasters>` appended to `document.body`).

## Options

### Global config (`toast.config`)

```js
toast.config({
  position: "bottom-right",
  duration: 4000,
  richColors: true,
  closeButton: true,
  expand: false,
  visibleToasts: 3,
  offset: 24,
  gap: 14,
});
```

### Per-toast options

Pass as the second argument to any `toast.*()` call:

```js
toast.success("Hello!", {
  description: "Secondary text",
  duration: 10000,
  position: "top-center",
  closeButton: true,
  id: "my-custom-id",
  action: { label: "Undo", onClick: (e) => {} },
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | `"top-right"` \| `"top-left"` \| `"top-center"` \| `"bottom-right"` \| `"bottom-left"` \| `"bottom-center"` | `"bottom-right"` | Toaster position |
| `duration` | `number` | `3000` | Auto-dismiss delay in ms. `0` or `Infinity` = no auto-dismiss |
| `closeButton` | `boolean` | `false` | Show close button |
| `richColors` | `boolean` | `false` | Full background colors for typed toasts |
| `expand` | `boolean` | `false` | Expand stack instead of scale-down |
| `visibleToasts` | `number` | `3` | Max visible toasts at once |
| `offset` | `number` | `24` | Distance from viewport edge in px |
| `mobileOffset` | `number` | `16` | Offset on mobile |
| `gap` | `number` | `14` | Gap between stacked toasts in px |
| `description` | `string` | — | Secondary text under the title |
| `id` | `string \| number` | auto-generated | Custom ID — matching an existing ID replaces that toast |
| `action` | `{ label: string, onClick: (e: MouseEvent) => void, cancel?: boolean }` | — | Action button |

## Methods (function API)

| Method | Description | Returns |
|--------|-------------|---------|
| `toast(message, options?)` | Show a default toast (no icon) | toast ID |
| `toast.message(message, options?)` | Same as `toast()` — no icon | toast ID |
| `toast.show(message, options?)` | Alias for `toast.message()` | toast ID |
| `toast.success(message, options?)` | Success toast with check icon | toast ID |
| `toast.error(message, options?)` | Error toast with X icon | toast ID |
| `toast.warning(message, options?)` | Warning toast | toast ID |
| `toast.info(message, options?)` | Info toast | toast ID |
| `toast.loading(message, options?)` | Loading toast with spinner — auto-dismiss disabled | toast ID |
| `toast.promise(promise, data)` | Loading → success/error automatically | void |
| `toast.dismiss(id?)` | Dismiss toast by ID, or all if no argument | void |
| `toast.config(options)` | Set default options for all future toasts | void |

## `toast.promise()`

```js
toast.promise(
  myAsyncFunction(),
  {
    loading: "Loading data…",
    success: (data) => `Got ${data}!`,   // string or (data) => string
    error: "Something went wrong.",       // string or (err) => string
    description: "Please wait",          // optional, string or (data) => string
    finally: () => console.log("done"),  // optional
  }
);
```

## Class API

For projects that prefer a class-based import, `Toast` is also exported:

```js
import { Toast } from "@flexilla/toast";

Toast.success("Hello!");
Toast.error("Oops.");
Toast.dismiss();
Toast.config({ richColors: true });
```

All static methods mirror the function-based API.

## Stacking & Expand

When multiple toasts are visible, they stack with a scale-down effect — only the front toast is fully visible.
Hovering the toast area expands the stack.
This is automatic — no configuration needed.

## Swipe to Dismiss

Toasts can be dismissed by swiping horizontally or vertically.
Swipe direction locks after 10px of movement. Swiping back toward the origin cancels the dismissal.
Enabled by default on toasts with a non-zero `duration`.

## How It Works

- Toast container: `<div data-fx-toasters>` appended to `document.body`
- Shadow DOM with `mode: "open"` is attached to the container
- All CSS is injected via a `<style>` element inside the shadow root
- Each toast is an `<li>` inside an `<ol data-fx-toaster>` positioned via `position: fixed`
- The toaster auto-removes from the DOM when all toasts are dismissed

## Avoid

- ❌ Do not add `data-*` attributes to your markup — Toast is a function API, not a DOM-trigger component.
- ❌ Do not import any CSS file — all styles are encapsulated in the Shadow DOM.
- ❌ Do not use `new Toast()` — the class export uses **static methods** only (`Toast.success()`, `Toast.error()`, etc.). There is no instance API.
- ❌ Do not try to style toast elements with external CSS — Shadow DOM encapsulates all styles. Use `toast.config()` for built-in customization (position, rich colors, etc.).