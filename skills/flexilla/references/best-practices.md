# Best Practices

## HTML

1. **Use semantic HTML** — buttons for triggers, dialogs for modals, sections for panels, etc. Flexilla enhances native elements; it does not replace them.
2. **Use `type="button"`** on all `<button>` triggers to prevent unintended form submissions.
3. **Use unique `id` attributes** for popper-based components (dropdown, popover, tooltip, select, autocomplete content).
4. **Match `data-*-id` with the content element's `id`** — e.g., `data-dropdown-id="myDD"` on the trigger, `id="myDD"` on the content.
5. **Always include `data-state="close"`** as initial state on popper elements (dropdown, popover, tooltip content).

## CSS

1. **Start with `data-state` selectors** before adding framework-specific variants. This keeps the component functional regardless of CSS framework.
2. **Use `overflow: hidden` and `transition`** on collapsible elements (accordion content, collapse) for smooth height animations.
3. **For popper-based components**, apply `position: fixed; top: var(--fx-popper-placement-y); left: var(--fx-popper-placement-x);` to the content element, or use the `ui-popper` utility class.
4. **Use `data-[state=open]:block` (Tailwind) or `fx-open:block` (UnoCSS)** to show popper elements when open.

## JavaScript

1. **Prefer `autoInit()`** for simple pages and static content. Use manual instantiation (`new Component(...)`) when you need to pass options or handle dynamic elements.
2. **Call `cleanup()`** when removing components from the DOM to prevent memory leaks.
3. **Check for existing instances** — Flexilla's manager prevents double-initialization automatically.
4. **Use `import { Component } from "@flexilla/flexilla"`** when using multiple components from the same library entry.
5. **For Toast**, use the function API (`toast.success(...)`) or static class methods (`Toast.success(...)`) — there is no `new Toast()` or `autoInit()`. Pass `{ id }` to update an existing loading toast instead of creating a new one.

## Accessibility

1. Flexilla updates `aria-expanded`, `aria-hidden`, and `data-state` automatically. Use these for styling rather than adding extra ARIA attributes.
2. Use `<dialog>` for modals (not custom divs) for built-in focus trapping and ESC handling.
3. Test keyboard navigation — most components support Arrow keys and Home/End out of the box.
4. Tab triggers should be `<button>` or `<a>` elements for proper keyboard focusability.

## Performance

1. Import only the packages you need (e.g., `@flexilla/tabs` instead of `@flexilla/flexilla`) to keep bundles small.
2. Use `autoInit()` with the default selector for cleanliness — don't add extra DOM queries.
3. Call `cleanup()` in framework lifecycle hooks (e.g., Svelte `onDestroy`, Vue `onUnmounted`, React `useEffect` cleanup).
