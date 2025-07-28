import {A} from "@solidjs/router";
import {createSignal, For, onMount} from "solid-js";
import {RemoteRepositoryImpl} from "../../repository/RemoteRepositoryImpl";
import ProductCard from "../components/products/ProductCard";
import LoadingIndicator from "../components/general-components/LoadingIndicator";

const repo = new RemoteRepositoryImpl();

export default function Home(){
    const [products, setProducts] = createSignal<any[]>([]);
    const baseUrl = "https://localhost:7221";
    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    onMount(async() => {
        try {
            setIsLoading(true);
            const result = await repo.getRandomProducts();
            setProducts(result);
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }finally{
            setIsLoading(false);
        }
    })

    return <div class="w-full">
        <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
        {/*Home hero*/}
        <div class="relative w-full h-[90vh]">
            <div>
                <img class="w-full h-[90vh] object-cover absolute top-0 left-0 z-2" src="/home.jpg" alt="Home hero" />
            </div>
            <div class="absolute top-0 left-0 w-full h-[90vh] z-3 bg-black opacity-70"></div>
            <div class="absolute z-4 top-0 left-0 w-full h-full flex items-center justify-center px-6">
                <div class="text-center max-w-3xl text-white">
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Equip the Warrior Within
                    </h1>
                    <p class="text-lg sm:text-xl text-gray-300 mb-8">
                        Discover premium combat sports gear built for performance, protection, and power.
                    </p>
                    <A
                        href="/products"
                        class="inline-block bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg text-base sm:text-lg shadow-lg"
                    >
                        Shop Now
                    </A>
                </div>
            </div>
        </div>

        {/*Brands*/}
        <div class="w-5/6 mx-auto my-20">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10 sm:gap-10 lg:gap-8 xl:gap-3 items-center justify-items-center">
                <img src="/fairtex.png" alt="Fairtex" class="h-28 object-contain" />
                <img src="/hayabusa.png" alt="Hayabusa" class="h-28 object-contain" />
                <img src="/venum.png" alt="Venum" class="h-28 object-contain" />
                <img src="/rdx.png" alt="RDX" class="h-28 object-contain" />
                <img src="/tatami.png" alt="Tatami" class="h-28 object-contain" />
                <img src="/twins.png" alt="Twins Special" class="h-28 object-contain" />
            </div>
        </div>

        {/*Products*/}
        <div class="w-5/6 mx-auto my-40">
            <h2 class="text-5xl font-bold mb-20 text-center">Featured Products</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <For each={products()}>
                    {(product) => (
                        <ProductCard product={product} baseUrl={baseUrl} />
                    )}
                </For>
            </div>
        </div>

        {/* Certificates Section */}
        <div class="w-5/6 mx-auto my-24">
            <h2 class="text-4xl font-bold text-center my-12">Our Certifications</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* ISO 9001 */}
                <div class="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                    <img class="w-48 h-48 object-cover my-10" src="/iso9001.png"/>
                    <h3 class="text-xl font-semibold mb-2 text-black">ISO 9001:2015</h3>
                    <p class="text-gray-600 text-sm">
                        Certified Quality Management System ensuring consistent product quality and customer
                        satisfaction.
                    </p>
                </div>

                {/* CE Certification */}
                <div class="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                    <img class="w-48 h-48 object-cover my-10" src="/ce-certificate.png"/>
                    <h3 class="text-xl font-semibold mb-2 text-black">CE Certified</h3>
                    <p class="text-gray-600 text-sm">
                        Products conform to European safety, health, and environmental protection standards.
                    </p>
                </div>

                {/* FDA Approved */}
                <div class="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                    <img class="w-56 h-48 object-cover my-10" src="/fda.png"/>
                    <h3 class="text-xl font-semibold mb-2 text-black">FDA Approved</h3>
                    <p class="text-gray-600 text-sm">
                        Compliant with U.S. Food and Drug Administration guidelines for health and safety.
                    </p>
                </div>

                {/* GMP Certified */}
                <div class="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                    <img class="w-48 h-48 object-cover my-10" src="/gmp.png"/>
                    <h3 class="text-xl font-semibold mb-2 text-black">GMP Certified</h3>
                    <p class="text-gray-600 text-sm">
                        Adheres to Good Manufacturing Practices for quality production and facility standards.
                    </p>
                </div>

                {/* ISO 14001 */}
                <div class="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                    <img class="w-56 h-48 object-cover my-10" src="/iso14001.png"/>
                    <h3 class="text-xl font-semibold mb-2 text-black">ISO 14001</h3>
                    <p class="text-gray-600 text-sm">
                        Environmental management certification reflecting our commitment to sustainability.
                    </p>
                </div>

                {/* SGS Verified */}
                <div class="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                    <img class="w-80 h-48 object-cover my-10" src="/sgs.png"/>
                    <h3 class="text-xl font-semibold mb-2 text-black">SGS Tested</h3>
                    <p class="text-gray-600 text-sm">
                        Independently tested and verified for safety, durability, and performance by SGS.
                    </p>
                </div>
            </div>
        </div>

    </div>
}