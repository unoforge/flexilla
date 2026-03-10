export type SelectItem = {
  value: string;
  label?: string;
  disabled?: boolean;
};

export type SelectState = {
  open: boolean;
  highlightedIndex: number | null;
  selectedValues: string[];
  search: string;
  items: SelectItem[];
};

export type SelectOptions = {
  multiple?: boolean;
};

export type SelectListener = (state: Readonly<SelectState>) => void;
