import {
  successIcon, errorIcon, infoIcon, warningIcon, loadingIcon, closeIcon,
} from "./assets"

// ── CSS (injected into shadow DOM) ──────────────────────────

const STYLES = `
/* ── Toaster container ─────────────────────────── */
[data-fx-toaster] {
  position: fixed;
  width: 356px;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  --gray1: hsl(0,0%,99%); --gray2: hsl(0,0%,97.3%); --gray3: hsl(0,0%,95.1%);
  --gray4: hsl(0,0%,93%); --gray5: hsl(0,0%,90.9%); --gray6: hsl(0,0%,88.7%);
  --gray7: hsl(0,0%,85.8%); --gray8: hsl(0,0%,78%); --gray9: hsl(0,0%,56.1%);
  --gray10: hsl(0,0%,52.3%); --gray11: hsl(0,0%,43.5%); --gray12: hsl(0,0%,9%);
  --normal-bg: #fff; --normal-border: var(--gray4); --normal-text: var(--gray12);
  --success-bg: hsl(143,85%,96%); --success-border: hsl(145,92%,91%); --success-text: hsl(140,100%,27%);
  --info-bg: hsl(208,100%,97%); --info-border: hsl(221,91%,91%); --info-text: hsl(210,92%,45%);
  --warning-bg: hsl(49,100%,97%); --warning-border: hsl(49,91%,91%); --warning-text: hsl(31,92%,45%);
  --error-bg: hsl(359,100%,97%); --error-border: hsl(359,100%,94%); --error-text: hsl(360,100%,45%);
  --border-radius: 8px;
  box-sizing: border-box; padding: 0; margin: 0; list-style: none;
  outline: none; z-index: 999999999;
}
[data-fx-toaster][data-x-position="right"] { right: max(var(--offset,24px), env(safe-area-inset-right)); }
[data-fx-toaster][data-x-position="left"]  { left: max(var(--offset,24px), env(safe-area-inset-left)); }
[data-fx-toaster][data-x-position="center"] { left: 50%; transform: translateX(-50%); }
[data-fx-toaster][data-y-position="top"]    { top: max(var(--offset,24px), env(safe-area-inset-top)); }
[data-fx-toaster][data-y-position="bottom"] { bottom: max(var(--offset,24px), env(safe-area-inset-bottom)); }

/* ── Toast item ──────────────────────────────── */
[data-fx-toast] {
  --y: translateY(100%);
  --lift-amount: calc(var(--lift,0) * var(--gap,14px));
  z-index: var(--z-index,1);
  position: absolute;
  opacity: 0;
  transform: var(--y);
  touch-action: none;
  will-change: transform, opacity, height;
  transition: transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms;
  box-sizing: border-box; outline: none; overflow-wrap: anywhere;
  width: 356px; padding: 16px;
  background: var(--normal-bg); border: 1px solid var(--normal-border);
  color: var(--normal-text); border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  font-size: 13px; display: flex; align-items: center; gap: 6px;
}
[data-fx-toast]:focus-visible {
  box-shadow: 0 4px 12px rgba(0,0,0,.1), 0 0 0 2px rgba(0,0,0,.2);
}
[data-fx-toast][data-y-position="top"] {
  top: 0; --y: translateY(-100%); --lift: 1;
  --lift-amount: calc(1 * var(--gap,14px));
}
[data-fx-toast][data-y-position="bottom"] {
  bottom: 0; --y: translateY(100%); --lift: -1;
  --lift-amount: calc(var(--lift) * var(--gap,14px));
}

/* ── State: mounted (visible) ───────────────── */
[data-fx-toast][data-state="mounted"] { --y: translateY(0); opacity: 1; }

/* ── Stacking (when NOT expanded) ──────────── */
[data-fx-toaster]:not([data-expand="true"]) [data-fx-toast]:not([data-state="deleting"])[data-index="0"] {
  transform: var(--y);
}
[data-fx-toaster]:not([data-expand="true"]) [data-fx-toast]:not([data-state="deleting"])[data-index="1"],
[data-fx-toaster]:not([data-expand="true"]) [data-fx-toast]:not([data-state="deleting"])[data-index="2"] {
  --scale: calc(1 - var(--index,0) * 0.05);
  --y: translateY(calc(var(--lift-amount) * var(--index,0)))
    scale(var(--scale));
  height: var(--front-height,0);
}
[data-fx-toaster]:not([data-expand="true"]) [data-fx-toast]:not([data-state="deleting"])[data-index="1"] > *,
[data-fx-toaster]:not([data-expand="true"]) [data-fx-toast]:not([data-state="deleting"])[data-index="2"] > * {
  opacity: 0;
}

/* ── State: invisible (beyond visible limit) ─ */
[data-fx-toast][data-state="invisible"] { opacity: 0; pointer-events: none; }

/* ── Expanded (hover) ───────────────────────── */
[data-fx-toaster][data-expand="true"] [data-fx-toast] {
  --y: translateY(calc(var(--lift) * var(--offset,0)));
  height: var(--init-height, auto);
}

/* ── Deleting animation ─────────────────────── */
[data-fx-toast][data-state="deleting"] { pointer-events: none; }
[data-fx-toast][data-state="deleting"][data-index="0"] {
  --y: translateY(calc(var(--lift) * -100%));
  opacity: 0; transition-timing-function: ease-in;
}
[data-fx-toast][data-state="deleting"][data-index="1"] {
  --y: translateY(calc(var(--lift) * var(--offset,0) + var(--lift) * -100%));
  opacity: 0;
}
[data-fx-toast][data-state="deleting"][data-index="2"],
[data-fx-toast][data-state="deleting"][data-index="3"] {
  --y: translateY(40%); opacity: 0; transition: transform 500ms, opacity 200ms;
}

/* ── Swipe ───────────────────────────────────── */
[data-fx-toast][data-swiping="true"] {
  transition: none;
  transform: translateX(var(--swipe-amount-x,0)) translateY(var(--swipe-amount-y,0));
}
[data-fx-toast][data-swiping="true"]::before {
  content: ""; position: absolute; left: 0; right: 0; height: 100%; z-index: -1;
}
[data-fx-toast][data-y-position="top"][data-swiping="true"]::before {
  bottom: 50%; transform: scaleY(3) translateY(50%);
}
[data-fx-toast][data-y-position="bottom"][data-swiping="true"]::before {
  top: 50%; transform: scaleY(3) translateY(-50%);
}

/* ── Ghost guard (keeps hover active between toasts) ─ */
[data-fx-toast]::after {
  content: ""; position: absolute; left: 0;
  height: calc(var(--gap,14px) + 1px); bottom: 100%; width: 100%;
}

/* ── Content ─────────────────────────────────── */
[data-fx-toast] [data-icon] { display: flex; height: 20px; width: 20px; align-items: center; justify-content: center; flex-shrink: 0; position: relative; }
[data-fx-toast] [data-icon] svg { width: 20px; height: 20px; }
[data-fx-toast] [data-content] { display: flex; flex-direction: column; gap: 2px; flex: 1; }
[data-fx-toast] [data-title] { font-weight: 500; line-height: 1.5; }
[data-fx-toast] [data-description] { font-weight: 400; line-height: 1.4; opacity: .8; }

/* ── Close button ────────────────────────────── */
[data-fx-toast] [data-close-button] {
  position: absolute; right: 0; top: 0;
  transform: translate(35%, -35%);
  height: 20px; width: 20px;
  display: flex; align-items: center; justify-content: center;
  padding: 0; background: var(--gray1); color: var(--gray12);
  border: 1px solid var(--gray4); border-radius: 50%; cursor: pointer; z-index: 1;
  transition: opacity 100ms, background 200ms, border-color 200ms;
}
[data-fx-toast] [data-close-button]:hover {
  background: var(--gray2); border-color: var(--gray5);
}

/* ── Action button ───────────────────────────── */
[data-fx-toast] [data-button] {
  border-radius: 4px; padding: 0 8px; height: 24px; font-size: 12px;
  color: var(--normal-bg); background: var(--normal-text);
  border: none; cursor: pointer; outline: none;
  display: flex; align-items: center; flex-shrink: 0;
}
[data-fx-toast] [data-button][data-cancel] {
  color: var(--normal-text); background: rgba(0,0,0,.08);
}

/* ── Rich colors ─────────────────────────────── */
[data-fx-toaster][data-rich-colors] [data-fx-toast][data-type="success"] { background: var(--success-bg); border-color: var(--success-border); color: var(--success-text); }
[data-fx-toaster][data-rich-colors] [data-fx-toast][data-type="info"]    { background: var(--info-bg); border-color: var(--info-border); color: var(--info-text); }
[data-fx-toaster][data-rich-colors] [data-fx-toast][data-type="warning"] { background: var(--warning-bg); border-color: var(--warning-border); color: var(--warning-text); }
[data-fx-toaster][data-rich-colors] [data-fx-toast][data-type="error"]   { background: var(--error-bg); border-color: var(--error-border); color: var(--error-text); }

/* ── Loading spinner ─────────────────────────── */
.fx-loader-wrapper { --size: 16px; height: var(--size); width: var(--size); position: absolute; inset: 0; z-index: 10; }
.fx-spinner { position: relative; top: 50%; left: 50%; height: var(--size); width: var(--size); }
.fx-loading-bar { animation: fx-spin 1.2s linear infinite; background: var(--gray11); border-radius: 6px; height: 8%; left: -10%; position: absolute; top: -3.9%; width: 24%; }
.fx-loading-bar:nth-child(1)  { animation-delay: -1.2s; transform: rotate(.0001deg) translate(146%); }
.fx-loading-bar:nth-child(2)  { animation-delay: -1.1s; transform: rotate(30deg) translate(146%); }
.fx-loading-bar:nth-child(3)  { animation-delay: -1s;   transform: rotate(60deg) translate(146%); }
.fx-loading-bar:nth-child(4)  { animation-delay: -.9s;  transform: rotate(90deg) translate(146%); }
.fx-loading-bar:nth-child(5)  { animation-delay: -.8s;  transform: rotate(120deg) translate(146%); }
.fx-loading-bar:nth-child(6)  { animation-delay: -.7s;  transform: rotate(150deg) translate(146%); }
.fx-loading-bar:nth-child(7)  { animation-delay: -.6s;  transform: rotate(180deg) translate(146%); }
.fx-loading-bar:nth-child(8)  { animation-delay: -.5s;  transform: rotate(210deg) translate(146%); }
.fx-loading-bar:nth-child(9)  { animation-delay: -.4s;  transform: rotate(240deg) translate(146%); }
.fx-loading-bar:nth-child(10) { animation-delay: -.3s;  transform: rotate(270deg) translate(146%); }
.fx-loading-bar:nth-child(11) { animation-delay: -.2s;  transform: rotate(300deg) translate(146%); }
.fx-loading-bar:nth-child(12) { animation-delay: -.1s;  transform: rotate(330deg) translate(146%); }
@keyframes fx-spin { 0% { opacity: 1; } 100% { opacity: .15; } }

/* ── Mobile ──────────────────────────────────── */
@media (max-width: 600px) {
  [data-fx-toaster] { --mobile-offset: 16px; right: var(--mobile-offset); left: var(--mobile-offset); width: 100%; }
  [data-fx-toaster][data-x-position="left"]   { left: var(--mobile-offset); }
  [data-fx-toaster][data-y-position="bottom"] { bottom: 20px; }
  [data-fx-toaster][data-y-position="top"]    { top: 20px; }
  [data-fx-toaster][data-x-position="center"] { left: var(--mobile-offset); right: var(--mobile-offset); transform: none; }
}
`

