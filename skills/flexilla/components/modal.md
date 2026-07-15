# Modal

Package: `@flexilla/modal` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-modal]`

A customizable modal dialog using the `<dialog>` element with overlay, animations, stacked modals, and focus locking.

## Structure

```html
<button data-modal-target="myModal">Open Modal</button>

<dialog data-fx-modal data-modal-id="myModal" role="dialog" aria-hidden="true">
  <div data-modal-overlay class="ui-overlay"></div>
  <div data-modal-content class="modal-content">
    <button data-close-modal aria-label="Close">X</button>
    <p>Modal content here</p>
  </div>
</dialog>
```

The overlay can be either a child element with `data-modal-overlay`, or specified as a class via the `overlayClass` option / `data-modal-overlay` attribute on the dialog.

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `defaultState` | — | `"open"` \| `"close"` | `"close"` | Initial state |
| `animateContent` | `data-enter-animation`, `data-exit-animation` | `{ enterAnimation, exitAnimation? }` | — | CSS animation for content |
| `overlayClass` | `data-modal-overlay` | `string` | — | Class for overlay element |
| `preventCloseModal` | — | `boolean` | `false` | Disable ESC/outside click close |
| `allowBodyScroll` | — | `boolean` | `false` | Allow body scroll when open |
| `enableStackedModals` | — | `boolean` | `false` | Allow multiple modals stacked |
| `dispatchEventToDocument` | — | `boolean` | `true` | Dispatch events to document |
| `beforeHide` | — | `() => { cancelAction? } \| void` | — | Cancel hide by returning `{ cancelAction: true }` |
| `onShow` | — | `() => void` | — | Show callback |
| `onHide` | — | `() => void` | — | Hide callback |
| `onToggle` | — | `({ isHidden }) => void` | — | Toggle callback |

### animateContent

Requires CSS on the content element:
```css
.modal-content {
  animation: var(--un-modal-animation);
  animation-fill-mode: both;
}
```

Data attribute usage:
```html
<div data-modal-content
  data-enter-animation="slideIn .4s linear"
  data-exit-animation="slideOut .2s linear">
</div>
```

## Methods

| Method | Description |
|--------|-------------|
| `showModal()` | Open the modal |
| `hideModal()` | Close the modal |
| `setOptions({ state?, allowBodyScroll? })` | Update options |
| `cleanup()` | Remove listeners |

## Events

| Event | Description |
|-------|-------------|
| `modal-open` | Fired when modal opens |
| `modal-close` | Fired when modal closes |
| `before-hide` | Fired before modal closes (can cancel) |

```js
modalEl.addEventListener("before-hide", (e) => {
  e.detail.setExitAction(true); // prevents closing
});
```

## Avoid

The modal uses `<dialog>`, not a custom div. Do not use `<div role="dialog">` — use the native `<dialog>` element. The `preventCloseModal` option disables both ESC and backdrop click.
