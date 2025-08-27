import { useSignal } from "@preact/signals";

const Loader = ({ frameIsLoading }: { frameIsLoading: boolean }) => {
    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 backdrop-blur-2xl z30 bg-zinc1/60 rd-xl dark-bg-zinc9/60 p10 flex flex-col gap-y1 items-center justify-center origin-center ${frameIsLoading
                    ? "visible op100 scale-100"
                    : "transition-none duration-0 invisible opacity-0 scale-0"
                }`}
        >
            <span class="flex p-3 text-zinc8 dark-text-zinc2 text-sm">Loading... {frameIsLoading}</span>
            <div
                className="inline-block h10 w10 min-w10 min-h10 animate-spin rounded-full b-5px b-solid b-zinc8 dark-b-zinc dark-b-r-transparent b-r-transparent align-[-0.125em] motion-reduce-animate-[spin_1.5s_linear_infinite]"
                role="status"
            ></div>
        </div>
    );
};

const PreviewIframe = ({ prevUrl, name }: { prevUrl: string; name: string }) => {
    const frameIsLoading = useSignal(true);

    const handleLoad = () => {
        frameIsLoading.value = false;
    };

    const isLoading = frameIsLoading.value

    return (
        <div class="hfull w-full relative overflow-hidden">
            <Loader frameIsLoading={isLoading} />
            <iframe
                title={`Preview ${name}`}
                loading="lazy"
                onLoad={() => { handleLoad() }}
                src={prevUrl}
                className={"w-full hfull duration-300 ease-linear rd-xl overflow-hidden"}
            />
        </div>
    );
};

export default PreviewIframe;
