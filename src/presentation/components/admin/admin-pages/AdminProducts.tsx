import {createSignal, For, onMount} from "solid-js";
import {CreateProductModal} from "../../../modals/CreateProductModal";
import {useAuthContext} from "../../../../util/context/AuthContext";
import {RemoteRepositoryImpl} from "../../../../repository/RemoteRepositoryImpl";
import AdminProductCard from "../admin-components/AdminProductCard";
import {DeleteProductModal} from "../../../modals/DeleteProductModal";
import {RecoverProductModal} from "../../../modals/RecoverProductModal";
import {UpdateProductModal} from "../../../modals/UpdateProductModal";

const repo = new RemoteRepositoryImpl();

export default function AdminProducts() {
    const [isCreateOpen, setIsCreateOpen] = createSignal<true | undefined>(undefined);
    const [products, setProducts] = createSignal<any[]>([]);
    const [token] = useAuthContext();
    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const [categories, setCategories] = createSignal<{ id: number; name: string }[]>([]);

    const refreshProducts = async () => {
        const authToken = token();
        if (!authToken) return;

        try {
            const result = await repo.getAllAdminProducts(authToken, 1);
            setProducts(result);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    onMount(refreshProducts);

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

    return <div>
        <CreateProductModal
            state={isCreateOpen()}
            onSuccess={() => setIsCreateOpen(undefined)}
            onClose={() => setIsCreateOpen(undefined)}
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
                await refreshProducts();
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
                    await repo.deleteAdminProduct(authToken, selectedProductId()!);
                    setDeleteModalOpen(false);
                    setSelectedProductId(null);
                    await refreshProducts();
                } catch (err) {
                    console.error("Delete failed", err);
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
                    await repo.undeleteAdminProduct(authToken, recoverProductId()!);
                    setRecoverModalOpen(false);
                    setRecoverProductId(null);
                    await refreshProducts();
                } catch (err) {
                    console.error("Recover failed", err);
                }
            }}
        />
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-5/6 my-5 sm:my-10 mx-auto py-4 sm:py-5 px-4 sm:px-8 bg-gray-700 rounded-xl">
            <h1 class="text-2xl sm:text-5xl font-bold text-white">Products</h1>
            <div>
                <button
                    class="bg-green-600 text-white rounded-lg p-2 text-sm sm:text-base font-medium hover:bg-green-700 transition cursor-pointer"
                    onClick={() => setIsCreateOpen(true)}
                >
                    Create Product
                </button>
            </div>
        </div>

        <div class="w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-5 gap-6 pb-20">
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
    </div>
}