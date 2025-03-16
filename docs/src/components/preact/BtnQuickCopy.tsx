// import { buttonVariants } from "@components/atoms/Button.astro"
import { copyToClipboard } from "@helper/preact-copycode";
import { cn } from "@lib/utils"
import { useSignal } from "@preact/signals";

export function BtnQuickCopy() {
  const isCopied = useSignal(false)
  const isCopiedValue = isCopied.value

  const copyToClipboard_ = async () => {
    const codePre = "npm i @flexilla/flexilla"
    copyToClipboard({
      snippet: codePre,
      onCopy() {
        isCopied.value = true;
      },
      onCopyCompleted() {
        isCopied.value = false;
      },
    })
  };
  return (
    <button className={`${cn(
      'bg-gradient-to-t from-zinc50 to-zinc1 dark-from-zinc950/80 dark-to-zinc9 b b-zinc2/80 dark-b-zinc8/90',
      'flex items-center gap-x3 relative text-sm',
      'h11 px6 rd-xl'
    )}`}
      aria-label='copy code'
      onClick={() => {
        copyToClipboard_();
      }}
      disabled={isCopiedValue}>
      npm i @flexilla/flexilla
      <span aria-hidden="true" class="flex pl2 b-l b-l-zinc3 dark-b-l-zinc7">
        {isCopiedValue ? (
          <span class="flex i-fx-copied" />
        ) : (
          <span class="flex i-carbon-copy" />
        )}
      </span>
    </button>
  )
}
