import {RemoteRepositoryImpl} from "../../../../repository/RemoteRepositoryImpl";
import {Component} from "solid-js";
import AdminOrderCard from "../../admin/admin-components/AdminOrderCard";

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    productImageUrl: string;
}

interface UserOrderCardProps {
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

const UserOrderCard: Component<UserOrderCardProps> = (props) => {
    const formattedDate = new Date(props.orderDate).toLocaleString();
    const baseUrl = "https://localhost:7221";
    return (
        <div class="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-xl duration-300">
            <div class="text-xl font-semibold text-gray-800">Order #{props.id}</div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                <div><span class="font-medium">Date:</span> {formattedDate}</div>
                <div><span class="font-medium">Customer:</span> {props.fullName}</div>
                <div><span class="font-medium">Phone:</span> {props.phoneNumber}</div>
                <div><span class="font-medium">Address:</span> {props.shippingAddress}</div>
                <div><span class="font-medium">Order status:</span> {props.orderStatus}</div>
                <div><span class="font-medium">Total:</span> ${props.totalAmount.toFixed(2)}</div>
            </div>

            <div class="mt-4">
                <div class="text-base font-medium text-gray-700 mb-2">Items:</div>
                <ul class="flex flex-col gap-3">
                    {props.orderItems.map((item) => {
                        const imageUrl = `${baseUrl}${item.productImageUrl}`;

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
}

export default UserOrderCard;