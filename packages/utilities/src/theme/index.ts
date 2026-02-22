import { dispatchCustomEvent, disableTransitionsTemporarily } from "../dom-utilities";

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

const DEFAULT_OPTIONS: Required<Omit<ThemeOptions, "docElement">> = {
    storageKey: "flexilla-theme",
    mode: "class",
    className: "dark",
    attributeName: "data-theme",
    initialTheme: "system",
    listenSystemChanges: true,
    suppressTransition: true
};

export const getSystemTheme = (): "light" | "dark" => {
    if (isServer) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const flexiTheme = (userOptions: ThemeOptions = {}) => {
    const opts = { ...DEFAULT_OPTIONS, ...userOptions };
    const getDocEl = () => opts.docElement ?? (!isServer ? document.documentElement : undefined);

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
            } catch {
                // Ignore storage failures in private mode / blocked storage.
            }
        }
    };

    const applyTheme = (theme: "light" | "dark", suppressTransition = opts.suppressTransition) => {
        const docEl = getDocEl();
        if (!docEl) return;

        const apply = () => {
            if (opts.mode === "class") {
                docEl.classList.toggle(opts.className, theme === "dark");
            } else {
                docEl.setAttribute(opts.attributeName, theme);
            }

            const toggles = document.querySelectorAll<HTMLElement>("[data-theme-value]");
            for (const el of toggles) {
                const isActive = el.getAttribute("data-theme-value") === theme;
                el.setAttribute("aria-pressed", String(isActive));
                el.dataset.state = isActive ? "active" : "inactive";
            }
        };

        suppressTransition ? disableTransitionsTemporarily(apply) : apply();
    };

    const resolveTheme = (theme: Theme): "light" | "dark" => (theme === "system" ? getSystemTheme() : theme);
    const getTheme = (): Theme => storage.get() ?? opts.initialTheme;
    const getCurrentTheme = (): "light" | "dark" => resolveTheme(getTheme());

    const setTheme = (
        theme: Theme,
        options: { suppressTransition?: boolean } = {}
    ) => {
        const resolved = resolveTheme(theme);
        storage.set(theme);
        applyTheme(resolved, options.suppressTransition ?? opts.suppressTransition);

        const docEl = getDocEl();
        if (docEl) {
            dispatchCustomEvent(docEl, "theme-changed", {
                theme: resolved,
                preference: theme
            });
        }
    };

    const toggle = () => {
        const next: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
        setTheme(next);
        return next;
    };

    const initTheme = () => {
        if (isServer) return;
        setTheme(getTheme(), { suppressTransition: opts.suppressTransition });

        if (opts.listenSystemChanges) {
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => getTheme() === "system" && applyTheme(getSystemTheme());
            media.addEventListener("change", handleChange);
        }
    };

    return {
        initTheme,
        setTheme,
        toggle,
        getCurrentTheme,
        getTheme,
        // Backward-compatible aliases
        toogle: toggle,
        getcurrentTheme: getCurrentTheme,
        toggleTheme: toggle
    };
};

export { flexiTheme };
