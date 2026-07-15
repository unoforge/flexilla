import { Autocomplete } from "@flexilla/autocomplete";
import "./../main";

new Autocomplete('[data-select-input][data-autocomplete-id="demo-autocomplete-static"]', {});
new Autocomplete('[data-select-input][data-autocomplete-id="demo-autocomplete-user"]');
new Autocomplete('[data-select-input][data-autocomplete-id="demo-autocomplete-multi"]', { multiple: true });
