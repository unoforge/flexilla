# @flexilla/accordion 


## Installation

You can install the `@flexilla/accordion` package :

```shell
npm install @flexilla/accordion
```
Or
```shell
bun add @flexilla/accordion
```

## Usage

To use the accordion component, follow these steps:
Import the Accordion class from the @flexilla/accordion package:

```ts
import { Accordion } from '@flexilla/accordion';
```

Create an instance of the Accordion class by passing the required parameters:

```ts 
const options = {
  // Specify any desired options here
};
const accordion = new Accordion('#accordion', options);
```

Note: The accordionElement should be a valid HTML element that acts as the container for the accordion.


You can Also Use the shortcup `fAccordion` : it will create for you an instance of Accordion
```ts
import { fAccordion } from '@flexilla/accordion';

fAccordion("#selector", options)
```

## Props/Params

There's only two Params to provide, One is required and the second not

### selector (required) 

The selector of a HTML Element that acts as the container for the accordion
  - Items : Every item with `data-accordion-item` and `data-accordion-value="item-value"`, and every accordion item must have a trigger `data-accordion-trigger` and content `data-accordion-content` 

### Options

There's two way to pass options:

1. Provide an Options object

```ts
const options = {
  // Specify any desired options here
};
```

If using with TS, you can even import the type from accodion
```ts
import {Accordion, AccordionOptions} from "@flexilla/accordion"
const options:AccordionOptions = {

}
```

2. Use data-attributes

```html
<div data-my-accordion-1 data-default-value="accordion-1" data-accordion-type="single">
    <!-- here the content -->
</div>
```

#### Available options

| Option                | Description                                                                                                                            | Data Attribute Equivalent | Type    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------- |
| preventClosingAll     | Set to true if you don't want to allow closing all accordion items. Default is false.                                                | data-prevent-closing-all  | boolean |
| allowTriggerOnFocus   | Set to true if you want to trigger accordion item actions on focus. Default is false.                                                | data-allow-trigger-on-focus | boolean |
| accordionType         | Specify the type of accordion. Default is single.                                                                                      | data-accordion-type       | `single` or `multiple`  |
| defaultValue          | Specify the default accordion item to be opened.                                                                                        | data-default-value        | string  |


Note: When passing options via data attributes, make sure to format the attribute values accordingly.

## Methods

You can show or hide specific accordion items programmatically using the showItem and hideItem methods:
```ts
//Show An item
accordion.showItem('.accordion-item');
//Hide an item
accordion.hideItem('.accordion-item');
```

## Examples

Here are a few examples to demonstrate the usage of the @flexilla/accordion package:

1. For this Example I'm using UnoCSS for styling but you can use any CSS Library, Frameworkm or even write you're own CSS.


```html
<div data-accordion-example data-default-value="accordion-item-2" data-accordion-type="single" class="space-y-2 bg-white rounded-md">
    <div data-accordion-item data-accordion-value="accordion-item-1"
    class="rounded-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px4 w-full flex justify-between items-center py2 text-gray8 dark-text-gray2 font-medium text-lg ease-linear hover-bg-gray2/50 dark-hover-bg-gray8/40 rounded-md focus:outline-blue6 aria-expanded-text-blue6">
            Is it accessible?
        </button>
        <div aria-hidden="true" data-accordion-content
            class="text-gray7 dark-text-gray3 duration-200 ease-linear overflow-hidden">
            <p class="p-4">
            Yes. It adheres to the WAI-ARIA design pattern.
            </p>
        </div>
    </div>
    <div data-accordion-item data-accordion-value="accordion-item-2"
    class="rounded-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px4 w-full flex justify-between items-center py2 text-gray8 dark-text-gray2 font-medium text-lg ease-linear hover-bg-gray2/50 dark-hover-bg-gray8/40 rounded-md focus:outline-blue6 aria-expanded-text-blue6">
            Is it unstyled?
        </button>
        <div aria-hidden="true" data-accordion-content
            class="text-gray7 dark-text-gray3 duration-200 ease-linear overflow-hidden">
            <p class="p-4">
            Yes. It's unstyled by default, giving you freedom over the look and feel.
            </p>
        </div>
    </div>
    <div data-accordion-item data-accordion-value="accordion-item-3"
    class="rounded-md">
        <button data-accordion-trigger aria-label="toggle button"
            class="px4 w-full flex justify-between items-center py2 text-gray8 dark-text-gray2 font-medium text-lg ease-linear hover-bg-gray2/50 dark-hover-bg-gray8/40 rounded-md focus:outline-blue6 aria-expanded-text-blue6">
            Can it be animated?
        </button>
        <div aria-hidden="true" data-accordion-content
            class="text-gray7 dark-text-gray3 duration-200 ease-linear h0 overflow-hidden">
            <p class="p-4">
            Yes! You can use the transition prop to configure the animation.
            </p>
        </div>
    </div>
</div>
<script>
  import { Accordion } from '@flexilla/accordion';
  const accordion = new Accordion("[data-accordion-example]");
</script>
```

2. Custom options:
3. 
```html
<div id="accordion" data-accordion-type="multiple" data-default-value="item2">
  <div class="accordion-item" data-accordion-item data-accordion-value="item1">
    <button data-accordion-trigger>
    Trigger content
    </button>
    <div data-accordion-content>
    Accordion Content
    </div>
  </div>
  <!-- other items -->
</div>
<script>
  import { Accordion } from '@flexilla/accordion';

  const options = {
    preventClosingAll: false,
    allowTriggerOnFocus: true,
  };
  const accordion = new Accordion("#accordion", options);
</script>
```

That's it! You can now use the @flexilla/accordion package to create interactive accordion menus in your web applications.
