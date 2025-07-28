import { createEffect, createSignal, on, Show, JSX } from "solid-js";

interface PopupContent {
    text: string;
    error?: boolean;
}

interface TopCenterPopupProps {
    state: PopupContent | null;
    onClose: () => void;
}

export const TopCenterPopup = (props: TopCenterPopupProps): JSX.Element => {
    const [isVisible, setIsVisible] = createSignal(false);
    const [content, setContent] = createSignal<PopupContent | null>(null);
    let closeTimeoutId: number | undefined;

    createEffect(
        on(
            () => props.state,
            (state) => {
                if (closeTimeoutId !== undefined) {
                    clearTimeout(closeTimeoutId);
                    closeTimeoutId = undefined;
                }

                if (state) {
                    setContent(state);
                    setTimeout(() => setIsVisible(true), 10);
                    closeTimeoutId = window.setTimeout(() => props.onClose(), 3000);
                } else if (isVisible()) {
                    setIsVisible(false);
                    setTimeout(() => setContent(null), 200);
                }
            }
        )
    );

    const SuccessIcon = (): JSX.Element => (
        <svg
            class="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
            />
        </svg>
    );

    const ErrorIcon = (): JSX.Element => (
        <svg
            class="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );

    return (
        <div
            class={`fixed inset-0 flex justify-center items-start my-2 transition-opacity duration-200 pointer-events-none z-50 ${
                isVisible() ? "opacity-100" : "opacity-0"
            }`}
        >
            <div class="flex flex-row w-auto h-auto p-3 bg-white shadow-sm rounded-3xl items-center pointer-events-auto">
                <div class="shrink-0">
                    <Show when={content()?.error} fallback={<SuccessIcon />}>
                        <ErrorIcon />
                    </Show>
                </div>
                <p class="ps-2">{content()?.text}</p>
            </div>
        </div>
    );
};
