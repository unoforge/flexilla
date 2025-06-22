# Create Overlay [DEPRECATED]

> **DEPRECATED**: This package is now deprecated. The functionality is now directly included in the [flexipop](https://github.com/unoforge/flexipop) library.

Flexipop wrapper for Flexilla Overlay components (tooltip, popover, dropdown).

## Migration Guide

### Old Usage (Deprecated)
```js
import { CreateOverlay } from '@flexilla/create-overlay';

const overlay = new CreateOverlay(referenceElement, popperElement, options);
```

### New Usage (with flexipop)
```js
import { CreateOverlay } from 'flexipop/create-overlay';

const overlay = new CreateOverlay(referenceElement, popperElement, options);
```

For complete documentation and examples, please visit the [flexipop repository](https://github.com/unoforge/flexipop).
