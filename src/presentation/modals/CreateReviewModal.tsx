import { createSignal } from "solid-js";
import Modal from "./Modal";
import { RemoteRepositoryImpl } from "../../repository/RemoteRepositoryImpl";
import { useAuthContext } from "../../util/context/AuthContext";
import LoadingIndicator from "../components/general-components/LoadingIndicator";

const repo = new RemoteRepositoryImpl();

export const CreateReviewModal = (props: {
    state: boolean | undefined;
    onSuccess: () => void;
    onClose: () => void;
    productId: number;
}) => {
    const [rating, setRating] = createSignal<number | "">("");
    const [comment, setComment] = createSignal("");
    const [error, setError] = createSignal<string | null>(null);
    const [token] = useAuthContext();

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const onSubmit = async () => {
        setError(null);
        const authToken = token();
        if (!authToken) return;

        if (!rating() || !comment()) {
            setError("Please provide a rating and comment.");
            return;
        }

        try {
            setIsLoading(true);
            await repo.createProductReview(authToken, props.productId, Number(rating()), comment());
            setIsLoading(false);
            props.onSuccess();
            props.onClose();
        } catch (err) {
            console.error(err);
            setError("Error submitting review.");
        }finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal state={props.state} onClose={props.onClose}>
            {(state) => (
                <div class="max-h-[90vh] overflow-y-auto w-[300px] sm:w-[32rem] bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative text-gray-800">
                    <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
                    <button
                        type="button"
                        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        onClick={props.onClose}
                    >
                        &times;
                    </button>

                    <form
                        class="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-2">Leave a Review</h2>

                        <select
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={rating()}
                            onChange={(e) => setRating(Number(e.currentTarget.value))}
                            required
                        >
                            <option value="" disabled>
                                Rating (1 to 5)
                            </option>
                            {[1, 2, 3, 4, 5].map((r) => (
                                <option value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                            ))}
                        </select>

                        <textarea
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Write your comment"
                            value={comment()}
                            onInput={(e) => setComment(e.currentTarget.value)}
                            rows={4}
                            required
                        />

                        {error() && <p class="text-red-500 text-sm text-center">{error()}</p>}

                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white rounded-lg py-2 text-sm sm:text-base font-medium hover:bg-blue-700 transition cursor-pointer"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            )}
        </Modal>
    );
};
