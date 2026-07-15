# Dismissible

Package: `@flexilla/dismissible` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-dismissible]`

Makes an element dismissible — it can be hidden or removed from the DOM with restore capability.

## Structure

```html
<div data-fx-dismissible data-action="hide-from-screen" class="dismissible-box">
  <p>This can be dismissed</p>
  <button data-dismiss-btn>Dismiss</button>
  <button data-restore-btn>Restore</button>
</div>
```

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `action` | `data-action` | `"hide-from-screen"` \| `"remove-from-dom"` | `"hide-from-screen"` | How to dismiss |
| `onDismiss` | — | `() => void` | — | Called after dismiss |
| `onRestore` | — | `() => void` | — | Called after restore |

## Methods

| Method | Description |
|--------|-------------|
| `dismiss()` | Hide or remove the element |
| `restore()` | Restore the element |
| `cleanup()` | Remove event listeners |

## Notes

- `"hide-from-screen"` sets `display: none` on the element
- `"remove-from-dom"` removes the element from the DOM (with transition waiting)
- `restore()` re-inserts or re-shows the element

## Events

No custom events emitted. Use the `onDismiss` / `onRestore` callbacks instead.

## Avoid

Do not use this for permanent deletion. It is designed for dismissible notifications, banners, and alerts that can be restored.
