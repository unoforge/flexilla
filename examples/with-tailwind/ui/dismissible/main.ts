import { Dismissible } from "@flexilla/dismissible"
import "../../main"


const demo = new Dismissible('[data-remove-from-dom]', "remove-from-dom")
new Dismissible('[data-remove-from-screen]')

const triggerDemo = document.querySelector("[data-restore-demo]") as HTMLElement

triggerDemo.addEventListener("click",()=>{
    demo.restore()
})