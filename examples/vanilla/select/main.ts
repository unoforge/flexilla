import { Select } from "@flexilla/select";
import "./../main";

new Select('[data-select-content][data-select-id="demo-select-basic"]');
new Select('[data-select-content][data-select-id="demo-select"]');
new Select('[data-select-content][data-select-id="demo-select-multi"]', { multiple: true });
new Select('[data-select-content][data-select-id="demo-select-count"]', { multiple: true });
new Select('[data-select-content][data-select-id="demo-select-compact"]', { multiple: true });
new Select('[data-select-content][data-select-id="demo-select-template"]');
