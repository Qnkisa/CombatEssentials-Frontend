import { JSX, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const CartItemsContext = createContext<any>(undefined);

interface CartItemsProviderProps {
    children: JSX.Element;
}

export function CartItemsProvider(props: CartItemsProviderProps) {
    const [cartItems, setCartItems] = createStore<any[]>([]);

    return (
        <CartItemsContext.Provider value={{ cartItems, setCartItems }}>
            {props.children}
        </CartItemsContext.Provider>
    );
}

export function useCartItemsContext(): any {
    const context = useContext(CartItemsContext);
    if (!context) {
        throw new Error("useCartItemsContext must be used within a <CartItemsProvider>");
    }
    return context;
}
