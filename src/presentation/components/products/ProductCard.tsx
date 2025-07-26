import type { Component } from "solid-js";
import {A} from "@solidjs/router";

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageUrl: string;
        categoryName: string;
    };
    baseUrl: string;
}

const ProductCard: Component<ProductCardProps> = ({ product, baseUrl }) => {
    return (
        <div class="bg-white shadow-md hover:shadow-xl transition-shadow rounded-2xl overflow-hidden flex flex-col border border-gray-100">
            <img
                src={`${baseUrl}${product.imageUrl}`}
                alt={product.name}
                class="w-full h-64 object-cover bg-gray-100"
                onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            />
            <div class="p-5 flex flex-col gap-2 flex-grow">
                <h3 class="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p class="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                <div class="mt-2">
                    <p class="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    <p class="text-sm text-gray-500">{product.categoryName}</p>
                </div>
                <A
                    href={`/details/${product.id}`}
                    class="mt-auto inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md text-center transition-colors"
                >
                    View Details
                </A>
            </div>
        </div>
    );
};

export default ProductCard;
