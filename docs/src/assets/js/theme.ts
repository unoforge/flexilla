import { $, flexiTheme } from "@flexilla/utilities";

const theme = flexiTheme({
  storageKey: "flexilla-theme",
  initialTheme: "system",
});

export const initAppTheme = () => {
    const switchTheme = $("[data-switch-theme]") ;
    theme.initTheme();
    switchTheme?.addEventListener("click", (e) => {
        e.preventDefault();
        theme.toggleTheme();
    });
};
