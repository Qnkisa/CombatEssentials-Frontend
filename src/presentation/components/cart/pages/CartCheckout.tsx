import { createSignal } from "solid-js";
import { useCartItemsContext, CartItem } from "../../../../util/context/CartItemsContext";
import { useNavigate } from "@solidjs/router";
import { useAuthContext } from "../../../../util/context/AuthContext";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";
import { CreateOrderDto } from "../../../../util/dtos/CreateOrderDto";

const repo = new RemoteRepositoryImpl();

export default function CartCheckout() {
    const { cartItems, setCartItems } = useCartItemsContext();
    const [fullName, setFullName] = createSignal("");
    const [phoneNumber, setPhoneNumber] = createSignal("");
    const [shippingAddress, setShippingAddress] = createSignal("");
    const [error, setError] = createSignal("");
    const [fullNameError, setFullNameError] = createSignal(false);
    const [phoneNumberError, setPhoneNumberError] = createSignal(false);
    const [shippingAddressError, setShippingAddressError] = createSignal(false);
    const baseUrl = "https://localhost:7221";
    const navigate = useNavigate();
    const [token] = useAuthContext();

    const validateForm = () => {
        let isValid = true;

        if (!fullName().trim()) {
            setFullNameError(true);
            isValid = false;
        } else {
            setFullNameError(false);
        }

        if (!phoneNumber().trim()) {
            setPhoneNumberError(true);
            isValid = false;
        } else {
            setPhoneNumberError(false);
        }

        if (!shippingAddress().trim()) {
            setShippingAddressError(true);
            isValid = false;
        } else {
            setShippingAddressError(false);
        }

        return isValid;
    };

    const handleSubmit = async () => {
        setError("");

        if (!validateForm()) {
            setError("Please fill out all required fields.");
            return;
        }

        else{
            const payload: CreateOrderDto = {
                fullName: fullName(),
                phoneNumber: phoneNumber(),
                shippingAddress: shippingAddress(),
                orderItems: cartItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };

            try {
                await repo.createOrder(token() || undefined, payload);

                if(token()){
                    const bearer = token();
                    if(!bearer)return;

                    await repo.clearCart(bearer);
                    setCartItems([]);
                }else{
                    localStorage.removeItem("cartItems");
                    setCartItems([]);
                }

                navigate("/order-success");
            } catch (err) {
                setError("An error occurred while placing the order.");
                console.error(err);
            }
        }
    };

    return (
        <div class="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-7xl rounded-2xl shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Checkout form */}
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-gray-800">Shipping Information</h2>

                    {error() && <div class="text-red-600 font-medium">{error()}</div>}

                    <div>
                        <label class="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            class={`mt-1 w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 text-black ${fullNameError() ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
                            value={fullName()}
                            onInput={(e) => setFullName(e.currentTarget.value)}
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label class="text-sm text-gray-600">Phone Number</label>
                        <input
                            type="text"
                            class={`mt-1 w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 text-black ${phoneNumberError() ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
                            value={phoneNumber()}
                            onInput={(e) => setPhoneNumber(e.currentTarget.value)}
                            placeholder="+359 888 123 456"
                        />
                    </div>

                    <div>
                        <label class="text-sm text-gray-600">Shipping Address</label>
                        <textarea
                            rows={4}
                            class={`mt-1 w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 text-black ${shippingAddressError() ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"}`}
                            value={shippingAddress()}
                            onInput={(e) => setShippingAddress(e.currentTarget.value)}
                            placeholder="Street name, city, postal code..."
                        />
                    </div>

                    <button
                        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mt-4 font-semibold cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Place Order
                    </button>
                </div>

                {/* Right side: Cart items */}
                <div class="space-y-4 relative">
                    <h2 class="text-2xl font-bold text-gray-800">Your Cart</h2>
                    {cartItems.length === 0 ? (
                        <p class="text-gray-500">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item: CartItem) => (
                            <div class="flex items-center bg-gray-100 rounded-lg p-4 gap-4">
                                <img
                                    src={`${baseUrl}${item.productImageUrl}`}
                                    alt={item.productName}
                                    class="w-20 h-20 object-cover rounded"
                                />
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-800">{item.productName}</h3>
                                    <p class="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p class="text-sm text-gray-800 font-medium">
                                        Total: ${item.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => navigate("/cart/items")}
                        class="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition duration-200 cursor-pointer bottom-0 right-4 absolute"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
