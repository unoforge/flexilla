type TeleportMode = "move" | "detachable";
const TELEPORT_ROOT_ATTR = "data-fx-teleport-root";
const TELEPORTED_ATTR = "data-fx-teleported";

const noopTeleporter: DomTeleporter = {
  append: () => { },
  remove: () => { },
  restore: () => { },
};

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
  if (!(el instanceof HTMLElement)) {
    throw new Error("Source element must be an HTMLElement");
  }
  if (!(target instanceof HTMLElement)) {
    throw new Error("Target element must be an HTMLElement");
  }
  if (!["move", "detachable"].includes(mode)) {
    throw new Error(`Invalid teleport mode: ${mode}. Must be "move" or "detachable".`);
  }


  const hasTeleportRootAncestor = Boolean(
    el.parentElement?.closest(`[${TELEPORT_ROOT_ATTR}]`)
  );
  if (hasTeleportRootAncestor) {
    return noopTeleporter;
  }

  el.setAttribute(TELEPORT_ROOT_ATTR, "");
  let placeholder: Comment | null = document.createComment("teleporter-placeholder");
  const originalParent = el.parentNode;

  if (originalParent) {
    originalParent.insertBefore(placeholder, el);
  }

  if (mode === "move") {
    if (el.parentNode) {
      target.appendChild(el);
      el.setAttribute(TELEPORTED_ATTR, "");
    }

    return {
      append() {
        if (el.parentNode !== target) {
          target.appendChild(el);
          el.setAttribute(TELEPORTED_ATTR, "");
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
    el.setAttribute(TELEPORTED_ATTR, "");
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
