import type { AlertColor } from "@mui/material/Alert";

export type User = {
  name: string;
  webId: string;
  email: string;
  password: string;
  role: string;
  verified: boolean;
};

export type Product = {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
};

export const ProductCategories = {
  Clothes: "Clothes",
  Decoration: "Decoration",
  Electronics: "Electronics",
  Misccellaneous: "Miscellaneous",
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
  userAddress: string;
  products: Product[];
  date: Date;
  subtotalPrice: number;
  shippingPrice: number;
  totalPrice: number;
  receivedDate: Date;
};

export type Review = {
  userEmail: string;
  productCode: string;
  rating: number;
  comment: string;
};
