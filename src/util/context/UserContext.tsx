import { createSignal, createContext, useContext, JSX } from "solid-js";
type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    isAdmin?: boolean;
} | null;

type UserContextType = [
    () => User,
    (user: User) => void
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider(props: { children: JSX.Element }) {
    const storedUser = localStorage.getItem("combat_user");
    const [user, setUser] = createSignal<User>(
        storedUser ? JSON.parse(storedUser) : null
    );

    return (
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    );
}

export function useUserContext(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a <UserProvider>");
    }
    return context;
}