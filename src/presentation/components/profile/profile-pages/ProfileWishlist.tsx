import { createSignal, onMount } from "solid-js";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";
import { useAuthContext } from "../../../../util/context/AuthContext";
import {useNavigate} from "@solidjs/router";
import LoadingIndicator from "../../general-components/LoadingIndicator";
import {TopCenterPopup} from "../../general-components/TopCenterPopup";

const repo = new RemoteRepositoryImpl();

export default function ProfileWishlist() {
    const [wishlist, setWishlist] = createSignal<any[]>([]);
    const baseUrl = "https://localhost:7221";
    const [token] = useAuthContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const [popupState, setPopupState] = createSignal<{
        text: string;
        error?: boolean;
    } | null>(null);

    const getWishlist = async () => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(false);
            const result = await repo.getUserWishlist(bearer);
            setWishlist(result);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }finally{
            setIsLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (id: number) => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(true);
            await repo.removeFromWishlist(bearer, id);
            await getWishlist();
            setIsLoading(false);
            setPopupState({ text: "Product removed from wishlist!", error: true});
        } catch (e) {
            console.log(e);
        }finally{
            setIsLoading(false);
        }
    };

    onMount(async () => {
        await getWishlist();
    });

    return (
        <div class="w-full min-h-screen bg-gray-50 px-4 py-10">
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
            <TopCenterPopup state={popupState()} onClose={() => setPopupState(null)} />
            <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Your Wishlist</h1>

            {wishlist().length === 0 ? (
                <div class="text-center text-gray-500 text-lg mt-10">
                    Your wishlist is empty.
                </div>
            ) : (
                <div class="space-y-4 max-w-4xl mx-auto">
                    {wishlist().map((item) => (
                        <div
                            class="flex flex-col sm:flex-row items-center bg-white shadow-md rounded-xl overflow-hidden p-4 gap-4"
                        >
                            <img
                                src={`${baseUrl}${item.imageUrl}`}
                                alt={item.name}
                                class="w-full sm:w-32 h-32 object-cover rounded-md border"
                            />
                            <div
                                class="flex-1 w-full cursor-pointer"
                                onClick={() => navigate(`/details/${item.id}`)}
                            >
                                <h2 class="text-xl font-semibold text-gray-800">{item.name}</h2>
                                <p class="text-gray-600 text-sm mt-1">{item.description}</p>
                                <div class="mt-2 text-sm text-gray-500">
                                    Category: <span class="font-medium text-gray-700">{item.categoryName}</span>
                                </div>
                                <div class="mt-1 text-sm text-gray-500">
                                    Price: <span class="font-medium text-green-600">${item.price}</span>
                                </div>
                            </div>
                            <button
                                class="cursor-pointer bg-red-500 p-2 rounded-full transition hover:bg-red-600"
                                onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M8 6v-1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
                                    <rect x="5" y="6" width="14" height="15" rx="2" ry="2" />
                                    <line x1="9" y1="10" x2="9" y2="17" />
                                    <line x1="12" y1="10" x2="12" y2="17" />
                                    <line x1="15" y1="10" x2="15" y2="17" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
