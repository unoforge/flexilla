import { createAutocomplete } from "@flexilla/autocomplete";
import "./../main";

const staticRoot = document.querySelector<HTMLElement>("[data-demo-autocomplete-static]");
const multiRoot = document.querySelector<HTMLElement>("[data-demo-autocomplete-multi]");

if (staticRoot) {
  const autocomplete = createAutocomplete();
  autocomplete.connect({ root: staticRoot });
}

if (multiRoot) {
  const multiAutocomplete = createAutocomplete({ multiple: true });
  multiAutocomplete.connect({ root: multiRoot });
}
