# @flexilla/pin-input | PIN Input Component

`@flexilla/pin-input` is a lightweight JavaScript component for creating PIN and OTP input fields with validation and keyboard navigation support.

## Installation

```shell
npm install @flexilla/pin-input
```

Import 
```js
import { PinInput } from '@flexilla/pin-input';
```

## Usage

Create your HTML structure with input elements that have the `data-pin-input` attribute:

```html
<div data-demo-1 class="flex items-center gap-2"> 
  <input data-pin-input maxlength="1" class="size-10 border border-gray-200 rounded-md"/> 
  <input data-pin-input maxlength="1" class="size-10 border border-gray-200 rounded-md"/> 
  <input data-pin-input maxlength="1" class="size-10 border border-gray-200 rounded-md"/> 
  <input data-pin-input maxlength="1" class="size-10 border border-gray-200 rounded-md"/> 
</div>
```

Initialize the PinInput component:

```js
const pinContainer = document.querySelector('[data-demo-1]');
const pinInput = new PinInput(pinContainer, {
  validation: /\d/ // Optional: Custom validation regex (default: digits only)
});

// Listen for changes
pinInput.onChange((value) => {
  console.log('Current value:', value);
  
  if (pinInput.isComplete) {
    console.log('PIN is complete!');
    // Submit form or perform verification
  }
});

// Clean up event listeners when done
// pinInput.cleanup();
```

## Features

- Automatic focus management between inputs
- Paste support for filling multiple fields at once
- Keyboard navigation (arrow keys, backspace)
- Custom validation with regex patterns
- Completion detection
- Event callbacks

## API

### Options

| Name | Description | Type | Default |
| ---- | ----------- | ---- | ------- |
| validation | Regular expression for input validation | RegExp | `/\d/` (digits only) |

### Methods

| Method | Description |
| ------ | ----------- |
| `onChange(callback)` | Register a callback function that receives the current value when changed |
| `cleanup()` | Remove all event listeners |

### Properties

| Property | Description | Type |
| -------- | ----------- | ---- |
| `value` | Current combined value of all inputs | string |
| `isComplete` | Whether all input fields are filled | boolean |