import { createSignal, For, onMount } from "solid-js";
import { useAuthContext } from "../../../../util/context/AuthContext";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";
import AdminOrderCard from "../admin-components/AdminOrderCard";
import LoadingIndicator from "../../general-components/LoadingIndicator";

const repo = new RemoteRepositoryImpl();

export default function AdminOrders() {
    const [orders, setOrders] = createSignal<any[]>([]);
    const [token] = useAuthContext();

    const [isLoading, setIsLoading] = createSignal<boolean>(true);

    const refreshOrders = async () => {
        const authToken = token();
        if (!authToken) return;

        try {
            setIsLoading(true);
            const result = await repo.getAllAdminOrders(authToken, 1);
            setOrders(result);
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }finally{
            setIsLoading(false);
        }
    };

    onMount(refreshOrders);

    return (
        <div>
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-5/6 my-5 sm:my-10 mx-auto py-4 sm:py-5 px-4 sm:px-8 bg-gray-700 rounded-xl">
                <h1 class="text-2xl sm:text-5xl font-bold text-white">Orders</h1>
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
        </div>
    );
}
