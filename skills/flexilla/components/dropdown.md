# Dropdown

Package: `@flexilla/dropdown` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-dropdown]`
Popper: Yes

A dropdown menu with click/hover triggers, keyboard navigation, nested sub-triggers, and teleportation.

## Structure

```html
<div data-fx-dropdown>
  <button data-dropdown-trigger data-dropdown-id="myDropdown">Open</button>
  <div id="myDropdown" class="ui-popper" data-state="close">
    <a href="#">Item 1</a>
    <a href="#">Item 2</a>
    <!-- Nested sub-triggers are also supported -->
    <button data-dropdown-trigger data-dropdown-id="subDropdown">Sub</button>
  </div>
</div>
```

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `triggerStrategy` | `data-trigger-strategy` | `"click"` \| `"hover"` | `"click"` | Open trigger |
| `placement` | `data-placement` | `Placement` | `"bottom-start"` | Popper placement |
| `offsetDistance` | `data-offset-distance` | `number` | `6` | Gap in px |
| `preventCloseFromInside` | `data-prevent-close-inside` | `boolean` | `false` | Keep open on inside click |
| `preventFromCloseOutside` | `data-prevent-close-outside` | `boolean` | `false` | Keep open on outside click |
| `defaultState` | `data-default-state` | `"open"` \| `"close"` | `"close"` | Initial state |
| `readjustHeight` | `data-readjust-height` | `boolean` | — | Auto-adjust height |
| `minHeight` | `data-min-height` | `number` | — | Min height |
| `onShow` | — | `() => void` | — | Show callback |
| `onHide` | — | `() => void` | — | Hide callback |
| `onToggle` | — | `({ isHidden }) => void` | — | Toggle callback |

## Methods

| Method | Description |
|--------|-------------|
| `show()` | Open dropdown |
| `hide()` | Close dropdown |
| `setShowOptions({ placement, offsetDistance })` | Show with custom positioning |
| `setOptions({ placement, offsetDistance })` | Update positioning without showing |
| `setPopperTrigger(trigger, options)` | Change the trigger element |
| `cleanup()` | Remove listeners |

## Events

| Event | Target | Description |
|-------|--------|-------------|
| `dropdown-show` | Content element | Fired on show |
| `dropdown-hide` | Content element | Fired on hide |

## CSS

```css
#myDropdown {
  position: fixed;
  top: var(--fx-popper-placement-y);
  left: var(--fx-popper-placement-x);
  display: none;
}
#myDropdown[data-state="open"] {
  display: block;
}
```

Or use `ui-popper` class which includes the positioning styles.

## Avoid

Do not use Dropdown when you need a searchable select list — use `@flexilla/select` instead. Dropdown is for navigation menus and action lists.
