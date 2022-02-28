export type User = {
    name:string;
    email:string;
  }

export type Product = {
    code: string;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export type OrderProduct = {
    code: string;
    amount: number;
}

export type Order = {
    userId: string;
    products: [OrderProduct];
    totalPrice: number;
    shippingPrice: number;
}