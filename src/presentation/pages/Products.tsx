import { RemoteRepositoryImpl } from "../../repository/RemoteRepositoryImpl";
import {createEffect, createSignal, For, createMemo, Show} from "solid-js";
import ProductCard from "../components/products/ProductCard";
import { useLocation, useNavigate } from "@solidjs/router";
import ProductsFilter from "../components/products/ProductsFilter";
import LoadingIndicator from "../components/general-components/LoadingIndicator";

const repo = new RemoteRepositoryImpl();

export function valueOrFirst(value: any) {
    if (value === undefined) return undefined;
    if (Array.isArray(value)) {
        if (value.length === 0) return undefined;
        return value[0];
    } else {
        return value;
    }
}

export default function Products() {
    const [products, setProducts] = createSignal<any[]>([]);
    const baseUrl = "https://localhost:7221";

    const location = useLocation();
    const navigate = useNavigate();
    const [lastPage, setLastPage] = createSignal(1);

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const category = createMemo(() => {
        const value = valueOrFirst(location.query["category"]);
        return value ? decodeURIComponent(value) : undefined;
    });

    const page = createMemo(() => {
        const value = valueOrFirst(location.query["page"]);
        return value ? decodeURIComponent(value) : "1";
    });

    const textValue = createMemo(() => {
        const value = valueOrFirst(location.query["name"]);
        return value ? decodeURIComponent(value) : undefined;
    });

    const onSearch = (page: string, category: string, textValue: string) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (category) queryParams.append("category", category);
        if (textValue) queryParams.append("name", textValue);
        const params = queryParams.toString();
        navigate(`/products${params.length > 0 ? `?${params}` : ""}`);
    };

    createEffect(async () => {
        const fCategory = category();
        const fPage = page();
        const fName = textValue();

        const nPage = parseInt(fPage);

        try {
            setIsLoading(true);
            const result = await repo.getAllProducts(
                nPage,
                fCategory ? parseInt(fCategory) : undefined,
                fName ?? undefined
            );
            setProducts(result.products);
            setLastPage(result.lastPage);

            if (result.lastPage < nPage) {
                onSearch("1", fCategory ?? "", fName ?? "");
            }
            setIsLoading(false);
        } catch (err) {
            console.log("Failed to fetch products", err);
        }finally {
            setIsLoading(false);
        }
    });

    return (
        <div class="w-full">
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..." />
            <div class="w-5/6 mx-auto my-20">
                <h1 class="text-5xl font-bold mb-6">All products</h1>
                <ProductsFilter
                    setCategory={(value) => {
                        onSearch(page() ?? "1", value ?? "", textValue() ?? "");
                    }}
                    setTextFilter={(value) => {
                        onSearch(page() ?? "1", category() ?? "", value ?? "");
                    }}
                    category={category() ?? ""}
                    textFilter={textValue() ?? ""}
                />
            </div>

            <div class="w-5/6 mx-auto my-20">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    <For each={products()}>
                        {(product) => (
                            <ProductCard product={product} baseUrl={baseUrl} />
                        )}
                    </For>
                </div>

                <div class="flex justify-center mt-10 gap-4">
                    <Show when={lastPage() > 1}>
                        <div class="flex justify-center space-x-1 mt-10 flex-wrap">
                            {/* First Page Button */}
                            <button
                                class="px-3 py-2 border rounded bg-white text-black hover:bg-gray-100"
                                onClick={() => onSearch("1", category() ?? "", textValue() ?? "")}
                                disabled={page() === "1"}
                            >
                                « First
                            </button>

                            {/* Previous Page Button */}
                            <button
                                class="px-3 py-2 border rounded bg-white text-black hover:bg-gray-100"
                                onClick={() => onSearch((Math.max(1, parseInt(page() || "1") - 1)).toString(), category() ?? "", textValue() ?? "")}
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

                                return pages.map(p =>
                                    typeof p === "number" ? (
                                        <button
                                            type="button"
                                            class={`px-3 py-2 border rounded ${
                                                p === current ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                                            }`}
                                            onClick={() => onSearch(p.toString(), category() ?? "", textValue() ?? "")}
                                        >
                                            {p}
                                        </button>
                                    ) : (
                                        <span class="px-3 py-2 text-gray-400">...</span>
                                    )
                                );
                            })()}

                            {/* Next Page Button */}
                            <button
                                class="px-3 py-2 border rounded bg-white text-black hover:bg-gray-100"
                                onClick={() => onSearch((Math.min(lastPage(), parseInt(page() || "1") + 1)).toString(), category() ?? "", textValue() ?? "")}
                                disabled={parseInt(page() || "1") >= lastPage()}
                            >
                                ›
                            </button>

                            {/* Last Page Button */}
                            <button
                                class="px-3 py-2 border rounded bg-white text-black hover:bg-gray-100"
                                onClick={() => onSearch(lastPage().toString(), category() ?? "", textValue() ?? "")}
                                disabled={parseInt(page() || "1") >= lastPage()}
                            >
                                Last »
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
}
