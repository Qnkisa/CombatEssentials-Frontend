export interface CreateOrderDto {
    fullName: string;
    phoneNumber: string;
    shippingAddress: string;
    orderItems: {
        productId: number;
        quantity: number;
    }[];
}