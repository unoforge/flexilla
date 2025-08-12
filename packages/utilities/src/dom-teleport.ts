type TeleportMode = "move" | "detachable";

export interface DomTeleporter {
  append: () => void;
  remove: () => void;
  restore: () => void;
}

/**
 * Creates a DOM teleporter to move or detach an element to a target container.
 * @param el - The HTMLElement to teleport.
 * @param target - The target HTMLElement to append the element to.
 * @param mode - The teleport mode: "move" (relocate with placeholder) or "detachable" (fully detachable).
 * @returns A DomTeleporter object with append, remove, and restore methods.
 * @throws Error if el or target is not an HTMLElement, or if mode is invalid.
 */
export function domTeleporter(
  el: HTMLElement | null,
  target: HTMLElement | null,
  mode: TeleportMode = "move"
): DomTeleporter {
  // Validate inputs
  if (!(el instanceof HTMLElement)) {
    throw new Error("Source element must be an HTMLElement");
  }
  if (!(target instanceof HTMLElement)) {
    throw new Error("Target element must be an HTMLElement");
  }
  if (!["move", "detachable"].includes(mode)) {
    throw new Error(`Invalid teleport mode: ${mode}. Must be "move" or "detachable".`);
  }

  let placeholder: Comment | null = document.createComment("teleporter-placeholder");
  const originalParent = el.parentNode;

  // Ensure placeholder is inserted only if there's a valid parent
  if (originalParent) {
    originalParent.insertBefore(placeholder, el);
  } else {
    console.warn("Element has no parent; placeholder not inserted.");
  }

  if (mode === "move") {
    // Move mode: Relocate element, restore to original position on remove/restore
    if (el.parentNode) {
      target.appendChild(el);
    }

    return {
      append() {
        if (el.parentNode !== target) {
          target.appendChild(el);
        }
      },
      remove() {
        if (placeholder?.parentNode && el.parentNode) {
          placeholder.parentNode.insertBefore(el, placeholder);
        }
      },
      restore() {
        if (placeholder?.parentNode && el.parentNode !== originalParent) {
          placeholder.parentNode.insertBefore(el, placeholder);
        }
      },
    };
  }

  if (el.parentNode) {
    target.appendChild(el);
  }

  return {
    append() {
      if (!target.contains(el)) {
        target.appendChild(el);
      }
    },
    remove() {
      if (el.parentNode) {
        el.remove();
      }
    },
    restore() {
      if (placeholder?.parentNode && !el.parentNode) {
        placeholder.parentNode.insertBefore(el, placeholder);
      }
    },
  };
}