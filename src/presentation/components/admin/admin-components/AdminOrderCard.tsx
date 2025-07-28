import { Component, createSignal } from "solid-js";
import { useAuthContext } from "../../../../util/context/AuthContext";
import { RemoteRepositoryImpl } from "../../../../repository/RemoteRepositoryImpl";
import LoadingIndicator from "../../general-components/LoadingIndicator";
import {TopCenterPopup} from "../../general-components/TopCenterPopup";

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    productImageUrl: string;
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
    const [token] = useAuthContext();
    const baseUrl = "https://localhost:7221";

    const [isLoading, setIsLoading] = createSignal<boolean>(false);

    const [popupState, setPopupState] = createSignal<{
        text: string;
        error?: boolean;
    } | null>(null);

    const handleStatusChange = async (e: Event) => {
        const newStatus = (e.target as HTMLSelectElement).value;
        if (newStatus === status()) return;

        try {
            setIsLoading(true);
            await repo.updateAdminOrder(token()!, props.id, {
                orderStatus: newStatus,
            });
            setStatus(newStatus);
            setIsLoading(false);
            setPopupState({ text: "Order status updated successfully!"});
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update order status.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div class="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-xl duration-300">
            <TopCenterPopup state={popupState()} onClose={() => setPopupState(null)} />
            <LoadingIndicator isLoading={isLoading()} loadingText="Loading..."/>
            <div class="text-xl font-semibold text-gray-800">Order #{props.id}</div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                <div><span class="font-medium">Date:</span> {formattedDate}</div>
                <div><span class="font-medium">Customer:</span> {props.fullName}</div>
                <div><span class="font-medium">Phone:</span> {props.phoneNumber}</div>
                <div><span class="font-medium">Address:</span> {props.shippingAddress}</div>
                <div>
                    <span class="font-medium">Status:</span>
                    <select
                        class="ml-2 border rounded px-2 py-1 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                        value={status()}
                        onChange={handleStatusChange}
                        disabled={isLoading()}
                    >
                        {orderStatusOptions.map((option) => (
                            <option value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div><span class="font-medium">Total:</span> ${props.totalAmount.toFixed(2)}</div>
            </div>

            <div class="mt-4">
                <div class="text-base font-medium text-gray-700 mb-2">Items:</div>
                <ul class="flex flex-col gap-3">
                    {props.orderItems.map((item) => {
                        const imageUrl = `${baseUrl}${item.productImageUrl}`;
                        console.log("Image URL:", imageUrl);

                        return (
                            <li class="flex items-center gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <img
                                    src={imageUrl}
                                    alt={item.productName}
                                    class="w-16 h-16 object-cover rounded-md border"
                                />
                                <div class="flex flex-col text-sm text-gray-700">
                                    <div class="font-medium">{item.productName}</div>
                                    <div>Quantity: {item.quantity}</div>
                                    <div>
                                        Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default AdminOrderCard;
