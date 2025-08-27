# @flexilla/auto-resize-area

This package provides a utility class, `AutoResizableTextArea`, that allows you to create auto-resizable text areas in your web applications.

## Installation

You can install the `@flexilla/auto-resize-area` package via npm:

```shell
npm install @flexilla/auto-resize-area
```

## Usage

To use the `AutoResizableTextArea` class, follow these steps:

Import the class into your JavaScript or TypeScript file:
```ts
import { AutoResizableTextArea } from '@flexilla/auto-resize-area';
```

Use it With JS
```js
const autoResizableTextarea = new AutoResizableTextArea('[data-my-autorizable]');
```

Okay Now the Your Text Area will now autonomatically resize based on its content whenever the user types or window is resized

If you don't want to have to create instance, you can use the shortcut function `fAutoResizableTextArea` like this :

```js
import { fAutoResizableTextArea } from '@flexilla/auto-resize-area';
fAutoResizableTextArea('[data-my-autorizable]');
```
## Example
```html
<textarea placeholder="Enter something here" data-autoresizable class="px-3 py-1.5 w-full rounded-md bg-gray50 border border-gray-200 dark:border-gray-800 focus:outline focus:outline-2 focus:outline-blue-600 dark:focus:outline-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-700 dark:text-gray-300 resize-none invalid:outline-red-600 dark:invalid:outline-red-500"></textarea>

<script>
  import { fAutoResizableTextArea } from '@flexilla/auto-resize-area';
  fAutoResizableTextArea('textarea');
</script>
```