// ── Types ───────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning" | "loading"
export type Position = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"

export interface ToastOptions {
  position?: Position
  closeButton?: boolean
  richColors?: boolean
  duration?: number
  expand?: boolean
  visibleToasts?: number
  offset?: number
  mobileOffset?: number
  gap?: number
}

export interface ToastContent {
  id?: string | number
  title: string
  description?: string
  type?: ToastType
  action?: {
    label: string
    onClick: (e: MouseEvent) => void
    cancel?: boolean
  }
}

export type ToastData = ToastContent & ToastOptions

export type PromiseData<T = any> = {
  loading?: string
  success?: string | ((data: T) => string | Promise<string>)
  error?: string | ((err: any) => string | Promise<string>)
  description?: string | ((data: T | any) => string | Promise<string>)
  finally?: () => void
}

// ── Config ──────────────────────────────────────────────────

const defaultConfig: Required<ToastOptions> = {
  position: "bottom-right",
  closeButton: false,
  richColors: false,
  duration: 3000,
  expand: false,
  visibleToasts: 3,
  offset: 24,
  mobileOffset: 16,
  gap: 14,
}

let config: Required<ToastOptions> = { ...defaultConfig }

// ── Internal State ──────────────────────────────────────────

const toastTimers = new Map<string | number, { timeId: ReturnType<typeof setTimeout>; startTime: number; remainingTime: number }>()
const toastMap = new Map<string | number, HTMLElement>()

