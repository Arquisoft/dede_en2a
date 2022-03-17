import { Order, Review, User, Product } from "../shared/shareddtypes";

export async function addUser(user: User): Promise<boolean> {
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
  if (response.status === 200) {
    return true;
  } else return false;
}

export async function checkUser(
  email: String,
  password: String
): Promise<boolean> {
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
    localStorage.setItem("token", await response.json());
    return true;
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

export async function createOrder(body: any) {
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  console.log(body);
  let response = await fetch(apiEndPoint + "/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
}

export async function getOrder(orderCode: string): Promise<Order> {
  var headers = {};
  headers = {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("user.email"),
  };
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(
    apiEndPoint + "/orders/findByOrderCode/" + orderCode,
    { method: "GET", headers: headers }
  );
  return response.json();
}

export async function getOrdersForUser(userEmail: string): Promise<Order[]> {
  var headers = {};
  headers = {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("user.email"), //userEmail
  };

  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/orders", {
    method: "GET",
    headers: headers,
  });
  return response.json();
}

export async function getReviewsByCode(code: string): Promise<Review[]> {
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/reviews/listByCode/" + code);
  return response.json();
}

export async function getReviewsByCodeAndEmail(
  code: string,
  email: string
): Promise<Review[]> {
  const apiEndPoint = process.env.REACT_APP_ARI_URI || "http://localhost:5000";
  let response = await fetch(
    apiEndPoint + "/reviews/listByCodeAndEmail/" + code + "/" + email
  );
  return response.json();
}

export async function addReview(review: Review): Promise<boolean> {
  const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";
  let response = await fetch(apiEndPoint + "/reviews/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token") + "",
    },
    body: JSON.stringify({
      rating: review.rating,
      comment: review.comment,
      userEmail: review.userEmail,
      productCode: review.productCode,
    }),
  });
  if (response.status === 200) {
    return true;
  } else return false;
}
