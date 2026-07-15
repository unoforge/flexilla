import toast from "@flexilla/toast"
import "./../main"

// Simple
document.querySelector("[data-toast='default']")?.addEventListener("click", () =>
  toast("Hello! This is a toast notification.")
)

document.querySelector("[data-toast='success']")?.addEventListener("click", () =>
  toast.success("Saved successfully!")
)

document.querySelector("[data-toast='error']")?.addEventListener("click", () =>
  toast.error("Something went wrong!")
)

document.querySelector("[data-toast='warning']")?.addEventListener("click", () =>
  toast.warning("Please check your input.")
)

document.querySelector("[data-toast='info']")?.addEventListener("click", () =>
  toast.info("New update available.")
)

// With description
document.querySelector("[data-toast='desc-success']")?.addEventListener("click", () =>
  toast.success("Profile updated!", { description: "Your changes have been saved successfully." })
)

document.querySelector("[data-toast='desc-error']")?.addEventListener("click", () =>
  toast.error("Upload failed!", { description: "The file exceeds the 10MB limit." })
)

// Positions
document.querySelector("[data-toast='pos-top-right']")?.addEventListener("click", () => {
  toast.config({ position: "top-right" })
  toast.success("Top Right")
})
document.querySelector("[data-toast='pos-top-left']")?.addEventListener("click", () => {
  toast.config({ position: "top-left" })
  toast.success("Top Left")
})
document.querySelector("[data-toast='pos-top-center']")?.addEventListener("click", () => {
  toast.config({ position: "top-center" })
  toast.success("Top Center")
})
document.querySelector("[data-toast='pos-bottom-right']")?.addEventListener("click", () => {
  toast.config({ position: "bottom-right" })
  toast.success("Bottom Right")
})
document.querySelector("[data-toast='pos-bottom-left']")?.addEventListener("click", () => {
  toast.config({ position: "bottom-left" })
  toast.success("Bottom Left")
})
document.querySelector("[data-toast='pos-bottom-center']")?.addEventListener("click", () => {
  toast.config({ position: "bottom-center" })
  toast.success("Bottom Center")
})

// Rich colors
document.querySelector("[data-toast='rich-success']")?.addEventListener("click", () => {
  toast.config({ richColors: true })
  toast.success("Order confirmed!")
})
document.querySelector("[data-toast='rich-error']")?.addEventListener("click", () => {
  toast.config({ richColors: true })
  toast.error("Payment failed!")
})
document.querySelector("[data-toast='rich-warning']")?.addEventListener("click", () => {
  toast.config({ richColors: true })
  toast.warning("Low disk space")
})
document.querySelector("[data-toast='rich-info']")?.addEventListener("click", () => {
  toast.config({ richColors: true })
  toast.info("Session expiring soon")
})

// Action buttons
document.querySelector("[data-toast='action']")?.addEventListener("click", () =>
  toast("Item deleted", {
    action: { label: "Undo", onClick: () => toast.success("Restored!") },
  })
)
document.querySelector("[data-toast='action-cancel']")?.addEventListener("click", () =>
  toast("File will be deleted permanently", {
    action: { label: "Confirm", onClick: () => toast.error("Deleted!") },
    // Cancel button is: action with cancel:true
    // For a separate cancel, use action + manual handling
    description: "This action cannot be undone",
  })
)

// Close button
document.querySelector("[data-toast='close-button']")?.addEventListener("click", () => {
  toast.config({ closeButton: true })
  toast.show("I have a close button")
})

// Long duration
document.querySelector("[data-toast='long-duration']")?.addEventListener("click", () =>
  toast.success("This stays for 10 seconds", { duration: 10000 })
)

// Persistent
document.querySelector("[data-toast='persistent']")?.addEventListener("click", () =>
  toast.warning("I won't auto-dismiss", { duration: Infinity as any })
)

// Promise
document.querySelector("[data-toast='promise']")?.addEventListener("click", () => {
  toast.promise(
    new Promise<string>((resolve) => setTimeout(() => resolve("Data loaded!"), 2000)),
    {
      loading: "Loading data...",
      success: (data) => `Data: ${data}`,
      error: "Failed to load data",
    }
  )
})

// Loading
document.querySelector("[data-toast='loading']")?.addEventListener("click", () => {
  const id = toast.loading("Processing...")
  setTimeout(() => {
    toast.success("Done!", { id })
  }, 2000)
})

// Dismiss all
document.querySelector("[data-toast='dismiss-all']")?.addEventListener("click", () =>
  toast.dismiss()
)