function generateId(): string | number {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2, 12)
}

// ── Helpers ─────────────────────────────────────────────────

const icons: Record<string, string> = {
  success: successIcon,
  error: errorIcon,
  info: infoIcon,
  warning: warningIcon,
  loading: loadingIcon,
}

function getOrCreateShadowRoot(): ShadowRoot {
  const existing = document.querySelector<HTMLElement>("[data-fx-toasters]")?.shadowRoot
  if (existing) return existing

  const host = document.createElement("div")
  host.setAttribute("data-fx-toasters", "")
  document.body.appendChild(host)
  const shadow = host.attachShadow({ mode: "open" })
  const style = document.createElement("style")
  style.textContent = STYLES
  shadow.appendChild(style)
  return shadow
}

function getOrCreateToaster(position: Position): HTMLElement {
  const shadow = getOrCreateShadowRoot()
  const existing = shadow.querySelector(`[data-fx-toaster][data-position="${position}"]`) as HTMLElement
  if (existing) return existing

  const [yPos, xPos] = position.split("-") as ["top" | "bottom", "right" | "left" | "center"]

  const toaster = document.createElement("ol")
  toaster.setAttribute("data-fx-toaster", "")
  toaster.setAttribute("data-position", position)
  toaster.setAttribute("data-y-position", yPos)
  toaster.setAttribute("data-x-position", xPos)
  toaster.setAttribute("data-expand", String(config.expand))
  if (config.richColors) toaster.setAttribute("data-rich-colors", "")
  toaster.dir = "ltr"
  toaster.style.setProperty("--gap", `${config.gap}px`)
  toaster.style.setProperty("--offset", `${config.offset}px`)

  const observer = new MutationObserver(() => {
    if (toaster.children.length === 0) {
      observer.disconnect()
      toaster.remove()
    } else {
      requestAnimationFrame(() => assignOffsets(toaster))
    }
  })
  observer.observe(toaster, { childList: true })

  toaster.addEventListener("mouseenter", () => {
    if (toaster.getAttribute("data-expand") === "true") return
    toaster.setAttribute("data-expand", "true")
    toastTimers.forEach((t) => {
      clearTimeout(t.timeId)
      t.remainingTime -= Date.now() - t.startTime
    })
    const onLeave = () => {
      toaster.setAttribute("data-expand", "false")
      toastTimers.forEach((t, id) => {
        t.startTime = Date.now()
        t.timeId = setTimeout(() => dismissToast(id), Math.max(0, t.remainingTime))
      })
      toaster.removeEventListener("mouseleave", onLeave)
    }
    toaster.addEventListener("mouseleave", onLeave)
  })

  shadow.appendChild(toaster)
  return toaster
}

