export default function Footer() {
    return (
        <footer class="bg-gray-900 text-white">
            <div class="w-full mx-auto px-4 py-10">
                {/* Grid layout for desktop, stacked for mobile */}
                <div class="flex flex-col md:flex-row md:justify-between gap-8">
                    {/* Logo + Description */}
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold">CombatEssentials</h2>
                        <p class="text-gray-400 mt-2">
                            Modern solutions for your everyday needs. Clean, fast, and
                            accessible.
                        </p>
                    </div>

                    {/* Links */}
                    <div class="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <h3 class="text-sm font-semibold mb-2 text-gray-300">Company</h3>
                            <ul class="space-y-1">
                                <li><a href="/" class="hover:underline text-gray-400">Home</a></li>
                                <li><a href="/products" class="hover:underline text-gray-400">Products</a></li>
                                <li><a href="/about" class="hover:underline text-gray-400">About</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold mb-2 text-gray-300">Support</h3>
                            <ul class="space-y-1">
                                <li><a href="/contact" class="hover:underline text-gray-400">Contact</a></li>
                                <li><a href="/terms" class="hover:underline text-gray-400">Terms & Conditions</a></li>
                                <li><a href="/return" class="hover:underline text-gray-400">Return Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold mb-2 text-gray-300">Follow Us</h3>
                            <ul class="space-y-1">
                                <li><a href="#" class="hover:underline text-gray-400">Facebook</a></li>
                                <li><a href="#" class="hover:underline text-gray-400">Twitter</a></li>
                                <li><a href="#" class="hover:underline text-gray-400">Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div class="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} MySite. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
