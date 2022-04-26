import type { AlertColor } from "@mui/material/Alert";

export type User = {
  webId: string;
  role: string;
  isVerified: boolean;
};

export type Product = {
  code: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  weight: number;
};

export const ProductCategories = {
  Clothes: "Clothes",
  Decoration: "Decoration",
  Electronics: "Electronics",
  Miscellaneous: "Miscellaneous",
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
  code: string;
  webId: string
  address: string;
  date: Date;
  products: Product[];
  subtotalPrice: number;
  shippingPrice: number;
  totalPrice: number;
  receivedDate: Date;
};

export type Review = {
  webId: string;
  productCode: string;
  rating: number;
  comment: string;
};

export type Rate = {
  name: string;
  price: number;
  time: number;
};
