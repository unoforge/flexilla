import { copyToClipboard } from '@helper/preact-copycode';
import { useSignal } from '@preact/signals';
import { createRef } from 'preact';

export default function ButtonCopyInTabCode() {

    const isCopied = useSignal(false)
    const triggerBoxRef = createRef<HTMLDivElement>()
    const isCopiedValue = isCopied.value

    const copyToClipboard_ = async () => {
        const tabParent = triggerBoxRef.current?.closest("[data-code-block]")
        const activePre = tabParent?.querySelector("[data-tab-panel][data-state=active] pre") as HTMLPreElement

        copyToClipboard({
            snippet: activePre,
            onCopy() {
                isCopied.value = true;
            },
            onCopyCompleted() {
                isCopied.value = false;
            },
        })
    };
    return (
        <div ref={triggerBoxRef} className={"relative pr1.5"}>
            <button
                className="flex group items-center justify-center size-8 rd-lg dark-focus-bg-zinc7/80 text-zinc7 dark-text-zinc3 children-flex"
                aria-label='copy code'
                onClick={() => {
                    copyToClipboard_();
                }}
                disabled={isCopiedValue}
            >
                {isCopiedValue ? (
                    <span aria-hidden="true" class="flex i-fx-copied" />
                ) : (
                    <span aria-hidden="true" class="flex i-carbon-copy" />
                )}
            </button>
        </div>
    )
}
