import {createEffect, createMemo, createSignal, For, onMount, Show} from "solid-js";
import { useAuthContext } from "../../../../util/context/AuthContext";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";
import AdminOrderCard from "../admin-components/AdminOrderCard";
import LoadingIndicator from "../../general-components/LoadingIndicator";
import {valueOrFirst} from "../../../pages/Products";
import {useLocation, useNavigate} from "@solidjs/router";

const repo = new RemoteRepositoryImpl();

export default function AdminOrders() {
    const [orders, setOrders] = createSignal<any[]>([]);
    const [token] = useAuthContext();

    const [isLoading, setIsLoading] = createSignal<boolean>(true);

    const [lastPage, setLastPage] = createSignal(1);

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
        navigate(`/admin/orders${params.length > 0 ? `?${params}` : ""}`);
    };

    createEffect(async () => {
        const fPage = page();

        const nPage = parseInt(fPage);

        const bearer = token();
        if(!bearer) return;

        try {
            setIsLoading(true);

            const result = await repo.getAllAdminOrders(
                bearer,
                nPage
            );
            setOrders(result.orders);
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

    return (
        <div class="w-full min-h-screen bg-gray-50 px-4 py-10">
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
            <div class="mx-auto py-10 px-4 text-center">
                <h1 class="text-2xl sm:text-5xl font-bold text-gray-800">Orders</h1>
            </div>

            <div class="w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 pb-20">
                <For each={orders()}>
                    {(order) => (
                        <AdminOrderCard
                            id={order.id}
                            userId={order.userId}
                            fullName={order.fullName}
                            phoneNumber={order.phoneNumber}
                            shippingAddress={order.shippingAddress}
                            orderDate={order.orderDate}
                            totalAmount={order.totalAmount}
                            orderStatus={order.orderStatus}
                            orderItems={order.orderItems}
                        />
                    )}
                </For>
            </div>

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
