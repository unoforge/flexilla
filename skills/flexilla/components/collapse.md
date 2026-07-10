# Collapse

Package: `@flexilla/collapse` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-collapse]`

A single collapsible section with show/hide/toggle behavior.

## Structure

```html
<button data-collapse-trigger data-target="myCollapse">Toggle</button>
<div id="myCollapse" data-fx-collapse class="overflow-hidden transition-[height] h-0 data-[state=open]:h-auto">
  Collapsible content
</div>
```

A trigger can control multiple targets: `data-target="collapse1 collapse2"`.

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `defaultState` | `data-default-state` | `"open"` \| `"close"` | `"close"` | Initial state |
| `closeHeight` | `data-close-height` | `number` | `0` | Collapsed height in px |
| `onToggle` | — | `({ isExpanded }) => void` | — | Toggle callback |

## Methods

| Method | Description |
|--------|-------------|
| `show()` | Expand |
| `hide()` | Collapse |
| `toggle()` | Toggle state |
| `setCloseHeight(px)` | Update collapsed height |
| `cleanup()` | Remove listeners |

## Events

| Event | Description |
|-------|-------------|
| `before-expand` | Fired before expansion |
| `expanded` | Fired after expansion |
| `collapsed` | Fired after collapse |

## CSS

```css
[data-fx-collapse] {
  overflow: hidden;
  transition: height 0.2s ease;
  height: 0;
}
[data-fx-collapse][data-state="open"] {
  height: auto;
}
```

## Avoid

The collapse is a single-item component. For multiple linked sections, use [Accordion](./accordion.md).
