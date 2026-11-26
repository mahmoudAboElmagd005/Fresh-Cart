export type OrderStatus = "processing" | "on-the-way" | "delivered";

export interface OrderItem {
  key: string;
  title: string;
  imageCover: string;
  count: number;
  price: number;
}

export interface UserOrder {
  key: string;
  orderNumber: string;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethodType: string;
  shippingPrice: number;
  taxPrice: number;
  totalOrderPrice: number;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
  cartItems: OrderItem[];
}
