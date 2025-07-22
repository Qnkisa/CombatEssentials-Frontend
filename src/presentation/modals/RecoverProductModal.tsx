import Modal from "./Modal";

export const RecoverProductModal = (props: {
    state: boolean | undefined;
    onSuccess: () => void;
    onClose: () => void;
}) => {
    return (
        <Modal state={props.state} onClose={props.onClose}>
            {(state) => (
                <div class="p-6 bg-white rounded-xl shadow-xl max-w-md w-full">
                    <h2 class="text-lg font-bold text-gray-800 mb-2">Recover Product</h2>
                    <p class="text-sm text-gray-600 mb-4">
                        Are you sure you want to recover this product? It will be visible again in your store.
                    </p>

                    <div class="flex justify-end gap-3">
                        <button
                            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm cursor-pointer"
                            onClick={props.onClose}
                        >
                            Cancel
                        </button>
                        <button
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold cursor-pointer"
                            onClick={props.onSuccess}
                        >
                            Recover
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
