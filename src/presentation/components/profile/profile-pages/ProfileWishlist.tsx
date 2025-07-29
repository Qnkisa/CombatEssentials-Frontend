import {createEffect, createMemo, createSignal, onMount, Show} from "solid-js";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";
import { useAuthContext } from "../../../../util/context/AuthContext";
import {useLocation, useNavigate} from "@solidjs/router";
import LoadingIndicator from "../../general-components/LoadingIndicator";
import {TopCenterPopup} from "../../general-components/TopCenterPopup";
import {valueOrFirst} from "../../../pages/Products";

const repo = new RemoteRepositoryImpl();

export default function ProfileWishlist() {
    const [wishlist, setWishlist] = createSignal<any[]>([]);
    const baseUrl = "https://localhost:7221";
    const [token] = useAuthContext();

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const [popupState, setPopupState] = createSignal<{
        text: string;
        error?: boolean;
    } | null>(null);

    const [lastPage, setLastPage] = createSignal(1);
    const [refetchTrigger, setRefetchTrigger] = createSignal(0);

    const location = useLocation();
    const navigate = useNavigate();

    const page = createMemo(() => {
        const value = valueOrFirst(location.query["page"]);
        return value ? decodeURIComponent(value) : "1";
    });

    const onSearch = (page: string) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        const params = queryParams.toString();
        navigate(`/profile/wishlist${params.length > 0 ? `?${params}` : ""}`);
    };

    createEffect(async () => {
        refetchTrigger();

        const fPage = page();

        const nPage = parseInt(fPage);

        const bearer = token();
        if(!bearer) return;

        try {
            setIsLoading(true);

            const result = await repo.getUserWishlist(
                bearer,
                nPage
            );

            setWishlist(result.products);
            setLastPage(result.lastPage);

            if (result.lastPage < nPage) {
                onSearch("1");
            }
            setIsLoading(false);
        } catch (err) {
            console.log("Failed to fetch products", err);
        }finally {
            setIsLoading(false);
        }
    });

    const handleRemoveFromWishlist = async (id: number) => {
        const bearer = token();
        if (!bearer) return;

        try {
            setIsLoading(true);
            await repo.removeFromWishlist(bearer, id);
            setRefetchTrigger(prev => prev + 1);
            setIsLoading(false);
            setPopupState({ text: "Product removed from wishlist!", error: true});
        } catch (e) {
            console.log(e);
        }finally{
            setIsLoading(false);
        }
    };


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

            <div class="flex justify-center mt-10">
                <Show when={lastPage() > 1}>
                    <div class="flex flex-wrap justify-center gap-2">
                        {/* First Page Button */}
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            aria-label="First Page"
                            onClick={() => onSearch("1")}
                            disabled={page() === "1"}
                        >
                            « First
                        </button>

                        {/* Previous Page Button */}
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            aria-label="Previous Page"
                            onClick={() =>
                                onSearch(
                                    (Math.max(1, parseInt(page() || "1") - 1)).toString()
                                )
                            }
                            disabled={page() === "1"}
                        >
                            ‹
                        </button>

                        {/* Dynamic Page Numbers with Ellipsis */}
                        {(() => {
                            const totalPages = lastPage();
                            const current = parseInt(page() || "1");
                            const pages = [];

                            const start = Math.max(1, current - 2);
                            const end = Math.min(totalPages, current + 2);

                            if (start > 1) {
                                pages.push(1);
                                if (start > 2) pages.push("...");
                            }

                            for (let i = start; i <= end; i++) {
                                pages.push(i);
                            }

                            if (end < totalPages) {
                                if (end < totalPages - 1) pages.push("...");
                                pages.push(totalPages);
                            }

                            return pages.map((p) =>
                                typeof p === "number" ? (
                                    <button
                                        type="button"
                                        class={`px-4 py-2 border rounded-md transition ${
                                            p === current
                                                ? "bg-gray-800 text-white border-gray-800"
                                                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                        }`}
                                        onClick={() =>
                                            onSearch(p.toString())
                                        }
                                    >
                                        {p}
                                    </button>
                                ) : (
                                    <span class="px-4 py-2 text-gray-400 select-none">…</span>
                                )
                            );
                        })()}

                        {/* Next Page Button */}
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            aria-label="Next Page"
                            onClick={() =>
                                onSearch(
                                    (Math.min(lastPage(), parseInt(page() || "1") + 1)).toString()
                                )
                            }
                            disabled={parseInt(page() || "1") >= lastPage()}
                        >
                            ›
                        </button>

                        {/* Last Page Button */}
                        <button
                            class="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            aria-label="Last Page"
                            onClick={() =>
                                onSearch(lastPage().toString())
                            }
                            disabled={parseInt(page() || "1") >= lastPage()}
                        >
                            Last »
                        </button>
                    </div>
                </Show>
            </div>
        </div>
    );
}
