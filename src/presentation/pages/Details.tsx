import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";

export default function Details() {
    const [productId, setProductId] = createSignal<number | null>(null);

    const params = useParams();

    onMount(() => {
        const idParam = Number(params.id);
        if (!isNaN(idParam)) {
            setProductId(idParam);
        } else {
            console.error("Invalid product ID:", params.id);
        }
    });

    return (
        <div class="text-5xl flex items-center justify-center w-full">
            Details page for product {productId()}
        </div>
    );
}
