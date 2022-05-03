import {
    Address,
    CartItem,
    Order,
    Product,
    Rate,
    Review,
    User
} from "../shared/shareddtypes";
import { ShippingMethodType } from "./ComputeDistanceHelper";

export const testProducts: Product[] = [
  {
    code: "01",
    name: "Test product 1", 
    description: "Test product 1 description",
    price: 100,
    stock: 10,
    image: "01.png",
    category: "Decoration",
    weight: 1,
  },
  {
    code: "02",
    name: "Test product 2",
    description: "Test product 2 description",
    price: 200,
    stock: 20,
    image: "02.png",
    category: "Clothes",
    weight: 2,
  },
];

export const testCartItems: CartItem[] = [
  {
    product: testProducts[0],
    amount: 1,
  },
  {
    product: testProducts[1],
    amount: 2,
  },
];

export const testsAddresses: Address[] = [
  {
    street: "Test street",
    postalCode: "Test code",
    locality: "Test locality",
    region: "Test region",
    url: "https://test.com",
  },
];

export const testAddress: Address = {
  street: "Test street",
  postalCode: "Test code",
  locality: "Test locality",
  region: "Test region",
};

export const rates: Rate[] = [
  {
    name: "Test carrier 1",
    price: 10,
    time: 24,
  },
  {
    name: "Test carrier 2",
    price: 20,
    time: 48,
  },
];

export const shippingMethods: ShippingMethodType[] = [
  {
    title: "Standard shipping",
    subtitle: "The fastest shipping method we have!",
    price: "Select",
  },
  {
    title: "Pick UP",
    subtitle: "The cheapest method on earth!",
    price: "0 €",
  },
];

export const user: User = {
  webId: "https://example.org/profile/card#me",
  role: "user",
  isVerified: true,
};

export const reviews: Review[] = [
  {
    webId:
      "aHR0cHM6Ly9hbmdlbGlwMjMwMy5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI2",
    productCode: "9999",
    rating: 4,
    comment: "This is the first test comment",
  },
  {
    webId:
      "aHR0cHM6Ly9hbmdlbqweqwjMwMy5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI2",
    productCode: "9998",
    rating: 5,
    comment: "This is the second test comment",
  },
];

export const testOrders: Order[] = [
  {
    code: "Testordercode",
    webId: "https://test.webid.com",
    address: "Test address",
    date: new Date(1650751200000),
    products: testProducts,
    subtotalPrice: 10,
    shippingPrice: 5,
    totalPrice: 15,
    receivedDate: new Date("25-04-2022"),
  },
  {
    code: "Test order code 2",
    webId: "https://test.webid.com",
    address: "Test address 1",
    date: new Date(1650751200000),
    products: testProducts,
    subtotalPrice: 10,
    shippingPrice: 0,
    totalPrice: 10,
    receivedDate: new Date("20-06-2022"),
  },
];
