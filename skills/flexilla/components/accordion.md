# Accordion

Package: `@flexilla/accordion` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-accordion]`

## Structure

```html
<div data-fx-accordion data-accordion-type="single">
  <div data-accordion-item data-accordion-value="item-1">
    <button type="button" data-accordion-trigger>Trigger 1</button>
    <div data-accordion-content class="overflow-hidden transition-[height] h-0 data-[state=open]:h-auto">
      Content 1
    </div>
  </div>
  <div data-accordion-item data-accordion-value="item-2">
    <button type="button" data-accordion-trigger>Trigger 2</button>
    <div data-accordion-content class="overflow-hidden transition-[height] h-0 data-[state=open]:h-auto">
      Content 2
    </div>
  </div>
</div>
```

## Options

| Option | Attribute | Type | Default | Description |
|--------|-----------|------|---------|-------------|
| `accordionType` | `data-accordion-type` | `"single"` \| `"multiple"` | `"single"` | Allow one or multiple open items |
| `defaultValue` | `data-default-value` | `string` | — | Item to open by default |
| `preventClosingAll` | `data-prevent-closing-all` | `boolean` | `false` | Keep at least one item open |
| `allowCloseFromContent` | `data-allow-close-from-content` | `boolean` | `false` | Allow click on content to close |
| `onChangeItem` | — | `({ expandedItem }) => void` | — | Callback when item changes |

## Methods

| Method | Description |
|--------|-------------|
| `show(id)` | Expand item by value |
| `hide(id)` | Collapse item by value |
| `cleanup()` | Remove event listeners |
| `reload()` | Reinitialize from DOM |

## Events

- `change-item` — dispatched on the accordion root element

## CSS Requirements

```css
[data-accordion-content] {
  overflow: hidden;
  transition: height 0.2s ease;
  height: 0;
}
[data-accordion-content][data-state="open"] {
  height: auto;
}
```

## Open item by default

Add `data-state="open"` to the content element:

```html
<div data-accordion-content data-state="open">...</div>
```

## Avoid

Do not invent `data-accordion-*` attributes beyond those listed here. The accordion does not support `disabled` items.
