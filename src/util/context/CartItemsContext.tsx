import { JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

// Define the shape of a single cart item
export interface CartItem {
    productId: number;
    productName: string;
    imageUrl: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

// Define the context value type
interface CartItemsContextType {
    cartItems: CartItem[];
    setCartItems: (value: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

// Create the context with correct type (nullable for initialization)
const CartItemsContext = createContext<CartItemsContextType | undefined>(undefined);

// Define the props for the provider
interface CartItemsProviderProps {
    children: JSX.Element;
}

export function CartItemsProvider(props: CartItemsProviderProps) {
    const [cartItems, setCartItems] = createStore<CartItem[]>([]);

    return (
        <CartItemsContext.Provider value={{ cartItems, setCartItems }}>
            {props.children}
        </CartItemsContext.Provider>
    );
}

export function useCartItemsContext(): CartItemsContextType {
    const context = useContext(CartItemsContext);
    if (!context) {
        throw new Error("useCartItemsContext must be used within a <CartItemsProvider>");
    }
    return context;
}