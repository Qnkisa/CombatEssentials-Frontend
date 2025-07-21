import { createContext, createSignal, useContext, JSX } from "solid-js";

type AuthContextType = [
    () => string | null,
    (token: string | null) => void
];

const UserCredentialsContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: JSX.Element }) {
    const [token, setToken] = createSignal<string | null>(
        localStorage.getItem("combat_token")
    );

    return (
        <UserCredentialsContext.Provider value={[token, setToken]}>
            {props.children}
        </UserCredentialsContext.Provider>
    );
}

export function useAuthContext(): AuthContextType {
    const context = useContext(UserCredentialsContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an <AuthProvider>");
    }
    return context;
}