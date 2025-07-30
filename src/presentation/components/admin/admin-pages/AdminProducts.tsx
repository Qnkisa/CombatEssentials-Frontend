import {createEffect, createMemo, createSignal, For, onMount, Show} from "solid-js";
import {CreateProductModal} from "../../../modals/CreateProductModal";
import {useAuthContext} from "../../../../util/context/AuthContext";
import {RemoteRepositoryImpl} from "../../../../repository/RemoteRepositoryImpl";
import AdminProductCard from "../admin-components/AdminProductCard";
import {DeleteProductModal} from "../../../modals/DeleteProductModal";
import {RecoverProductModal} from "../../../modals/RecoverProductModal";
import {UpdateProductModal} from "../../../modals/UpdateProductModal";
import LoadingIndicator from "../../general-components/LoadingIndicator";
import {TopCenterPopup} from "../../general-components/TopCenterPopup";
import ProductsFilter from "../../products/ProductsFilter";
import {valueOrFirst} from "../../../pages/Products";
import {useLocation, useNavigate} from "@solidjs/router";

const repo = new RemoteRepositoryImpl();

export default function AdminProducts() {
    const [isCreateOpen, setIsCreateOpen] = createSignal<true | undefined>(undefined);
    const [products, setProducts] = createSignal<any[]>([]);
    const [token] = useAuthContext();

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const navigate = useNavigate();
    const location = useLocation();

    const [lastPage, setLastPage] = createSignal(1);
    const [refetchTrigger, setRefetchTrigger] = createSignal(0);

    // Delete product logic
    const [deleteModalOpen, setDeleteModalOpen] = createSignal<boolean>(false);
    const [selectedProductId, setSelectedProductId] = createSignal<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setSelectedProductId(id);
        setDeleteModalOpen(true);
    };

    // Recover product logic
    const [recoverModalOpen, setRecoverModalOpen] = createSignal(false);
    const [recoverProductId, setRecoverProductId] = createSignal<number | null>(null);

    const handleRecoverClick = (id: number) => {
        setRecoverProductId(id);
        setRecoverModalOpen(true);
    };

    // Update product logic
    const [isUpdateOpen, setIsUpdateOpen] = createSignal<true | undefined>(undefined);
    const [productToUpdate, setProductToUpdate] = createSignal<any>(null);
    const handleEditClick = (id: number) => {
        const product = products().find(p => p.id === id);
        if (product) {
            setProductToUpdate(product);
            setIsUpdateOpen(true);
        }
    };

    const [popupState, setPopupState] = createSignal<{
        text: string;
        error?: boolean;
    } | null>(null);

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
        navigate(`/admin/products${params.length > 0 ? `?${params}` : ""}`);
    };

    createEffect(async () => {
        refetchTrigger();

        const fCategory = category();
        const fPage = page();
        const fName = textValue();

        const nPage = parseInt(fPage);

        const bearer = token();
        if(!bearer) return;

        try {
            setIsLoading(true);

            const result = await repo.getAllAdminProducts(
                bearer,
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

    return <div class="w-full min-h-screen bg-gray-50 pb-20">
        <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>

        <TopCenterPopup state={popupState()} onClose={() => setPopupState(null)} />

        <CreateProductModal
            state={isCreateOpen()}
            onSuccess={() => {
                    setIsCreateOpen(undefined)
                    setRefetchTrigger(prev => prev + 1);
                    setPopupState({ text: "Product created successfully!"});
                }
            }
            onClose={async () => {
                setIsCreateOpen(undefined)
            }}
        />
        <UpdateProductModal
            state={isUpdateOpen()}
            onClose={() => {
                setIsUpdateOpen(undefined);
                setProductToUpdate(null);
            }}
            onSuccess={async () => {
                setIsUpdateOpen(undefined);
                setProductToUpdate(null);
                setRefetchTrigger(prev => prev + 1);
                setPopupState({ text: "Product updated successfully!"});
            }}
            product={productToUpdate()}
        />

        <DeleteProductModal
            state={deleteModalOpen()}
            onClose={() => setDeleteModalOpen(false)}
            onSuccess={async () => {
                const authToken = token();
                if (!authToken || selectedProductId() === null) return;

                try {
                    setIsLoading(true);
                    await repo.deleteAdminProduct(authToken, selectedProductId()!);
                    setDeleteModalOpen(false);
                    setSelectedProductId(null);
                    setRefetchTrigger(prev => prev + 1);
                    setIsLoading(false);

                    setPopupState({ text: "Product deleted!", error: true});
                } catch (err) {
                    console.error("Delete failed", err);
                }finally{
                    setIsLoading(false);
                }
            }}
        />
        <RecoverProductModal
            state={recoverModalOpen()}
            onClose={() => setRecoverModalOpen(false)}
            onSuccess={async () => {
                const authToken = token();
                if (!authToken || recoverProductId() === null) return;

                try {
                    setIsLoading(true);
                    await repo.undeleteAdminProduct(authToken, recoverProductId()!);
                    setRecoverModalOpen(false);
                    setRecoverProductId(null);
                    setRefetchTrigger(prev => prev + 1);
                    setIsLoading(false);
                    setPopupState({ text: "Product recovered successfully!"});
                } catch (err) {
                    console.error("Recover failed", err);
                }finally {
                    setIsLoading(false);
                }
            }
            }
        />
        <div class="w-5/6 mx-auto pt-20 text-gray-800">
            <div class="flex w-full gap-10 justify-between items-center flex-wrap mb-10">
                <h1 class="text-5xl font-bold text-center">Admin products</h1>
                <div>
                    <button
                        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Add product
                    </button>
                </div>
            </div>
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

        <div class="w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <For each={products()}>
                {(product) => (
                    <AdminProductCard
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        categoryName={product.categoryName}
                        imageUrl={product.imageUrl}
                        isDeleted={product.isDeleted}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onRecover={handleRecoverClick}
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
                        onClick={() => onSearch("1", category() ?? "", textValue() ?? "")}
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
                                (Math.max(1, parseInt(page() || "1") - 1)).toString(),
                                category() ?? "",
                                textValue() ?? ""
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
                                        onSearch(p.toString(), category() ?? "", textValue() ?? "")
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
                                (Math.min(lastPage(), parseInt(page() || "1") + 1)).toString(),
                                category() ?? "",
                                textValue() ?? ""
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
                            onSearch(lastPage().toString(), category() ?? "", textValue() ?? "")
                        }
                        disabled={parseInt(page() || "1") >= lastPage()}
                    >
                        Last »
                    </button>
                </div>
            </Show>
        </div>
    </div>
}