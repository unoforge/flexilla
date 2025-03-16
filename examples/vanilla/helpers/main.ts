import { dispatchCustomEvent } from "@flexilla/utilities"
import "./../main"


const button = document.querySelector('button') as HTMLButtonElement | null;
const targetDiv = document.querySelector('#target') as HTMLDivElement | null;
const targetN = document.querySelector('#target') as HTMLDivElement | null;

if (button && targetDiv) {
    // Add event listener to the div
    //   targetDiv

    targetN?.addEventListener('custom-click', (event: Event) => {
        alert('Custom event received!');
        const data = (event as CustomEvent).detail;
        console.log(`Received: ${data.message}`)
    });

    // Dispatch event when button is clicked
    button.addEventListener('click', () => {
        dispatchCustomEvent(targetDiv, 'custom-click', { message: 'Hello from button!', sourceBtn:button });
    });
}
