import { createSignal, onMount, For, createEffect } from "solid-js";
import { RemoteRepositoryImpl } from "../../../repository/RemoteRepositoryImpl";

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

    createEffect(() => {
        setSelectedCategory(props.category || null);
    });

    createEffect(() => {
        setTextFilterValue(props.textFilter || null);
    });

    onMount(async () => {
        try {
            const fetchedCategories: Category[] = await repo.getAllCategories();
            setCategories(fetchedCategories);
        } catch (e) {
            console.error("Failed to load categories", e);
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
        <div class="flex-col flex gap-4 mb-6 lg:flex-row">
            <select
                class="border px-3 py-2 rounded"
                value={selectedCategory() || ""}
                onChange={handleCategoryChange}
            >
                <option class="text-black" value="" selected={(selectedCategory() || "") === ""}>All categories</option>
                <For each={categories()}>
                    {(cat) => (
                        <option
                            value={cat.id.toString()}
                            selected={(selectedCategory() || "") === cat.id.toString()}
                            class="text-black"
                        >
                            {cat.name}
                        </option>
                    )}
                </For>
            </select>

            <div class="flex items-center gap-2 flex-grow relative">
                <img
                    src="/search-icon.png"
                    alt="search-icon"
                    class="w-8 h-8 absolute right-4 cursor-pointer bg-white rounded-full p-1"
                    onClick={() => handleSubmitTextFilter()}
                />
                <input
                    type="search"
                    placeholder="Search product by name..."
                    class="w-full px-3 py-2 border rounded"
                    value={textFilterValue() || ""}
                    onInput={(e) => setTextFilterValue((e.target as HTMLInputElement).value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmitTextFilter();
                        }
                    }}
                />
            </div>
        </div>
    );
}
