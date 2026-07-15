# Tooltip

Package: `@flexilla/tooltip` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-tooltip]`
Popper: Yes

A tooltip built on `@flexilla/popover` with Flexipop positioning. Default trigger strategy is `hover`.

## Structure

```html
<button data-tooltip-trigger data-tooltip-id="myTooltip">Hover me</button>
<div id="myTooltip" class="ui-popper" data-state="close">Tooltip text</div>
```

## Options

Same as PopoverOptions, with `triggerStrategy` defaulting to `"hover"`:

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `triggerStrategy` | `data-trigger-strategy` | `"click"` \| `"hover"` | `"hover"` | Open trigger |
| `placement` | `data-placement` | `Placement` | `"bottom-middle"` | Popper placement |
| `offsetDistance` | `data-offset-distance` | `number` | `6` | Gap in px |
| `preventCloseFromInside` | `data-prevent-close-inside` | `boolean` | `true` | Keep open on inside click |
| `preventFromCloseOutside` | `data-prevent-close-outside` | `boolean` | — | Keep open on outside click |
| `defaultState` | `data-default-state` | `"open"` \| `"close"` | `"close"` | Initial state |
| `onShow` | — | `() => void` | — | Show callback |
| `onHide` | — | `() => void` | — | Hide callback |
| `onToggle` | — | `({ isHidden }) => void` | — | Toggle callback |

Tooltip inherits all Popover options including `beforeShow` and `beforeHide`. See [components/popover.md](./popover.md) for the full options list.

## Methods

| Method | Description |
|--------|-------------|
| `show()` | Show tooltip |
| `hide()` | Hide tooltip |
| `setShowOptions({ placement, offsetDistance })` | Show with custom positioning |
| `init(el, options)` | Static — create instance without `new` |
| `autoInit(selector?)` | Static — init all `[data-fx-tooltip]` |
| `cleanup()` | Remove listeners |

## Events

| Event | Description |
|-------|-------------|
| `tooltip-show` | Fired on show |
| `tooltip-hide` | Fired on hide |
| `popover-toggle` | Fired on toggle |

## CSS

```css
#myTooltip {
  position: fixed;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
  display: none;
}
#myTooltip[data-state="open"] {
  display: block;
}
```

Or use the `ui-popper` utility class.

## Avoid

Tooltip is for short labels and descriptions, not for rich interactive content. For rich content panels, use Popover or Dropdown instead. The default trigger is hover, not click.
