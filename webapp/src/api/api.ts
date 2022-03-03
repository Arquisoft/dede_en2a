import { User } from "../shared/shareddtypes";
import { Product } from "../shared/shareddtypes";

export async function addUser(user: User): Promise<boolean | string> {
  const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
    }),
  });
  if (response.status === 200) return response.json();
  else return false;
}

export async function checkUser(
  email: String,
  password: String
): Promise<boolean | string> {
  const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/users/requestToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  
  if (response.status === 200) {
    return response.json();
  } else {
    return false;
  }
}

export async function getUsers(): Promise<User[]> {
  const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/users/list");
  //The objects returned by the api are directly convertible to User objects
  return response.json();
}

export async function getUser(userEmail: String): Promise<User> {
  const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/users/findByEmail/" + userEmail);
  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/products/list");
  return response.json();
}

export async function getProduct(productCode: string): Promise<Product> {
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(
    apiEndPoint + "/products/findByCode/" + productCode
  );
  return response.json();
}

export async function updateProduct(product: Product) {
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/products/update/" + product.code, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    }),
  });
}
