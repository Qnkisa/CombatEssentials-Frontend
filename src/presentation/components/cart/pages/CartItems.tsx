import {CartItem, useCartItemsContext} from "../../../../util/context/CartItemsContext";
import {useAuthContext} from "../../../../util/context/AuthContext";
import {useNavigate} from "@solidjs/router";
import {createMemo, createSignal, onMount, Show} from "solid-js";
import {RemoteRepositoryImpl} from "../../../../repository/RemoteRepositoryImpl";
import LoadingIndicator from "../../general-components/LoadingIndicator";

const repo = new RemoteRepositoryImpl();

export default function CartItems() {
    const {cartItems, setCartItems} = useCartItemsContext();
    const baseUrl = "https://localhost:7221";
    const [token] = useAuthContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    onMount(() => {console.log(cartItems)});

    const increaseQuantity = async (productId: number) => {
        if (token()) {
            const bearer = token();
            if(!bearer)return;

            try{

                const item = cartItems.find(item => item.productId === productId);
                const cartItemId = item ? item.id : 0;
                const oldQuantity = item ? item.quantity : 0;
                const newQuantity = oldQuantity + 1;

                setIsLoading(true);

                await repo.updateCartItemQuantity(bearer,cartItemId!, newQuantity);
                const newCart = await repo.getUserCart(bearer);
                setCartItems(newCart);
                setIsLoading(false);
            }catch(err){
                console.log(err);
            }finally{
                setIsLoading(false);
            }

        } else {
            setCartItems((prev: CartItem[]) =>
                prev.map(item =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            totalPrice: item.productPrice * (item.quantity + 1),
                        }
                        : item
                )
            );
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    };

    const decreaseQuantity = async (productId: number) => {
        if (token()) {
            const bearer = token();
            if(!bearer)return;

            try{
                const item = cartItems.find(item => item.productId === productId);
                const cartItemId = item ? item.id : 0;
                const oldQuantity = item ? item.quantity : 0;
                const newQuantity = oldQuantity - 1;

                setIsLoading(true);
                await repo.updateCartItemQuantity(bearer,cartItemId!,newQuantity);
                const newCart = await repo.getUserCart(bearer);
                setCartItems(newCart);
                setIsLoading(false);
            }catch(err){
                console.log(err);
            }finally{
                setIsLoading(false);
            }

        } else {
            setCartItems((prev: CartItem[]) =>
                prev
                    .map(item =>
                        item.productId === productId && item.quantity > 1
                            ? {
                                ...item,
                                quantity: item.quantity - 1,
                                totalPrice: item.productPrice * (item.quantity - 1),
                            }
                            : item
                    )
                    // Optional: If quantity hits 0, remove the item
                    .filter(item => item.quantity > 0)
            );
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    };

    const removeItem = async (productId: number) => {
        if (token()) {
            const bearer = token();
            if(!bearer)return;

            try{
                const item = cartItems.find(item => item.productId === productId);
                const cartItemId = item ? item.id : 0;

                setIsLoading(true);
                await repo.removeFromCart(bearer, cartItemId!);

                const newCart = await repo.getUserCart(bearer);
                setCartItems(newCart);
                setIsLoading(false);
            }catch(err){
                console.log(err);
            }finally{
                setIsLoading(false);
            }

        } else {
            setCartItems((prev: CartItem[]) => prev.filter(item => item.productId !== productId));
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }

    };

    const clearCart = async () => {
        if (token()) {
            const bearer = token();
            if(!bearer)return;

            try{
                setIsLoading(true);
                await repo.clearCart(bearer);
                setCartItems([]);
                setIsLoading(false);
            }catch(err){
                console.log(err);
            }finally{
                setIsLoading(false);
            }
        } else {
            localStorage.removeItem("cartItems");
            setCartItems([]);
        }
    };

    return (
        <Show when={cartItems.length > 0} fallback={
            <div class="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                <h2 class="text-3xl font-semibold mb-4">Your cart is empty</h2>
                <p>Add some products to see them here.</p>
            </div>
        }>
            <div class="max-w-7xl mx-auto p-4">
                <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
                <div class="flex justify-between items-center my-10">
                    <h1 class="text-4xl font-bold">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        class="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition cursor-pointer"
                        aria-label="Clear cart"
                    >
                        Clear Cart
                    </button>
                </div>

                <div class="my-10">
                    {cartItems.map((item: CartItem) => (
                        <div
                            class="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 text-black my-5"
                        >
                            <img
                                src={`${baseUrl}${item.productImageUrl}`}
                                alt={item.productName}
                                class="w-36 h-36 object-cover rounded"
                            />
                            <div class="flex-1 flex flex-col justify-between h-full">
                                <div>
                                    <h2 class="text-xl font-semibold">{item.productName}</h2>
                                    <p class="text-gray-600 mt-1">Price: ${item.productPrice}</p>
                                    <p class="text-gray-800 font-semibold mt-1">
                                        Total: ${item.totalPrice}
                                    </p>
                                </div>
                                <div class="mt-4 flex items-center gap-3">
                                    <button
                                        onClick={() => decreaseQuantity(item.productId)}
                                        class={`px-3 py-1 text-lg rounded select-none ${
                                            item.quantity === 1
                                                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                                                : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                        }`}
                                        disabled={item.quantity === 1}
                                        aria-label={`Decrease quantity of ${item.productName}`}
                                    >
                                        −
                                    </button>

                                    <span class="text-lg font-medium select-none">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item.productId)}
                                        class="bg-gray-200 hover:bg-gray-300 rounded px-3 py-1 text-lg select-none cursor-pointer"
                                        aria-label={`Increase quantity of ${item.productName}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item.productId)}
                                class="ml-auto bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"
                                     fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round">
                                    <path d="M3 6h18"/>
                                    <path d="M8 6v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/>
                                    <rect x="5" y="6" width="14" height="15" rx="2" ry="2"/>
                                    <line x1="9" y1="10" x2="9" y2="17"/>
                                    <line x1="12" y1="10" x2="12" y2="17"/>
                                    <line x1="15" y1="10" x2="15" y2="17"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <div class="w-full flex justify-end my-10">
                    <button onClick={() => navigate("/cart/checkout")}
                            class="flex items-center gap-2 bg-blue-600 transition hover:bg-blue-700 cursor-pointer text-white py-2 px-3 rounded">
                        <div>Checkout</div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="24"
                            height="24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </Show>

    );
}
