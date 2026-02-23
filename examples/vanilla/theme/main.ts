import { flexiTheme } from "@flexilla/utilities";
import "./../main";

type Theme = "light" | "dark" | "system";

const theme = flexiTheme({ initialTheme: "system", storageKey: "flexilla-theme__" });
const statusPreference = document.querySelector("[data-theme-preference]");
const statusCurrent = document.querySelector("[data-theme-current]");
const root = document.documentElement;

const render = () => {
    if (statusPreference) statusPreference.textContent = theme.getTheme();
    if (statusCurrent) statusCurrent.textContent = theme.getCurrentTheme();
};

document.querySelectorAll<HTMLElement>("[data-theme-value]").forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("data-theme-value") as Theme | null;
        if (!value) return;
        theme.setTheme(value);
        render();
    });
});

document.querySelector<HTMLElement>("[data-theme-toggle]")?.addEventListener("click", () => {
    theme.toggle();
    render();
});

root.addEventListener("theme-changed", render);
theme.initTheme();
render();
