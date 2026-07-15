# Popover

Package: `@flexilla/popover` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-popover]`
Popper: Yes

A floating content panel with Flexipop positioning, click/hover triggers, and teleportation.

## Structure

```html
<button data-popover-trigger data-popover-id="myPopover">Open</button>
<div id="myPopover" class="ui-popper" data-state="close">
  Popover content
</div>
```

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `triggerStrategy` | `data-trigger-strategy` | `"click"` \| `"hover"` | `"click"` | Open trigger |
| `placement` | `data-placement` | `Placement` | `"bottom-middle"` | Popper placement |
| `offsetDistance` | `data-offset-distance` | `number` | `6` | Gap in px |
| `preventCloseFromInside` | `data-prevent-close-inside` | `boolean` | `true` | Keep open on inside click |
| `preventFromCloseOutside` | `data-prevent-close-outside` | `boolean` | `false` | Keep open on outside click |
| `defaultState` | `data-default-state` | `"open"` \| `"close"` | `"close"` | Initial state |
| `beforeShow` | — | `() => void` | — | Called before show |
| `beforeHide` | — | `() => { cancelAction?: boolean } \| void` | — | Called before hide, can cancel |
| `onShow` | — | `() => void` | — | Show callback |
| `onHide` | — | `() => void` | — | Hide callback |
| `onToggle` | — | `({ isHidden }) => void` | — | Toggle callback |

## Methods

| Method | Description |
|--------|-------------|
| `show()` | Open popover |
| `hide()` | Close popover |
| `setShowOptions({ placement, offsetDistance })` | Show with custom positioning |
| `setOptions({ placement, offsetDistance })` | Update positioning |
| `setPopperTrigger(trigger, options)` | Change trigger element |
| `cleanup()` | Remove listeners |

## Events

| Event | Description |
|-------|-------------|
| `popover-show` | Fired on show |
| `popover-hide` | Fired on hide |
| `popover-toggle` | Fired on toggle |

## CSS

```css
#myPopover {
  position: fixed;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
  display: none;
}
#myPopover[data-state="open"] {
  display: block;
}
```

Or use the `ui-popper` utility class.

## Avoid

Do not use Popover when you need a tooltip — use `@flexilla/tooltip` (which defaults to hover). Do not use Popover when you need a navigation menu — use `@flexilla/dropdown`.
