import {RemoteRepositoryImpl} from "../../../../repository/RemoteRepositoryImpl";
import {createSignal, For, onMount} from "solid-js";
import {useAuthContext} from "../../../../util/context/AuthContext";
import AdminOrderCard from "../../admin/admin-components/AdminOrderCard";
import UserOrderCard from "../components/UserOrderCard";

const repo = new RemoteRepositoryImpl();

export default function ProfileOrders(){
    const [token] = useAuthContext();
    const [orders, setOrders] = createSignal<any[]>([]);

    onMount(async () => {
        const bearer = token();
        if(!bearer)return;

        try{
            const result = await repo.getUserOrders(bearer);
            setOrders(result);
        }catch(err){
            console.log(err);
        }
    })

    return <div class="w-full min-h-screen bg-gray-50 px-4 py-10">
        <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Your Orders</h1>
        <div class="w-5/6 mx-auto grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6 pb-20">
            <For each={orders()}>
                {(order) => (
                    <UserOrderCard
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
}