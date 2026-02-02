import { dispatchCustomEvent } from "@flexilla/utilities";
import { disableTransitionsTemporarily } from "../dom-utilities";

export type Theme = "light" | "dark" | "system";
export type ThemeMode = "class" | "attribute";

export type ThemeOptions = {
    storageKey?: string;
    docElement?: HTMLElement;
    mode?: ThemeMode;
    className?: string;
    attributeName?: string;
    initialTheme?: Theme;
    listenSystemChanges?: boolean;
    suppressTransition?: boolean;
};

const isServer = typeof window === "undefined";

/* -------------------------------------------------------------------------- */
/* Defaults                                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_OPTIONS: Required<Omit<ThemeOptions, "docElement">> = {
    storageKey: "flexilla-theme",
    mode: "class",
    className: "dark",
    attributeName: "data-theme",
    initialTheme: "system",
    listenSystemChanges: true,
    suppressTransition: true
};

/* -------------------------------------------------------------------------- */

const flexiTheme = (userOptions: ThemeOptions = {}) => {
    const opts = { ...DEFAULT_OPTIONS, ...userOptions };

    const getDocEl = () =>
        opts.docElement ?? (!isServer ? document.documentElement : undefined);

    const getSystemTheme = (): "light" | "dark" => {
        if (isServer) return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    };

    const storage = {
        get(): Theme | null {
            try {
                return localStorage.getItem(opts.storageKey) as Theme | null;
            } catch {
                return null;
            }
        },
        set(value: Theme) {
            try {
                localStorage.setItem(opts.storageKey, value);
            } catch (e) {
                console.warn("[Flexilla Theme] Storage write failed", e);
            }
        }
    };

    /* ---------------------------------------------------------------------- */
    /* Core Logic                                                              */
    /* ---------------------------------------------------------------------- */

    const applyThemeState = (
        resolvedTheme: "light" | "dark",
        suppressTransition = opts.suppressTransition
    ) => {
        const docEl = getDocEl();
        if (!docEl) return;

        const apply = () => {
            if (opts.mode === "class") {
                const shouldHaveClass = resolvedTheme === "dark";
                docEl.classList.toggle(opts.className, shouldHaveClass);
            } else {
                docEl.setAttribute(opts.attributeName, resolvedTheme);
            }

            // Sync UI toggles (accessibility-friendly)
            document
                .querySelectorAll<HTMLElement>("[data-theme-value]")
                .forEach((el) => {
                    const isActive =
                        el.getAttribute("data-theme-value") === resolvedTheme;

                    el.setAttribute("aria-pressed", String(isActive));
                    el.dataset.state = isActive ? "active" : "inactive";
                });
        };

        suppressTransition
            ? disableTransitionsTemporarily(apply)
            : apply();
    };

    const resolveTheme = (theme: Theme): "light" | "dark" =>
        theme === "system" ? getSystemTheme() : theme;

    /* ---------------------------------------------------------------------- */
    /* Public API                                                              */
    /* ---------------------------------------------------------------------- */

    const setTheme = (
        theme: Theme,
        options: { suppressTransition?: boolean } = {}
    ) => {
        const resolved = resolveTheme(theme);

        storage.set(theme);
        applyThemeState(
            resolved,
            options.suppressTransition ?? opts.suppressTransition
        );

        const docEl = getDocEl();
        if (docEl) {
            dispatchCustomEvent(docEl, "theme-changed", {
                theme: resolved,
                preference: theme
            });
        }
    };

    const getTheme = (): Theme =>
        storage.get() ?? opts.initialTheme;

    const toggleTheme = () => {
        const current = getTheme();
        const next: Theme =
            current === "light"
                ? "dark"
                : current === "dark"
                ? "system"
                : "light";

        setTheme(next);
        return next;
    };

    const initTheme = () => {
        if (isServer) return;

        const saved = getTheme();
        setTheme(saved, { suppressTransition: opts.suppressTransition });

        if (opts.listenSystemChanges) {
            const media = window.matchMedia("(prefers-color-scheme: dark)");

            const handleChange = () => {
                if (getTheme() === "system") {
                    applyThemeState(getSystemTheme());
                }
            };

            media.addEventListener("change", handleChange);
        }
    };

    return {
        initTheme,
        setTheme,
        getTheme,
        toggleTheme
    };
};

export { flexiTheme };