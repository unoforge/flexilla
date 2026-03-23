import { Autocomplete } from "@flexilla/autocomplete";
import "./../main";

const staticRoot = document.querySelector<HTMLElement>("[data-demo-autocomplete-static]");
const multiRoot = document.querySelector<HTMLElement>("[data-demo-autocomplete-multi]");

if (staticRoot) {
  new Autocomplete(staticRoot);
}

if (multiRoot) {
  new Autocomplete(multiRoot, { multiple: true });
}
