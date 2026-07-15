# Tabs

Package: `@flexilla/tabs` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-tabs]`

Interactive accessible tabbed interface with animated indicator support, vertical orientation, and animated panels.

## Structure

```html
<div data-fx-tabs data-default-value="tab1">
  <div data-tab-list-wrapper>
    <ul data-tab-list role="tablist">
      <li><a data-tabs-trigger data-target="tab1">Tab 1</a></li>
      <li><a data-tabs-trigger data-target="tab2">Tab 2</a></li>
      <li><a data-tabs-trigger data-target="tab3">Tab 3</a></li>
      <span data-tab-indicator class="ui-tabs-indicator"></span>
    </ul>
  </div>
  <div data-panels-container>
    <section data-tab-panel id="tab1">Panel 1 content</section>
    <section data-tab-panel id="tab2">Panel 2 content</section>
    <section data-tab-panel id="tab3">Panel 3 content</section>
  </div>
</div>
```

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `defaultValue` | `data-default-value` | `string` | — | Default active tab |
| `animationOnShow` | — | `string` | — | CSS animation class for panels |
| `indicatorOptions` | — | `{ transformDuration?, transformEasing? }` | — | Indicator animation config |
| `onChangeTab` | — | `({ currentTrigger, currentPanel }) => void` | — | Tab change callback |

### Indicator

The `data-tab-indicator` element is positioned automatically via CSS custom properties:

```css
.ui-tabs-indicator {
  position: absolute;
  left: var(--un-tab-indicator-left);
  width: var(--un-tab-indicator-width);
  transition: left 250ms, width 250ms;
}
```

### Animated Panels

Set `data-animated-panels` and `data-show-animation` on the tabs container:

```html
<div data-fx-tabs data-animated-panels data-show-animation="fadeIn .8s cubic-bezier(0.16, 1, 0.3, 1)">
```

## Methods

| Method | Description |
|--------|-------------|
| `changeTab(value)` | Switch to a panel by ID |
| `cleanup()` | Remove listeners |
| `reload()` | Reinitialize from DOM |

## Events

| Event | Description |
|-------|-------------|
| `change-tab` | Dispatched on tabs container when active tab changes |

## CSS

Panels use `data-state` for visibility. Tabs use `"active"` / `"inactive"` — not the `"open"` / `"close"` pattern used by other components:
```css
[data-tab-panel] { display: none; }
[data-tab-panel][data-state="active"] { display: block; }
```

Tab triggers use `data-state="active"` and `aria-selected="true"` on the active trigger.

## Vertical orientation

```html
<div data-fx-tabs data-orientation="vertical">
```

## Avoid

Do not use `href` on tab triggers — use `data-target` with the panel ID instead. The tabs component uses JavaScript-driven activation, not anchor navigation.
