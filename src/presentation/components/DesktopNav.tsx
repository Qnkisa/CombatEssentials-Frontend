import { A } from "@solidjs/router";

export default function DesktopNav() {
    return (
        <nav class="flex space-x-6 text-gray-700 font-medium">
            <A href="/" class="hover:text-blue-600 transition">
                Home
            </A>
            <A href="/products" class="hover:text-blue-600 transition">
                Products
            </A>
        </nav>
    );
}
