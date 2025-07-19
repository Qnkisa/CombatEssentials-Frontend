import {createSignal, Show} from "solid-js";
import {A} from "@solidjs/router";
import DesktopNav from "./DesktopNav.tsx";
import MobileNav from "./MobileNav.tsx";

export default function Header() {
    const [isMobileOpen, setIsMobileOpen] = createSignal<boolean>(false);

    return (
        <div class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <A href="/" class="text-2xl font-bold text-gray-800">
                    MySite
                </A>

                {/* Desktop Nav */}
                <div class="hidden md:block">
                    <DesktopNav />
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
                <MobileNav onNavigate={() => setIsMobileOpen(false)} />
            </Show>
        </div>
    );
}