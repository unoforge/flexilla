
import { copyToClipboard } from '@helper/preact-copycode';
import { useSignal } from '@preact/signals';
import { createRef } from 'preact';


export function CopyInBlockBtn() {
    const isCopied = useSignal(false)
    const btnBoxRef = createRef<HTMLDivElement>();
    const isCopiedValue = isCopied.value

    const copyToClipboard_ = async () => {
        const codePre = btnBoxRef.current?.closest("[data-code-component]")?.querySelector("pre")
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
        <>
            <div ref={btnBoxRef} className={"absolute right-2 top-2 z20 invisible opacity-0 group-hover-visible group-hover-op100"}>
                <button
                    className="flex p2 rounded-md backdrop-blur-xl bg-zinc2/80 dark-bg-zinc-800/80 focus-bg-zinc3/90 dark-focus-bg-zinc7/80 text-zinc-700 dark:text-zinc-300 children-flex"
                    aria-label='copy code'
                    onClick={() => {
                        copyToClipboard_();
                    }}
                    disabled={isCopiedValue}
                >
                    {isCopiedValue ? (
                        <span aria-hidden="true" class="flex i-fx-copied"/>
                    ) : (
                        <span aria-hidden="true" class="flex i-carbon-copy"/>
                    )}
                </button>
            </div>
        </>
    );
}