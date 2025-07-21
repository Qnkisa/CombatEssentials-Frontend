import {createEffect, createSignal, JSX, on, onCleanup, onMount} from "solid-js";
import {Portal} from "solid-js/web";

type ModalProps<T> = {
    state: T | undefined
    onClose: () => void;
    closeOnClickOutside?: boolean,
    children: (state: T) => JSX.Element;
}

function Modal<T>(props: ModalProps<T>) {
    const state = () => props.state
    const [modalRef, setModalRef] = createSignal<HTMLDivElement | undefined>(undefined)
    const [isVisible, setIsVisible] = createSignal(false);
    const [content, setContent] = createSignal<JSX.Element | null>(null);
    const [isClosing, setIsClosing] = createSignal(false);

    createEffect(on(state, (state) => {
        const visible = isVisible();
        if (state) {
            // Modal is opening
            setContent(props.children(state));
            setIsClosing(false);
            // Use setTimeout to ensure the DOM has updated before applying the transition
            setTimeout(() => {
                setIsVisible(true);
            }, 10);
        } else if (visible) {
            // Modal is closing
            setIsClosing(true);
            // First set isVisible to false to trigger the transition
            setIsVisible(false);
            // Then remove content after transition completes
            setTimeout(() => {
                if (isClosing()) {
                    setContent(null);
                    setIsClosing(false);
                }
            }, 300); // Match the duration in the CSS transition
        }
    }));

    const closeOnEscape = (e: KeyboardEvent) => {
        if (state() && e.key === "Escape") props.onClose();
    };

    const closeOnClickOutside = (e: MouseEvent) => {
        if (!state()) return;

        const fModalRef = modalRef();
        if (fModalRef && e.target === fModalRef) {
            if (props.closeOnClickOutside ?? true) {
                props.onClose();
            }
        }
    };

    onMount(() => {
        document.addEventListener("keydown", closeOnEscape);
        const fModalRef = modalRef();
        if (fModalRef) {
            fModalRef.addEventListener("click", closeOnClickOutside);
        }
    });

    onCleanup(() => {
        document.removeEventListener("keydown", closeOnEscape);
        const fModalRef = modalRef();
        if (fModalRef) {
            fModalRef.removeEventListener("click", closeOnClickOutside);
        }
    });

    return (
        <Portal>
            <div
                ref={setModalRef}
                class={`fixed inset-0 flex items-center justify-center z-50 bg-black/30 transition-opacity duration-300 ${isVisible() ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div class={`transition-transform duration-300 ${isVisible() ? 'scale-100' : 'scale-95'}`}>
                    {content()}
                </div>
            </div>
        </Portal>
    )
}

export default Modal;
