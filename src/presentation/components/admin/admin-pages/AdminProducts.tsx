import {createSignal, For, onMount} from "solid-js";
import {CreateProductModal} from "../../../modals/CreateProductModal";
import {useAuthContext} from "../../../../util/context/AuthContext";
import {RemoteRepositoryImpl} from "../../../../repository/RemoteRepositoryImpl";
import AdminProductCard from "../admin-components/AdminProductCard";
import {DeleteProductModal} from "../../../modals/DeleteProductModal";
import {RecoverProductModal} from "../../../modals/RecoverProductModal";

const repo = new RemoteRepositoryImpl();

export default function AdminProducts() {
    const [isCreateOpen, setIsCreateOpen] = createSignal<true | undefined>(undefined);
    const [products, setProducts] = createSignal<any[]>([]);
    const [token] = useAuthContext();

    const [deleteModalOpen, setDeleteModalOpen] = createSignal<boolean>(false);
    const [selectedProductId, setSelectedProductId] = createSignal<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setSelectedProductId(id);
        setDeleteModalOpen(true);
    };

    const [recoverModalOpen, setRecoverModalOpen] = createSignal(false);
    const [recoverProductId, setRecoverProductId] = createSignal<number | null>(null);

    const handleRecoverClick = (id: number) => {
        setRecoverProductId(id);
        setRecoverModalOpen(true);
    };

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

    return <div>
        <CreateProductModal
            state={isCreateOpen()}
            onSuccess={() => setIsCreateOpen(undefined)}
            onClose={() => setIsCreateOpen(undefined)}
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
        <div class="flex items-center justify-between w-5/6 my-5 sm:my-10 mx-auto py-4 sm:py-5 px-4 sm:px-8 bg-gray-700 rounded-xl">
            <h1 class="text-2xl sm:text-5xl font-bold">Products</h1>
            <div>
                <button
                    class="w-full bg-green-600 text-white rounded-lg p-2 text-sm sm:text-base font-medium hover:bg-green-700 transition cursor-pointer"
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
                        onEdit={(id) => console.log("Edit", id)}
                        onDelete={handleDeleteClick}
                        onRecover={handleRecoverClick}
                    />
                )}
            </For>
        </div>
    </div>
}