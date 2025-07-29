import { createSignal, onMount, For, createEffect } from "solid-js";
import { RemoteRepositoryImpl } from "../../../repository/RemoteRepositoryImpl";
import LoadingIndicator from "../general-components/LoadingIndicator";

// Define the props for this component
interface ProductsFilterProps {
    category: string | null;
    setCategory: (value: string | null) => void;
    textFilter: string | null;
    setTextFilter: (value: string | null) => void;
}

// Define the category type
interface Category {
    id: number;
    name: string;
}

const repo = new RemoteRepositoryImpl();

export default function ProductsFilter(props: ProductsFilterProps) {
    const [categories, setCategories] = createSignal<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = createSignal<string | null>(props.category || null);
    const [textFilterValue, setTextFilterValue] = createSignal<string | null>(props.textFilter || null);

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    createEffect(() => {
        setSelectedCategory(props.category || null);
    });

    createEffect(() => {
        setTextFilterValue(props.textFilter || null);
    });

    onMount(async () => {
        try {
            setIsLoading(true);
            const fetchedCategories: Category[] = await repo.getAllCategories();
            setCategories(fetchedCategories);
            setIsLoading(false);
        } catch (e) {
            console.error("Failed to load categories", e);
        }finally{
            setIsLoading(false);
        }
    });

    const handleCategoryChange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const value = target.value || null;
        setSelectedCategory(value);
        props.setCategory(value);
    };

    const handleSubmitTextFilter = () => {
        const value = textFilterValue();
        props.setTextFilter(value);
    };

    return (
        <div class="flex flex-col lg:flex-row items-stretch gap-4 mb-8">
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..." />

            {/* Category Select */}
            <div class="w-full lg:w-1/4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                    value={selectedCategory() || ""}
                    onChange={handleCategoryChange}
                >
                    <option value="" selected={(selectedCategory() || "") === ""}>
                        All categories
                    </option>
                    <For each={categories()}>
                        {(cat) => (
                            <option
                                value={cat.id.toString()}
                                selected={(selectedCategory() || "") === cat.id.toString()}
                            >
                                {cat.name}
                            </option>
                        )}
                    </For>
                </select>
            </div>

            {/* Text Search */}
            <div class="flex flex-col w-full lg:flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div class="relative">
                    <input
                        type="search"
                        placeholder="Search product by name..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                        value={textFilterValue() || ""}
                        onInput={(e) => setTextFilterValue((e.target as HTMLInputElement).value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmitTextFilter();
                            }
                        }}
                    />
                    <img
                        src="/search-icon.png"
                        alt="search-icon"
                        class="w-5 h-5 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleSubmitTextFilter()}
                    />
                </div>
            </div>
        </div>
    );
}
