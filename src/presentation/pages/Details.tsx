import { createSignal, onMount, Show } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { RemoteRepositoryImpl } from "../../repository/RemoteRepositoryImpl";

const repo = new RemoteRepositoryImpl();

type Product = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    categoryId: number;
    categoryName: string;
    isDeleted: boolean;
};

export default function Details() {
    const [product, setProduct] = createSignal<Product | null>(null);
    const [quantity, setQuantity] = createSignal<number>(1);
    const params = useParams();
    const navigate = useNavigate();
    const baseUrl = "https://localhost:7221";

    onMount(async () => {
        const id = Number(params.id);
        if (!id) {
            navigate("/*");
            return;
        }

        try {
            const result = await repo.getProductById(id);
            setProduct(result);
        } catch (err) {
            navigate("/*");
        }
    });

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div class="w-5/6 mx-auto px-4 py-10 bg-white my-10 rounded-3xl">
            <Show when={product()} fallback={<div class="text-center text-xl">Loading product...</div>}>
                {(p) => (
                    <div class="flex flex-col md:flex-row gap-10 items-start">
                        {/* Image */}
                        <div class="w-full md:w-1/2 flex justify-center">
                            <img
                                src={`${baseUrl}${p().imageUrl}`}
                                alt={p().name}
                                class="rounded-2xl shadow-lg object-cover max-h-[500px] w-full max-w-md"
                            />
                        </div>

                        {/* Product Info */}
                        <div class="w-full md:w-1/2 space-y-6">
                            <h1 class="text-4xl font-bold text-gray-800">{p().name}</h1>
                            <p class="text-gray-600 text-lg">{p().description}</p>

                            <div class="text-xl">
                                <span class="font-semibold text-gray-800">Category:</span>{" "}
                                <span class="text-indigo-600">{p().categoryName}</span>
                            </div>

                            <div class="text-3xl font-bold text-green-700">${p().price.toFixed(2)}</div>

                            {/* Quantity Selector */}
                            <div class="flex items-center space-x-4 pt-4">
                                <span class="text-lg font-medium text-black">Quantity:</span>
                                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        class="px-3 py-1 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
                                        onClick={decrement}
                                    >
                                        -
                                    </button>
                                    <div class="px-4 py-1 text-lg text-indigo-600">{quantity()}</div>
                                    <button
                                        class="px-3 py-1 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
                                        onClick={increment}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div class="pt-6">
                                <button
                                    class="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-6 py-3 rounded-2xl shadow transition duration-200 ease-in-out"
                                    onClick={() => {
                                        // Placeholder: Implement cart logic later
                                        console.log("Added to cart", {
                                            product: p(),
                                            quantity: quantity(),
                                        });
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Show>
        </div>
    );
}
