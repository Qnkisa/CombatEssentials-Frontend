import { A } from "@solidjs/router";

type MobileNavProps = {
    onNavigate?: () => void;
};

export default function MobileNav(props: MobileNavProps) {
    return (
        <nav class="md:hidden bg-white px-4 pb-4 flex flex-col space-y-3 shadow">
            <A
                href="/"
                onClick={props.onNavigate}
                class="text-gray-700 font-medium hover:text-blue-600"
            >
                Home
            </A>
            <A
                href="/products"
                onClick={props.onNavigate}
                class="text-gray-700 font-medium hover:text-blue-600"
            >
                Products
            </A>
        </nav>
    );
}
