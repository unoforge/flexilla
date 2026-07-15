# Offcanvas

Package: `@flexilla/offcanvas` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-offcanvas]`

An off-canvas sidebar/drawer that slides in from any edge, with overlay backdrop and focus locking.

## Structure

```html
<button data-offcanvas-trigger data-target="mySheet" aria-controls="mySheet">
  Open
</button>

<div id="mySheet" data-fx-offcanvas
  class="fixed inset-y-0 left-0 w-80 z-50 transition-transform -translate-x-full data-[state=open]:translate-x-0">
  <button data-offcanvas-close aria-label="Close">X</button>
  <p>Offcanvas content</p>
</div>
```

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `staticBackdrop` | `data-static-backdrop` | `boolean` | `false` | Prevent close on backdrop click |
| `allowBodyScroll` | `data-allow-body-scroll` | `boolean` | `false` | Allow body scroll when open |
| `backdrop` | `data-offcanvas-backdrop` | `string` | — | CSS class for backdrop element |
| `dispatchEventToDocument` | — | `boolean` | `true` | Dispatch events to document |
| `beforeHide` | — | `() => { cancelAction? } \| void` | — | Cancel hide callback |
| `beforeShow` | — | `() => void` | — | Before show callback |
| `onShow` | — | `() => void` | — | Show callback |
| `onHide` | — | `() => void` | — | Hide callback |

## Methods

| Method | Description |
|--------|-------------|
| `open()` | Open offcanvas |
| `close()` | Close offcanvas |
| `setOptions({ allowBodyScroll? })` | Update options |
| `cleanup()` | Remove listeners |

## Events

| Event | Description |
|-------|-------------|
| `offcanvas-before-hide` | Fired before close (can cancel) |
| `offcanvas-open` | Fired on open |
| `offcanvas-close` | Fired on close |

Document events: `sheet:{id}:open`, `sheet:{id}:close`

## CSS

Style the slide transition by targeting `data-state`:

```css
/* Slide from left */
[data-fx-offcanvas] {
  transition: transform 0.3s ease;
  transform: translateX(-100%);
}
[data-fx-offcanvas][data-state="open"] {
  transform: translateX(0);
}
```

Or use UnoCSS/Tailwind utilities:
```html
<div class="fixed inset-y-0 left-0 -translate-x-full data-[state=open]:translate-x-0 transition-transform ...">
```

## Avoid

Do not use Offcanvas for simple modals — use `@flexilla/modal` instead. Offcanvas is for side panels, mobile nav drawers, and shopping carts.
