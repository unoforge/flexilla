# Auto Resize Textarea

Package: `@flexilla/auto-resize-area` (also available via `@flexilla/flexilla`)
Auto-init: `[data-fx-autoresize]`

Automatically adjusts `<textarea>` height to fit its content.

## Structure

```html
<textarea data-fx-autoresize data-min-height="80" data-max-height="300"></textarea>
```

## Options

Options are passed as constructor params or via data attributes:

| Option | Attribute | Type | Description |
|--------|-----------|------|-------------|
| `minHeight` | `data-min-height` | `number` | Minimum height in px |
| `maxHeight` | `data-max-height` | `number` | Maximum height in px |

## JS Initialization

```js
import { AutoResizeTextArea } from "@flexilla/auto-resize-area";

// manual
new AutoResizeTextArea("#myTextarea", 80, 300);

// auto
AutoResizeTextArea.autoInit();
```

## Methods

| Method | Description |
|--------|-------------|
| `cleanup()` | Remove event listeners |

## Events

No custom events emitted.

## Avoid

Do not use this component on elements other than `<textarea>`. It only works with textarea inputs.
