import { Component } from "solid-js";

interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

interface AdminOrderCardProps {
    id: number;
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    orderItems: OrderItem[];
}

const AdminOrderCard: Component<AdminOrderCardProps> = (props) => {
    const formattedDate = new Date(props.orderDate).toLocaleString();

    return (
        <div class="bg-white shadow-lg rounded-xl p-4 flex flex-col gap-2">
            <div class="text-gray-800 font-semibold text-lg">Order #{props.id}</div>
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
                <span class="font-medium">Status:</span> {props.orderStatus}
            </div>
            <div class="text-sm text-gray-600">
                <span class="font-medium">Total:</span> ${props.totalAmount.toFixed(2)}
            </div>
            <div class="mt-2">
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
