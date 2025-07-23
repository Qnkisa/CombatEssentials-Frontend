import { Component, createSignal } from "solid-js";
import { useAuthContext } from "../../../../util/context/AuthContext";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

interface AdminOrderCardProps {
    id: number;
    userId: string | null;
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    orderItems: OrderItem[];
}

const orderStatusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];

const repo = new RemoteRepositoryImpl();

const AdminOrderCard: Component<AdminOrderCardProps> = (props) => {
    const formattedDate = new Date(props.orderDate).toLocaleString();
    const [status, setStatus] = createSignal(props.orderStatus);
    const [loading, setLoading] = createSignal(false);
    const [token] = useAuthContext();

    const handleStatusChange = async (e: Event) => {
        const newStatus = (e.target as HTMLSelectElement).value;

        if (newStatus === status()) return;

        setLoading(true);
        try {
            await repo.updateAdminOrder(token()!, props.id, {
                orderStatus: newStatus,
            });
            setStatus(newStatus);
            console.log(`Order #${props.id} updated to ${newStatus}`);
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update order status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-200">
            <div class="text-gray-800 font-semibold text-xl">Order #{props.id}</div>
            <div class="text-sm text-gray-600">
                <span class="font-medium">Date:</span> {formattedDate}
            </div>
            <div class="text-sm text-gray-600">
                <span class="font-medium">Customer:</span> {props.fullName}
            </div>
            <div class="text-sm text-gray-600">
                <span class="font-medium">Phone:</span> {props.phoneNumber}
            </div>
            <div class="text-sm text-gray-600">
                <span class="font-medium">Address:</span> {props.shippingAddress}
            </div>

            <div class="text-sm text-gray-600">
                <span class="font-medium">Status:</span>
                <select
                    class="ml-2 border rounded px-2 py-1 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-60"
                    value={status()}
                    onChange={handleStatusChange}
                    disabled={loading()}
                >
                    {orderStatusOptions.map((option) => (
                        <option value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div class="text-sm text-gray-600">
                <span class="font-medium">Total:</span> ${props.totalAmount.toFixed(2)}
            </div>

            <div class="mt-3">
                <div class="font-medium text-gray-700">Items:</div>
                <ul class="text-sm text-gray-700 pl-4 list-disc">
                    {props.orderItems.map((item) => (
                        <li>
                            {item.productName} x {item.quantity} = $
                            {(item.unitPrice * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminOrderCard;
