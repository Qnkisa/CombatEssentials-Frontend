import {createEffect, createSignal, onMount, Show} from "solid-js";
import {useNavigate, useParams} from "@solidjs/router";
import {RemoteRepositoryImpl} from "../../repository/RemoteRepositoryImpl";
import {useAuthContext} from "../../util/context/AuthContext";
import {useUserContext} from "../../util/context/UserContext";
import {CreateReviewModal} from "../modals/CreateReviewModal";
import {useCartItemsContext} from "../../util/context/CartItemsContext";
import LoadingIndicator from "../components/general-components/LoadingIndicator";

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

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const params = useParams();

    const productId = () => Number(params.id);

    const navigate = useNavigate();
    const baseUrl = "https://localhost:7221";
    const { cartItems, setCartItems } = useCartItemsContext();


    onMount(async () => {
        if (!productId()) {
            navigate("/*");
            return;
        }

        try {
            setIsLoading(true);
            const result = await repo.getProductById(productId());
            setProduct(result);
            setIsLoading(false);
        } catch (err) {
            navigate("/*");
        }finally {
            setIsLoading(false);
        }
    });

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    // Wishlist logic
    const [wishlist, setWishlist] = createSignal<any[]>([]);
    const handleAddToWishlist = async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(true);
            await repo.addToWishlist(bearer, productId());
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    const removeFromWishlist = async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(true);
            await repo.removeFromWishlist(bearer, productId());
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    onMount(async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(true);
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    })

    const isInWishlist = () => {
        return wishlist().some((item) => item.id === productId());
    };

    // Reviews logic
    const [isOpenCreate, setIsOpenCreate] = createSignal<true | undefined>(undefined);
    const [averageRating, setAverageRating] = createSignal<number>();
    const [productReviews, setProductReviews] = createSignal<any[]>([]);

    const getAverageRating = async () => {
        try {
            setIsLoading(true);
            const result = await repo.getProductAverageRating(productId());
            setAverageRating(result.averageRating);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    const getProductReviews = async () => {
        try {
            setIsLoading(true);
            const result = await repo.getAllProductReviews(productId());
            setProductReviews(result);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    const handleReviewDelete = async (reviewId: number) => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(true);
            await repo.deleteProductReview(bearer, reviewId);
            await getProductReviews();
            await getAverageRating();
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }finally{
            setIsLoading(false);
        }
    }

    onMount(async () => {
        await getAverageRating();
        await getProductReviews();
    })

    const handleAddToCart = async () => {
        const p = product();
        if (!p) return;

        const bearer = token();

        if(bearer){
            if (cartItems.some(item => item.productId === productId())) {
                try{
                    const item = cartItems.find(item => item.productId === productId());
                    const newQuantity = item ? item.quantity : 0;
                    const totalQuantity = quantity() + newQuantity;
                    const cartItemId = item ? item.id : 0;

                    setIsLoading(true);

                    await repo.updateCartItemQuantity(bearer, cartItemId!, totalQuantity);

                    const newCart = await repo.getUserCart(bearer);
                    setCartItems(newCart);

                    setIsLoading(false);
                }catch(err){
                    console.log(err);
                }finally{
                    setIsLoading(false);
                }
            }
            else{
                try{
                    setIsLoading(true);

                    await repo.addToCart(bearer, productId(), quantity());

                    const newCart = await repo.getUserCart(bearer);
                    setCartItems(newCart);

                    setIsLoading(false);
                }catch(err){
                    console.log(err);
                }finally {
                    setIsLoading(false);
                }
            }
        }
        else{
            setCartItems((prev) => {
                const index = prev.findIndex(item => item.productId === p.id);

                let newCartItems;
                if (index === -1) {
                    // Not found - add new
                    newCartItems = [
                        ...prev,
                        {
                            id: undefined,
                            shoppingCartId: undefined,
                            productId: p.id,
                            productName: p.name,
                            productImageUrl: p.imageUrl,
                            quantity: quantity(),
                            productPrice: p.price,
                            totalPrice: p.price * quantity(),
                        }
                    ];
                } else {
                    // Found - update quantity and totalPrice
                    newCartItems = [...prev];
                    const existing = newCartItems[index];
                    const newQuantity = existing.quantity + quantity();
                    newCartItems[index] = {
                        ...existing,
                        quantity: newQuantity,
                        totalPrice: existing.productPrice * newQuantity,
                    };
                }

                // Save to localStorage
                localStorage.setItem("cartItems", JSON.stringify(newCartItems));
                return newCartItems;
            });
        }
    }

    return (
        <div class="w-5/6 mx-auto px-4 py-10 bg-white my-10 rounded-3xl">
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..." />
            <CreateReviewModal
                state={isOpenCreate()}
                onClose={() => setIsOpenCreate(undefined)}
                onSuccess={async () => {
                    setIsOpenCreate(undefined);
                    await getProductReviews();
                    await getAverageRating();
                }}
                productId={productId()}
            />

            <Show when={product()} fallback={<div class="text-center text-xl">Loading product...</div>}>
                {(p) => (
                    <div>
                        <div class="flex flex-col md:flex-row gap-10 items-start pb-10">
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
                                        onClick={handleAddToCart}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/*Product reviews*/}
                        <div class="border-t border-gray-200 pt-10">
                            <div class="flex justify-between items-center">
                                <h2 class="text-black text-2xl font-semibold">Product Reviews
                                    - {averageRating()?.toFixed(2)} (avg. rating)</h2>
                                <div>
                                    <Show when={user()}>
                                        <button
                                            class="bg-green-600 text-white rounded-lg p-2 text-sm sm:text-base font-medium hover:bg-green-700 transition cursor-pointer"
                                            onClick={() => setIsOpenCreate(true)}
                                        >
                                            Create Review
                                        </button>
                                    </Show>
                                </div>
                            </div>
                            <Show when={productReviews().length > 0}
                                  fallback={<p class="text-gray-500 mt-4">No reviews yet.</p>}>
                                <div class="mt-6 space-y-6">
                                    {[...productReviews()]
                                        .sort((a, b) => {
                                            const currentUserId = user()?.id;
                                            if (!currentUserId) return 0;
                                            const aIsCurrent = a.userId === currentUserId ? -1 : 0;
                                            const bIsCurrent = b.userId === currentUserId ? -1 : 0;
                                            return bIsCurrent - aIsCurrent;
                                        }).map((review) => (
                                        <div class="border border-gray-200 p-4 rounded-lg shadow-sm">
                                            <div class="flex justify-between items-center">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-semibold text-lg text-black">{review.userName}</span>
                                                    <span class="text-yellow-500">{"★".repeat(review.rating)}</span>
                                                    <span class="text-gray-500 text-sm">
                            {review.createdAt}
                        </span>
                                                </div>
                                                <Show when={review.userId === user()?.id}>
                                                    <button
                                                        class="cursor-pointer bg-red-500 p-2 rounded-full transition hover:bg-red-600"
                                                        onClick={() => handleReviewDelete(review.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                            <path d="M3 6h18" />
                                                            <path d="M8 6v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
                                                            <rect x="5" y="6" width="14" height="15" rx="2" ry="2" />
                                                            <line x1="9" y1="10" x2="9" y2="17" />
                                                            <line x1="12" y1="10" x2="12" y2="17" />
                                                            <line x1="15" y1="10" x2="15" y2="17" />
                                                        </svg>
                                                    </button>
                                                </Show>
                                            </div>
                                            <p class="mt-2 text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </Show>

                        </div>
                    </div>
                )}
            </Show>
        </div>
    );
}
