import type { AlertColor } from "@mui/material/Alert";

export type User = {
  name: string;
  webId: string;
  email: string;
  password: string;
};

export type Product = {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imagePath: string;
};

export type NotificationType = {
  severity: AlertColor;
  message: string;
};

export type CartItem = {
  product: Product;
  amount: number;
};

export type Order = {
  orderCode: string;
  userEmail: string;
  userAddress: string,
  products: Product[];
  date: Date,
  subtotalPrice: number,
  shippingPrice: number;
  totalPrice: number;
  isOrderReceived: boolean;
};

export type Review = {
  userEmail: string;
  productCode: string;
  rating: number;
  comment: string;
};

export type CartItemForDB = {
  productCode: String
  amount: number;
};

export type CartForDB = {
  userEmail: string;
  products: CartItemForDB[]
}
