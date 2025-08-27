# @flexilla/modal | Modal/Overlay component

## Installation

To install the @flexilla/modal package, you can use npm:

```shell
npm install @flexilla/modal
```

## Usage

To use the Modal component, follow these steps:

1. Import the Modal class from @flexilla/modal:

```js
import { Modal } from '@flexilla/modal';
```
2. Create an instance of the Modal class by providing the necessary parameters

```js
const options = {
  // Specify any desired options here
};

const modal = new Modal('#modalElement', options, '#triggerElement' );
```

3. Use the available methods to show or hide the modal:
   
```js
// Show the modal
modal.showModal();

// Hide the modal
modal.hideModal();

// Check if the modal is hidden
const isHidden = modal.isHidden();
```

## Props/Parameters
| Name | Description | Data Attributes | Type | | --------------- | ----------------------------------------- | --------------- | ------------- | | modalElement | The HTML element representing the modal. | data-modal-id | HTMLElement | | triggerElement| The HTML element that triggers the modal. | data-modal-target | HTMLElement | | options | Optional configuration options for the modal. | - | ModalOptions|

## Available Options
| Option | Description | Data Attributes | Type | | --------------- | ----------------------------------------- | --------------- | ------------- | | autoInitModal | Automatically initialize the modal. | - | boolean | | isHidden | Check if the modal is hidden. | - | boolean | | showModal | Show the modal. | - | () => void | | hideModal | Hide the modal. | - | () => void |



## Example

Here's a simple example of how to use the Modal component:

```html
<div>
  <button data-modal-target="modal-alert" class="bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm">
    Animate On Enter
  </button>
  <div data-modal-test-2 aria-hidden="true" data-modal-id="modal-alert"
    data-modal-overlay="bg-gray8/70 backdrop-filter backdrop-blur-3xl" data-state="close"
    class="hidden justify-center items-start p-4 fixed w-screen h-screen top-0 left-0">
    <dialog data-modal-content data-enter-animation="fadeScale .4s linear"
      class="relative bg-white dark-bg-gray950 rounded-lg overflow-hidden w-full max-w-xl p-8 flex flex-col gap-y-4 items-center ease-linear transition-all">
      <div class="w-max p-3 rounded-full bg-red-200 text-red-600">
        <span flex i-carbon-trash-can text-lg></span>
      </div>
      <h2 class="font-semibold text-xl text-gray9 dark-text-white">
        Confirm your action
      </h2>
      <p class="text-gray7 dark-text-gray3">
        Are you sure you want to delete this event?
      </p>
      <div class="flex justify-center gap-x-3 pt-4">
        <button data-close-modal
          class="h-9 text-sm flex items-center px5 rounded-md bg-gray1 dark-bg-gray9 duration-300 hover-!bg-op60 text-gray8 dark-text-gray2">
          No, Cancel
        </button>
        <button class="h-9 text-sm flex items-center px-5 rounded-md bg-red-600 duration-200 hover:bg-red-600/80 text-white">
          Yes, Delete
        </button>
      </div>
    </dialog>
  </div>
</div>
```
In this example, clicking the "Animate On Enter" button will show the modal. The modal can be closed by clicking the "No, Cancel" button or the "Yes, Delete" button. Used UnoCSS for this example for styling