function assignOffsets(container: HTMLElement) {
  const { visibleToasts, gap } = config
  const toasts = [...container.querySelectorAll<HTMLLIElement>("li:not([data-state=deleting])")].reverse()
  if (toasts.length === 0) return

  const front = toasts[0]
  if (!front.style.getPropertyValue("--init-height")) {
    front.style.setProperty("--init-height", `${front.offsetHeight}px`)
  }

  toasts.forEach((toast, index) => {
    const next = toast.nextElementSibling as HTMLLIElement | null

    let offset = 0
    if (index > 0 && next) {
      const nextOffset = parseFloat(getComputedStyle(next).getPropertyValue("--offset")) || 0
      const nextHeight = parseFloat(getComputedStyle(next).getPropertyValue("--init-height")) || 0
      offset = nextOffset + nextHeight + gap
    }

    toast.style.setProperty("--offset", `${offset}px`)
    toast.style.setProperty("--index", String(index))
    toast.setAttribute("data-index", String(index))
    toast.setAttribute("data-state", index + 1 > visibleToasts ? "invisible" : "mounted")
  })

  const h = toasts[0]?.offsetHeight || 0
  container.style.setProperty("--front-height", `${h}px`)
}

function createToastElement(data: ToastData): HTMLElement {
  const toast = document.createElement("li")
  toast.setAttribute("data-fx-toast", "")
  if (data.type) toast.setAttribute("data-type", data.type)

  const position = data.position ?? config.position
  const [yPos] = position.split("-") as ["top" | "bottom", string]
  toast.setAttribute("data-y-position", yPos)

  // close button — only when requested
  if (data.closeButton) {
    const close = document.createElement("button")
    close.setAttribute("data-close-button", "")
    close.innerHTML = closeIcon
    close.addEventListener("click", () => dismissToast(data.id))
    toast.appendChild(close)
  }

  // icon
  if (data.type) {
    const icon = document.createElement("span")
    icon.setAttribute("data-icon", "")
    icon.innerHTML = icons[data.type] || ""
    toast.appendChild(icon)
  }

  // content
  const content = document.createElement("div")
  content.setAttribute("data-content", "")

  const title = document.createElement("div")
  title.setAttribute("data-title", "")
  title.textContent = data.title
  content.appendChild(title)

  if (data.description) {
    const desc = document.createElement("div")
    desc.textContent = data.description
    desc.setAttribute("data-description", "")
    content.appendChild(desc)
  }
  toast.appendChild(content)

  // action button(s)
  if (data.action) {
    const btn = document.createElement("span")
    btn.setAttribute("data-button", "")
    btn.textContent = data.action.label
    if (data.action.cancel) btn.setAttribute("data-cancel", "")
    btn.addEventListener("mousedown", (e) => e.stopPropagation())
    btn.addEventListener("click", (e) => {
      data.action!.onClick(e)
      dismissToast(data.id)
    })
    toast.appendChild(btn)
  }

  // swipe + auto-dismiss timer
  if (data.duration !== 0) {
    const duration = data.duration ?? config.duration
    const timeId = setTimeout(() => dismissToast(data.id), duration)
    toastTimers.set(data.id!, { timeId, startTime: Date.now(), remainingTime: duration })
    registerSwipe(toast, data, position)
  }

  // track transitions to prevent swipe during animation
  toast.addEventListener("transitionstart", () => toast.setAttribute("data-moving", "true"))
  toast.addEventListener("transitionend", () => toast.setAttribute("data-moving", "false"))

  return toast
}

