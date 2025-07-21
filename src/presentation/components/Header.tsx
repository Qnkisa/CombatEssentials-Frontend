import {createSignal, Show} from "solid-js";
import {A} from "@solidjs/router";
import {RegisterModal} from "../modals/RegisterModal";

export default function Header() {
    const [isMobileOpen, setIsMobileOpen] = createSignal<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = createSignal<true | undefined>(undefined);
    return (
        <div class="bg-white shadow-md">
            <RegisterModal
                state={isRegisterOpen()}
                onSuccess={
                    () => setIsRegisterOpen(undefined)
                }
                onClose={
                    () => setIsRegisterOpen(undefined)
                }
            />
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <A href="/" class="text-2xl font-bold text-gray-800">
                    MySite
                </A>

                {/* Desktop Nav */}
                <div class="hidden md:block">
                    <nav class="flex space-x-6 text-gray-700 font-medium">
                        <A href="/" class="hover:text-blue-600 transition">
                            Home
                        </A>
                        <A href="/products" class="hover:text-blue-600 transition">
                            Products
                        </A>
                        <button
                            class="hover:text-blue-600 transition cursor-pointer"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            Register
                        </button>
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
                                        ? "M6 18L18 6M6 6l12 12" // X icon
                                        : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                                }
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <Show when={isMobileOpen()}>
                <nav class="md:hidden bg-white px-4 pb-4 flex flex-col space-y-3 shadow">
                    <A
                        href="/"
                        onClick={() => setIsMobileOpen(false)}
                        class="text-gray-700 font-medium hover:text-blue-600"
                    >
                        Home
                    </A>
                    <A
                        href="/products"
                        onClick={() => setIsMobileOpen(false)}
                        class="text-gray-700 font-medium hover:text-blue-600"
                    >
                        Products
                    </A>
                    <button
                        onClick={() => setIsRegisterOpen(true)}
                        class="text-gray-700 font-medium hover:text-blue-600 cursor-pointer"
                    >
                        Register
                    </button>
                </nav>
            </Show>
        </div>
    );
}