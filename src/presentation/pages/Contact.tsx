export default function Contact() {
    return (
        <div class="w-5/6 mx-auto px-2 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
            <div class="max-w-5xl mx-auto">
                <h1 class="text-3xl sm:text-5xl font-bold text-white mb-10 text-center">
                    Contact Us
                </h1>

                {/* Section 1 - Customer Support */}
                <section class="mb-10 space-y-4 text-base sm:text-lg">
                    <h2 class="text-2xl font-semibold text-white">1. Customer Support</h2>
                    <div class="text-gray-400">
                        <p class="py-4">
                            Our dedicated support team is here to assist you with any inquiries about our products,
                            orders, or general questions. Whether you’re a beginner or a seasoned fighter, we’re ready
                            to help.
                        </p>
                        <p class="py-4">
                            📧 Email: <a href="mailto:support@combatessentials.com" class="text-blue-600 underline">support@combatessentials.com</a><br />
                            ☎️ Phone: <span class="font-medium">+359 88 123 4567</span><br />
                            🕘 Hours: Monday – Friday, 9:00 AM – 6:00 PM (EET)
                        </p>
                    </div>
                </section>

                {/* Section 2 - Headquarters */}
                <section class="mb-10 space-y-4 text-base sm:text-lg">
                    <h2 class="text-2xl font-semibold text-white">2. Headquarters</h2>
                    <div class="text-gray-400">
                        <p class="py-4">
                            Our office and warehouse are located in Sofia, Bulgaria. While we do not offer walk-in
                            service at this time, you can reach out via phone or email to schedule a consultation or
                            pickup (where available).
                        </p>
                        <p class="py-4">
                            📍 <span class="font-medium">Combat Essentials Ltd.</span><br />
                            24 Tsarigradsko Shose Blvd<br />
                            Sofia 1784, Bulgaria
                        </p>
                    </div>
                </section>

                {/* Section 3 - Social Media */}
                <section class="space-y-4 text-base sm:text-lg">
                    <h2 class="text-2xl font-semibold text-white">3. Connect with Us</h2>
                    <div class="text-gray-400">
                        <p class="py-4">
                            Stay up to date with product launches, promotions, and combat training tips by following us
                            on social media. Join our community of athletes and martial artists from around the world!
                        </p>
                        <ul class="list-disc list-inside ml-4 space-y-2">
                            <li>
                                📷 Instagram: <a href="https://www.instagram.com/combatessentials" target="_blank" class="text-blue-600 underline">@combatessentials</a>
                            </li>
                            <li>
                                👍 Facebook: <a href="https://www.facebook.com/combatessentials" target="_blank" class="text-blue-600 underline">/combatessentials</a>
                            </li>
                            <li>
                                🎥 YouTube: <a href="https://www.youtube.com/@combatessentials" target="_blank" class="text-blue-600 underline">@combatessentials</a>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
