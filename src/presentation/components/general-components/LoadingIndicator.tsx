import {Show} from "solid-js";

export const LoadingIndicator = (props: {
    isLoading: boolean;
    loadingText?: string;
}) => {

    return (
        <Show when={props.isLoading}>
            <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-black">
                <div class="bg-white p-5 rounded-4xl shadow-lg flex flex-col items-center gap-2">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-green"></div>
                    <div class="mt-3 text-custom-black">{props.loadingText || "Loading..."}</div>
                </div>
            </div>
        </Show>
    );
};

export default LoadingIndicator;