# Shared Utilities

All utilities are in the `@flexilla/utilities` package (included automatically when using `@flexilla/flexilla`).

## Theme (`flexiTheme`)

```js
import { flexiTheme } from "@flexilla/utilities";

const theme = flexiTheme({
  initialTheme: "system",     // "light" | "dark" | "system"
  storageKey: "flexilla-theme", // localStorage key
  mode: "class",              // "class" | "attribute"
  className: "dark",
  attributeName: "data-theme",
  listenSystemChanges: true,
  suppressTransition: false,
});

theme.initTheme();
theme.setTheme("light");    // "light" | "dark" | "system"
theme.toggle();             // returns "light" | "dark"
theme.getCurrentTheme();    // returns resolved theme
theme.getTheme();           // returns stored preference
```

Event: `theme-changed` on `document.documentElement`.

HTML no-flash script (place in `<head>`):
```html
<script>
  const key = "flexilla-theme";
  const stored = localStorage.getItem(key);
  const theme = stored || "system";
  if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
</script>
```

## Keyboard Navigation

```js
import { keyboardNavigation } from "@flexilla/utilities";

const nav = keyboardNavigation({
  containerElement: "#list",
  targetChildren: ".list-item",
  direction: "up-down", // "up-down" | "left-right" | "all"
});

// Start listening
nav.make();

// Stop listening
nav.destroy();
```

Supports Arrow keys, Home, and End.

## Action Toggler

```js
import { actionToggler } from "@flexilla/utilities";

const toggler = actionToggler({
  trigger: "#toggle-btn",
  targets: [
    {
      element: "#panel",
      attributes: {
        initial: { "data-state": "close", "aria-expanded": "false" },
        to: { "data-state": "open", "aria-expanded": "true" },
      },
    },
  ],
  onToggle: ({ state }) => console.log(state),
});

toggler.toInitial(); // reset to initial state
toggler.toAction();  // switch to action state
toggler.toggle();    // toggle between states
toggler.state;       // current state
toggler.destroy();   // cleanup
```

## Navbar Toggle

```js
import { toggleNavbar } from "@flexilla/utilities";

const nav = toggleNavbar({
  navbarElement: "[data-app-navbar]",
  onToggle: ({ isExpanded }) => {
    document.body.classList.toggle("overflow-hidden", isExpanded);
  },
});

nav.close();   // close navbar
nav.toggle();  // toggle navbar
nav.cleanup(); // remove listeners
```

HTML structure:
```html
<nav data-app-navbar>
  <button data-nav-trigger aria-label="Toggle menu">☰</button>
  <div data-nav-overlay></div>
</nav>
```

## DOM Selectors

```js
import { $, $$, $d, $getEl } from "@flexilla/utilities";

$("#id");        // querySelector shortcut
$$(".items");    // querySelectorAll shortcut (returns array)
$d(".child", parent); // direct descendant only
$getEl(elementOrSelector); // normalize to HTMLElement
```

## DOM Utilities

```js
import {
  setAttributes,
  appendBefore,
  afterTransition,
  afterAnimation,
  dispatchCustomEvent,
  observeChildrenChanges,
  waitForFxComponents,
  disableTransitionsTemporarily,
  initScrollToTop,
} from "@flexilla/utilities";

// Batch set attributes
setAttributes(el, { "data-state": "open", "aria-expanded": "true" });

// Run callback after CSS transition
afterTransition({ element: el, callback: () => {} });

// Run callback after CSS animation
afterAnimation({ element: el, callback: () => {} });

// Dispatch custom event
dispatchCustomEvent(el, "my-event", { detail: "data" });

// Watch for child additions
const stop = observeChildrenChanges({
  container: parentEl,
  attributeToWatch: "data-select-item",
  onChildAdded: (child) => {},
});

// Wait for all Flexilla components
waitForFxComponents(() => {
  console.log("All components initialized");
});

// Batch DOM updates without transitions
disableTransitionsTemporarily(() => {
  // DOM mutations here
});

// Scroll to top button
initScrollToTop({
  triggerElement: "#scroll-top-btn",
  initFrom: 200,       // show after 200px scroll
  target: "#top",      // scroll target selector
});
```

## DOM Teleporter

```js
import { domTeleporter } from "@flexilla/utilities";

const teleporter = domTeleporter(element, document.body, "move");
teleporter.append();   // move element to body
teleporter.remove();   // remove from body
teleporter.restore();  // return to original parent
```

Mode: `"move"` moves the element; `"detachable"` clones behavior.

## Locker (Focus Trap)

```js
import { createLocker } from "@flexilla/utilities";

const locker = createLocker();
locker.lock([element1, element2]);   // focus trap + inert others
locker.unlock();                     // restore focus
```
