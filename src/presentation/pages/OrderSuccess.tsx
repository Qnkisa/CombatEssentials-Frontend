import { useNavigate } from "@solidjs/router";

export default function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div class="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 text-center space-y-6">
                <svg
                    class="mx-auto h-16 w-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <h2 class="text-3xl font-bold text-gray-800">Order Placed Successfully!</h2>
                <p class="text-gray-600 text-lg">
                    Thank you for your purchase. Your order has been placed and is being processed.
                </p>
                <button
                    class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
}
