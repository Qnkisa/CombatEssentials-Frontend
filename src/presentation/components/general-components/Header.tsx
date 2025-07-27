import {createSignal, Show} from "solid-js";
import {A, useNavigate} from "@solidjs/router";
import {RegisterModal} from "../../modals/RegisterModal";
import {LoginModal} from "../../modals/LoginModal";
import {useUserContext} from "../../../util/context/UserContext";
import {useAuthContext} from "../../../util/context/AuthContext";
import {useCartItemsContext} from "../../../util/context/CartItemsContext";

export default function Header() {
    const [isMobileOpen, setIsMobileOpen] = createSignal<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = createSignal<true | undefined>(undefined);
    const [isLoginOpen, setIsLoginOpen] = createSignal<true | undefined>(undefined);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = createSignal<boolean>(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = createSignal<boolean>(false);

    const [user, setUser] = useUserContext();
    const [token, setToken] = useAuthContext();
    const navigate = useNavigate();

    const {cartItems, setCartItems} = useCartItemsContext();
    const cartItemCount = () => 2;


    function handleLogout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem("combat_token");
        localStorage.removeItem("combat_user");
        setIsMobileOpen(false);
    }

    return (
        <div class="bg-white shadow-md">
            <RegisterModal
                state={isRegisterOpen()}
                onSuccess={() => setIsRegisterOpen(undefined)}
                onClose={() => setIsRegisterOpen(undefined)}
            />
            <LoginModal
                state={isLoginOpen()}
                onSuccess={() => setIsLoginOpen(undefined)}
                onClose={() => setIsLoginOpen(undefined)}
            />

            <div class="w-5/6 mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <A href="/" class="text-2xl font-bold text-gray-800">
                    CombatEssentials
                </A>

                {/* Desktop Nav */}
                <div class="hidden md:block">
                    <nav class="flex space-x-6 text-gray-700 font-medium items-center">
                        <A href="/" class="hover:text-blue-600 transition">
                            Home
                        </A>
                        <A href="/products" class="hover:text-blue-600 transition">
                            Products
                        </A>
                        <Show when={user()}
                              fallback={
                                  <div class="flex space-x-6">
                                      <button
                                          class="hover:text-blue-600 transition cursor-pointer"
                                          onClick={() => setIsRegisterOpen(true)}
                                      >
                                          Register
                                      </button>
                                      <button
                                          class="hover:text-blue-600 transition cursor-pointer"
                                          onClick={() => setIsLoginOpen(true)}
                                      >
                                          Login
                                      </button>
                                  </div>
                              }>
                            <div
                                class="relative group"
                                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                                onMouseLeave={() => setIsProfileDropdownOpen(false)}
                            >
                                <A href="/profile" class="hover:text-blue-600 transition" aria-label="Profile">
                                    Profile
                                </A>
                                <Show when={isProfileDropdownOpen()}>
                                    <div
                                        class="absolute top-full bg-white shadow rounded py-2 w-40 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <A href="/profile/info" class="block px-4 py-2 hover:bg-gray-100">Info</A>
                                        <A href="/profile/orders"
                                           class="block px-4 py-2 hover:bg-gray-100">Orders</A>
                                        <A href="/profile/wishlist"
                                           class="block px-4 py-2 hover:bg-gray-100">Wishlist</A>
                                    </div>
                                </Show>
                            </div>

                            <Show when={user()?.isAdmin}>
                                <div
                                    class="relative group"
                                    onMouseEnter={() => setIsAdminDropdownOpen(true)}
                                    onMouseLeave={() => setIsAdminDropdownOpen(false)}
                                >
                                    <A href="/admin" class="hover:text-blue-600 transition" aria-label="Admin Panel">
                                        Admin
                                    </A>
                                    <Show when={isAdminDropdownOpen()}>
                                        <div class="absolute top-full bg-white shadow rounded py-2 w-40 z-50">
                                            <A href="/admin/orders" class="block px-4 py-2 hover:bg-gray-100">Orders</A>
                                            <A href="/admin/products"
                                               class="block px-4 py-2 hover:bg-gray-100">Products</A>
                                        </div>
                                    </Show>
                                </div>
                            </Show>
                            <button onClick={handleLogout} class="hover:text-blue-600 transition cursor-pointer">
                                Logout
                            </button>
                        </Show>
                        <A href="/cart" class="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="24"
                                 height="24">
                                <path
                                    d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.82 14h8.88c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1 1 0 00-.88-1.48H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A1.99 1.99 0 007 18h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L7.82 14z"/>
                            </svg>
                            <Show when={cartItemCount() > 0}>
                                <span
                                    class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartItemCount()}
                                </span>
                            </Show>
                        </A>

                    </nav>
                </div>

                {/* Mobile Hamburger */}
                <div class="md:hidden">
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen())}
                        class="text-gray-800 focus:outline-none"
                    >
                        <svg
                            class="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d={
                                    isMobileOpen()
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <Show when={isMobileOpen()}>
                <nav class="md:hidden bg-white px-4 pb-4 flex flex-col space-y-3 shadow text-gray-700 font-medium">
                    <A href="/" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-600">
                        Home
                    </A>
                    <A href="/products" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-600">
                        Products
                    </A>
                    <Show when={user()}
                          fallback={
                              <>
                                  <button
                                      onClick={() => {
                                          setIsRegisterOpen(true);
                                          setIsMobileOpen(false);
                                      }}
                                      class="hover:text-blue-600 cursor-pointer text-left"
                                  >
                                      Register
                                  </button>
                                  <button
                                      onClick={() => {
                                          setIsLoginOpen(true);
                                          setIsMobileOpen(false);
                                      }}
                                      class="hover:text-blue-600 cursor-pointer text-left"
                                  >
                                      Login
                                  </button>
                              </>
                          }>
                        <A href="/profile" onClick={() => setIsMobileOpen(false)}
                           class="hover:text-blue-600 flex items-center gap-1" aria-label="Profile">
                            Profile
                        </A>
                        <Show when={user()?.isAdmin}>
                            <div class="flex flex-col space-y-1">
                                <A href="/admin" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-600">
                                    Admin
                                </A>
                                <div class="pl-4 flex flex-col space-y-1 text-sm text-gray-600">
                                    <A href="/admin/orders" onClick={() => setIsMobileOpen(false)}
                                       class="hover:text-blue-500">Orders</A>
                                    <A href="/admin/products" onClick={() => setIsMobileOpen(false)}
                                       class="hover:text-blue-500">Products</A>
                                </div>
                            </div>
                        </Show>
                        <button onClick={handleLogout} class="hover:text-blue-600 cursor-pointer text-left">
                            Logout
                        </button>
                    </Show>
                    <div>
                        <A href="/cart" class="relative" onClick={() => setIsMobileOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" width="24" height="24">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.82 14h8.88c.75 0 1.41-.41 1.75-1.03l3.58-6.49a1 1 0 00-.88-1.48H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A1.99 1.99 0 007 18h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L7.82 14z"/>
                            </svg>
                            <Show when={cartItemCount() > 0}>
                            <span class="absolute -top-1 -right-7.5 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {cartItemCount()}
                            </span>
                            </Show>
                        </A>
                    </div>
                </nav>
            </Show>
        </div>
    );
}