function registerSwipe(toast: HTMLElement, data: ToastData, position: Position) {
  const [positionY, positionX] = position.split("-") as [string, string]
  const liftX = positionX === "right" ? 1 : -1
  const liftY = positionY === "bottom" ? 1 : -1

  const onPointerDown = (e: PointerEvent) => {
    if (toast.getAttribute("data-moving") === "true") return
    toast.setAttribute("data-swiping", "true")

    const startX = e.clientX
    const startY = e.clientY
    let deltaX = 0
    let deltaY = 0
    let directionLocked: "x" | "y" | null = null
    if (positionX === "center") directionLocked = "y"

    const onMove = (e: PointerEvent) => {
      deltaX = e.clientX - startX
      deltaY = e.clientY - startY

      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 10) {
        directionLocked ??= Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y"
      }

      if (directionLocked === "x") {
        const resistance = deltaX * liftX < 0 ? 0.02 : 1
        toast.style.setProperty("--swipe-amount-x", `${deltaX * resistance}px`)
        toast.style.setProperty("--swipe-amount-y", "0")
      } else if (directionLocked === "y") {
        const resistance = deltaY * liftY < 0 ? 0.02 : 1
        toast.style.setProperty("--swipe-amount-y", `${deltaY * resistance}px`)
        toast.style.setProperty("--swipe-amount-x", "0")
      }
    }

    const onUp = () => {
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)

      if (directionLocked === "x" && Math.abs(deltaX) > 30) {
        toast.style.setProperty("--swipe-amount-x", `${liftX * 300}%`)
        dismissToast(data.id, 200)
      } else if (directionLocked === "y" && Math.abs(deltaY) > 10) {
        toast.style.setProperty("--swipe-amount-y", `${liftY * 300}%`)
        dismissToast(data.id, 200)
      } else {
        toast.setAttribute("data-swiping", "false")
        toast.style.setProperty("--swipe-amount-x", "0")
        toast.style.setProperty("--swipe-amount-y", "0")
      }
    }

    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
  }

  toast.addEventListener("pointerdown", onPointerDown)
}

