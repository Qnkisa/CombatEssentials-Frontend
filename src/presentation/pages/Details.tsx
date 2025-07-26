import {createEffect, createSignal, onMount, Show} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {RemoteRepositoryImpl} from "../../repository/RemoteRepositoryImpl";
import {useAuthContext} from "../../util/context/AuthContext";
import {useUserContext} from "../../util/context/UserContext";

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
    const [token] = useAuthContext();
    const [user] = useUserContext();
    const [wishlist, setWishlist] = createSignal<any[]>([]);

    const params = useParams();

    const productId = () => Number(params.id);

    const navigate = useNavigate();
    const baseUrl = "https://localhost:7221";

    onMount(async () => {
        if (!productId()) {
            navigate("/*");
            return;
        }

        try {
            const result = await repo.getProductById(productId());
            setProduct(result);
        } catch (err) {
            navigate("/*");
        }
    });

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    // Wishlist logic

    const handleAddToWishlist = async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            await repo.addToWishlist(bearer, productId());
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
        } catch (err) {
            console.log(err);
        }
    }

    const removeFromWishlist = async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            await repo.removeFromWishlist(bearer, productId());
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
        } catch (err) {
            console.log(err);
        }
    }

    onMount(async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
        } catch (err) {
            console.log(err);
        }
    })

    const isInWishlist = () => {
        return wishlist().some((item) => item.id === productId());
    };

    return (
        <div class="w-5/6 mx-auto px-4 py-10 bg-white my-10 rounded-3xl">
            <Show when={product()} fallback={<div class="text-center text-xl">Loading product...</div>}>
                {(p) => (
                    <div class="flex flex-col md:flex-row gap-10 items-start">
                        {/* Image */}
                        <div class="w-full md:w-1/2 flex justify-center relative">
                            {/* Wishlist Icon */}
                            <Show when={user()}>
                                <Show
                                    when={isInWishlist()}
                                    fallback={
                                        <div
                                            class="absolute top-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow-md"
                                            onClick={handleAddToWishlist}
                                        >
                                            <svg width="50" height="50" viewBox="0 0 24 24" fill="yellow"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 2L14.9452 8.76336L22.1803 9.52786L16.5901 14.4866L18.3607 21.4721L12 17.5L5.63932 21.4721L7.40991 14.4866L1.81966 9.52786L9.05481 8.76336L12 2Z"/>
                                            </svg>
                                        </div>
                                    }
                                >
                                    <div
                                        class="absolute top-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow-md"
                                        onClick={removeFromWishlist}
                                    >
                                        <svg width="50" height="50" viewBox="0 0 24 24" fill="red"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h.74C13.09 5.01 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            <line x1="8" y1="8" x2="16" y2="16" stroke="white" stroke-width="2"/>
                                            <line x1="16" y1="8" x2="8" y2="16" stroke="white" stroke-width="2"/>
                                        </svg>
                                    </div>
                                </Show>
                            </Show>
                            <img
                                src={`${baseUrl}${p().imageUrl}`}
                                alt={p().name}
                                class="rounded-2xl shadow-lg object-cover object-top max-h-[500px] w-full"
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
