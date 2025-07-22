import {createSignal, JSX, Show} from "solid-js";
import {DeleteProductModal} from "../../../modals/DeleteProductModal";

interface AdminProductCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryName: string;
    imageUrl: string;
    isDeleted: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onRecover?: (id: number) => void;
}

export default function AdminProductCard(props: AdminProductCardProps): JSX.Element {
    const baseUrl = "https://localhost:7221";

    return (
        <div class="relative bg-white shadow-md rounded-xl overflow-hidden flex flex-col border hover:shadow-lg transition">
            <div class="relative h-60 w-full overflow-hidden">
                <img
                    src={`${baseUrl}${props.imageUrl}`}
                    alt={props.name}
                    class="w-full h-full object-cover transition duration-200 hover:scale-105"
                    onError={(e) =>
                        (e.currentTarget.src = "/fallback.jpg")
                    }
                />
                <Show when={props.isDeleted}>
                    <div class="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center opacity-70">
                        <span class="text-white text-sm font-semibold">Deleted</span>
                    </div>
                </Show>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">{props.name}</h2>
                    <p class="text-sm text-gray-600 line-clamp-2">{props.description}</p>
                </div>

                <div class="flex flex-col space-y-1">
                    <p class="text-gray-800 font-semibold">${props.price.toFixed(2)}</p>
                    <p class="text-xs text-gray-500">{props.categoryName}</p>
                </div>

                <div class="mt-4 flex justify-between items-center">
                    <Show
                        when={!props.isDeleted}
                        fallback={
                            <button
                                class="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                                onClick={() => props.onRecover?.(props.id)}
                            >
                                Recover
                            </button>
                        }
                    >
                        <div class="flex gap-2">
                            <button
                                class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                                onClick={() => props.onEdit?.(props.id)}
                            >
                                Edit
                            </button>
                            <button
                                class="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                                onClick={() => props.onDelete?.(props.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
}