function addToast(data: ToastData): string | number {
  const id = data.id ?? generateId()
  data.id = id

  const merged: ToastData = {
    ...config,
    ...data,
    action: data.action,
  }

  const toaster = getOrCreateToaster(merged.position ?? config.position)
  const existing = data.id && toastMap.get(data.id)?.isConnected ? toastMap.get(data.id) : null
  const toast = createToastElement(merged)

  if (existing) {
    toast.setAttribute("style", existing.getAttribute("style") || "")
    toaster.replaceChild(toast, existing)
    toastMap.set(id, toast)
    assignOffsets(toaster)
  } else {
    toaster.appendChild(toast)
    toastMap.set(id, toast)

    // Force a synchronous reflow so the browser paints the initial state
    // (opacity 0, translateY(100%)) before we trigger the enter transition.
    void toast.offsetHeight
    toast.setAttribute("data-state", "mounted")

    setTimeout(() => assignOffsets(toaster), 400)
  }

  return id
}

function dismissToast(id?: string | number, exitTime = 400) {
  if (toastMap.size === 0) return
  if (id === undefined) {
    toastMap.forEach((_, key) => dismissToast(key))
    return
  }

  const toast = toastMap.get(id)
  if (!toast) return

  toast.setAttribute("data-state", "deleting")
  const toaster = toast.parentElement as HTMLElement | null
  if (toaster) assignOffsets(toaster)
  toastTimers.delete(id)

  setTimeout(() => requestAnimationFrame(() => toast.remove()), exitTime)
  toastMap.delete(id)
}

// ── Promise Support ─────────────────────────────────────────

function promiseToast<T = any>(promise: Promise<T> | (() => Promise<T>), data?: PromiseData<T>): void {
  if (!data) return
  let id: string | number | undefined

  if (data.loading !== undefined) {
    id = toast.loading(data.loading, {
      description: typeof data.description !== "function" ? data.description : undefined,
    })
  }

  const p = typeof promise === "function" ? promise() : promise

  p.then(async (result) => {
    const description = typeof data.description === "function" ? await data.description(result) : data.description
    const success = typeof data.success === "function" ? await data.success(result) : data.success
    if (success) toast.success(success, { id, description })
  }).catch(async (err) => {
    const description = typeof data.description === "function" ? await data.description(err) : data.description
    const error = typeof data.error === "function" ? await data.error(err) : data.error
    if (error) toast.error(error, { id, description })
  }).finally(data.finally)
}

// ── Public API ──────────────────────────────────────────────

function toast(message: string, options?: ToastOptions & Omit<ToastContent, "title">): string | number {
  return addToast({ title: message, ...options })
}

toast.message = (message: string, options?: ToastOptions & Omit<ToastContent, "title">) =>
  addToast({ title: message, ...options })
toast.show = toast.message

toast.success = (message: string, options?: ToastOptions & Omit<ToastContent, "title" | "type">) =>
  addToast({ title: message, type: "success", ...options })

toast.error = (message: string, options?: ToastOptions & Omit<ToastContent, "title" | "type">) =>
  addToast({ title: message, type: "error", ...options })

toast.info = (message: string, options?: ToastOptions & Omit<ToastContent, "title" | "type">) =>
  addToast({ title: message, type: "info", ...options })

toast.warning = (message: string, options?: ToastOptions & Omit<ToastContent, "title" | "type">) =>
  addToast({ title: message, type: "warning", ...options })

toast.loading = (message: string, options?: ToastOptions & Omit<ToastContent, "title" | "type">) =>
  addToast({ title: message, type: "loading", duration: 0, ...options })

toast.dismiss = dismissToast
toast.promise = promiseToast
toast.config = (opts: ToastOptions) => {
  config = { ...defaultConfig, ...opts }
}

// ── Backward-compatible class ───────────────────────────────

export class Toast {
  static message = toast.message
  static show = toast.message
  static success = toast.success
  static error = toast.error
  static info = toast.info
  static warning = toast.warning
  static loading = toast.loading
  static dismiss = toast.dismiss
  static promise = toast.promise
  static config = toast.config
  static dismissAll = () => dismissToast()
}

export { toast }
export default toast
