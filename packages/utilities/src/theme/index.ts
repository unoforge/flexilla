import { dispatchCustomEvent } from "@flexilla/utilities";
import { disableTransitionsTemporarily } from "../dom-utilities";

export type Theme = "light" | "dark" | "system";
export type ThemeMode = "class" | "attribute";

type ThemeOptions = {
    storageKey?: string;
    docElement?: HTMLElement;
    mode?: ThemeMode;
    className?: string;
    attributeName?: string;
    initialTheme?: Theme;
    listenSystemChanges?: boolean;
    suppressTransition?: boolean;
}

const isServer = typeof window === "undefined";
const getDocEl = (el?: HTMLElement) => el ?? (!isServer ? document.documentElement : undefined);

const getSystemTheme = (): "light" | "dark" =>
    !isServer && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const storage = {
    get: (key: string): Theme | null => {
        try { return localStorage.getItem(key) as Theme; } catch { return null; }
    },
    set: (key: string, value: string) => {
        try { localStorage.setItem(key, value); } catch (e) { console.warn("Theme: Unable to save to localStorage", e); }
    }
};


const flexiTheme = () => {
    const applyThemeState = (
        resolvedTheme: "light" | "dark",
        opts: ThemeOptions
    ) => {
        const docEl = getDocEl(opts.docElement);
        if (!docEl) return;

        const suppressTransition = opts.suppressTransition !== false;

        const { mode = "class", className = "dark", attributeName = "data-theme" } = opts;

        const applyTheme = () => {
            if (mode === "class") {
                docEl.classList.toggle(className, resolvedTheme === "dark");
            } else {
                docEl.setAttribute(attributeName, resolvedTheme);
            }

            // Sync Toggle UI state using ARIA or data attributes for accessibility
            const toggles = document.querySelectorAll("[data-theme-value]");
            toggles.forEach((el) => {
                const isActive = el.getAttribute("data-theme-value") === resolvedTheme;
                el.setAttribute("aria-pressed", isActive ? "true" : "false");
                el.setAttribute("data-state", isActive ? "active" : "inactive");
            });
        }

        if (suppressTransition) {
            disableTransitionsTemporarily(() => {
                applyTheme();
            });
        } else {
            applyTheme();
        }
    };

    const setTheme = (theme: Theme, opts: ThemeOptions = { storageKey: "flexilla-theme", initialTheme: "system", listenSystemChanges: true, suppressTransition: true }) => {
        const storageKey = opts.storageKey || "flexilla-theme";
        const resolved = theme === "system" ? getSystemTheme() : theme;

        storage.set(storageKey, theme);
        applyThemeState(resolved, opts);

        const docEl = getDocEl(opts.docElement);
        if (docEl) {
            dispatchCustomEvent(docEl, "theme-changed", {
                theme: resolved,
                actual: theme
            });
        }
    };

    const initTheme = (opts: ThemeOptions = { storageKey: "flexilla-theme", initialTheme: "system", listenSystemChanges: true, suppressTransition: true }) => {
        if (isServer) return;

        const storageKey = opts.storageKey || "flexilla-theme";
        const saved = storage.get(storageKey) || opts.initialTheme || "system";

        // Apply initial theme
        setTheme(saved, { ...opts });

        // Listen for System Preference Changes
        if (opts.listenSystemChanges !== false) {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => {
                if (storage.get(storageKey) === "system") {
                    applyThemeState(getSystemTheme(), opts);
                }
            };

            mediaQuery.addEventListener("change", handleChange);
        }
    };

    return {
        setTheme,
        initTheme
    };
}


export { flexiTheme, getSystemTheme, type ThemeOptions };