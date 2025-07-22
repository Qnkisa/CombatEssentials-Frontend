import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { RegisterModal } from "../../modals/RegisterModal";
import { LoginModal } from "../../modals/LoginModal";
import { useUserContext } from "../../../util/context/UserContext";
import { useAuthContext } from "../../../util/context/AuthContext";

export default function Header() {
    const [isMobileOpen, setIsMobileOpen] = createSignal<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = createSignal<true | undefined>(undefined);
    const [isLoginOpen, setIsLoginOpen] = createSignal<true | undefined>(undefined);
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = createSignal<boolean>(false);

    const [user, setUser] = useUserContext();
    const [token, setToken] = useAuthContext();
    const navigate = useNavigate();

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

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <A href="/" class="text-2xl font-bold text-gray-800">
                    MySite
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
                            <A href="/profile" class="hover:text-blue-600 transition" aria-label="Profile">
                                Profile
                            </A>
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
                                            <A href="/admin/products" class="block px-4 py-2 hover:bg-gray-100">Products</A>
                                        </div>
                                    </Show>
                                </div>
                            </Show>
                            <button onClick={handleLogout} class="hover:text-blue-600 transition cursor-pointer">
                                Logout
                            </button>
                        </Show>
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
                        <A href="/profile" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-600 flex items-center gap-1" aria-label="Profile">
                            Profile
                        </A>
                        <Show when={user()?.isAdmin}>
                            <div class="flex flex-col space-y-1">
                                <A href="/admin" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-600">
                                    Admin
                                </A>
                                <div class="pl-4 flex flex-col space-y-1 text-sm text-gray-600">
                                    <A href="/admin/orders" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-500">Orders</A>
                                    <A href="/admin/products" onClick={() => setIsMobileOpen(false)} class="hover:text-blue-500">Products</A>
                                </div>
                            </div>
                        </Show>
                        <button onClick={handleLogout} class="hover:text-blue-600 cursor-pointer text-left">
                            Logout
                        </button>
                    </Show>
                </nav>
            </Show>
        </div>
    );
}
