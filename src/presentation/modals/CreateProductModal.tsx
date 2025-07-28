import {createSignal, onMount} from "solid-js";
import Modal from "./Modal";
import { RemoteRepositoryImpl } from "../../repository/RemoteRepositoryImpl";
import { useAuthContext } from "../../util/context/AuthContext";
import LoadingIndicator from "../components/general-components/LoadingIndicator";

const repo = new RemoteRepositoryImpl();

export const CreateProductModal = (props: {
    state: boolean | undefined;
    onSuccess: () => void;
    onClose: () => void;
}) => {
    const [name, setName] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [price, setPrice] = createSignal<number | "">("");
    const [categoryId, setCategoryId] = createSignal<number | "">("");
    const [categories, setCategories] = createSignal<{ id: number; name: string }[]>([]);
    const [imageFile, setImageFile] = createSignal<File | null>(null);
    const [imagePreview, setImagePreview] = createSignal<string | null>(null);
    const [error, setError] = createSignal<string | null>(null);
    let fileInputRef: HTMLInputElement | undefined;
    const [token] = useAuthContext();

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    // Fetch categories when modal opens or component mounts
    onMount(async () => {
        try {
            setIsLoading(true);
            const fetchedCategories = await repo.getAllCategories();
            setCategories(fetchedCategories);
            setIsLoading(false);
        } catch (e) {
            console.error("Failed to load categories", e);
            setError("Failed to load categories.");
        }finally{
            setIsLoading(false);
        }
    });

    const handleImageChange = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const file = target.files?.[0];

        if (file && /\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setError("Invalid file type. Allowed types: JPG, PNG, WEBP, GIF.");
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const onSubmit = async () => {
        setError(null);

        const authToken = token();
        if (!authToken) return;

        if (!name() || !description() || !price() || !categoryId() || !imageFile()) {
            setError("Please fill in all fields.");
            return;
        }

        const formData = new FormData();
        formData.append("Name", name());
        formData.append("Description", description());
        formData.append("Price", price().toString());
        formData.append("CategoryId", categoryId().toString());
        formData.append("ImageFile", imageFile()!);

        try {
            setIsLoading(true);
            await repo.createAdminProduct(authToken, formData);
            setIsLoading(false);
            props.onSuccess();
            props.onClose();
        } catch (err) {
            console.error(err);
            setError("Error occurred while creating the product.");
        } finally{
            setIsLoading(false);
        }
    };

    return (
        <Modal state={props.state} onClose={props.onClose}>
            {(state) => (
                <div class="max-h-[90vh] overflow-y-auto w-[300px] sm:w-[32rem] bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative text-gray-800">
                    <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
                    <button
                        type="button"
                        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        onClick={props.onClose}
                    >
                        &times;
                    </button>

                    <form
                        class="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                    >
                        <h2 class="text-xl sm:text-2xl font-semibold text-center mb-2">New Product</h2>

                        <input
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Name"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                            required
                        />

                        <textarea
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Description"
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                            rows={3}
                            required
                        />

                        <input
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={price()}
                            onInput={(e) => setPrice(e.currentTarget.valueAsNumber || "")}
                            required
                        />

                        {/* Replace number input with select */}
                        <select
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categoryId()}
                            onChange={(e) => setCategoryId(Number(e.currentTarget.value))}
                            required
                        >
                            <option value="" disabled>
                                Choose category
                            </option>
                            {categories().map((category) => (
                                <option value={category.id}>{category.name}</option>
                            ))}
                        </select>

                        {/* Image file input */}
                        <div>
                            <label class="text-sm font-medium mb-1 block">Image</label>
                            <input
                                ref={fileInputRef}
                                class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                                type="file"
                                accept="image/jpeg, image/png, image/webp, image/jpg, image/gif"
                                onChange={handleImageChange}
                            />
                            {imagePreview() && (
                                <div class="mt-2 relative">
                                    <img
                                        src={imagePreview()!}
                                        alt="Преглед"
                                        class="w-full h-40 object-contain rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        class="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-sm text-red-600 border hover:bg-opacity-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {error() && <p class="text-red-500 text-sm text-center">{error()}</p>}

                        <button
                            type="submit"
                            class="w-full bg-green-600 text-white rounded-lg py-2 text-sm sm:text-base font-medium hover:bg-green-700 transition cursor-pointer"
                        >
                            Create Product
                        </button>
                    </form>
                </div>
            )}
        </Modal>
    );
};
