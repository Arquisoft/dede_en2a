import { Order, Product, Review, User } from "../shared/shareddtypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

// USERS

export async function addUser(user: User): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name,
      webId: user.webId,
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

export async function getUser(userEmail: String): Promise<User> {
  let response = await fetch(apiEndPoint + "/users/findByEmail/" + userEmail);
  return response.json();
}

// PRODUCTS

export async function getProducts(): Promise<Product[]> {
  let response = await fetch(apiEndPoint + "/products/");
  return response.json();
}

export async function getProduct(productCode: string): Promise<Product> {
  let response = await fetch(
    apiEndPoint + "/products/findByCode/" + productCode
  );
  return response.json();
}

export async function updateProduct(product: Product): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/products/update/" + product.code, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token") + "",
      email: localStorage.getItem("user.email") + "",
    },
    body: JSON.stringify({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    }),
  });
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function createProduct(image: any, body: any): Promise<boolean> {
  var data = new FormData();
  data.append("image", image, body.code + ".png");
  for (let key in body) {
    data.append(key, body[key]);
  }
  // We must send authorization through body because form-data request do not allow headers
  data.append("token", localStorage.getItem("token") + "");
  data.append("email", localStorage.getItem("user.email") + "");

  let response = await fetch(apiEndPoint + "/products", {
    method: "POST",
    body: data,
  });

  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function deleteProduct(code: string): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/products/delete/" + code, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token") + "",
      email: localStorage.getItem("user.email") + "",
    },
  });
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

// Mode must be desc or asc. If not default order
// Category must be Clothes, Decoration, Elecrtonics or Miscellaneous. If not all categories
export async function filterProductsByCategory(
  category: string,
  mode: string
): Promise<Product[]> {
  let response = await fetch(
    apiEndPoint + "/products/filter&order/" + category + "&" + mode
  );
  return response.json();
}

// ORDERS

export async function createOrder(body: any) {
  await fetch(apiEndPoint + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token") + "",
      email: localStorage.getItem("user.email") + "",
    },
    body: body,
  });
}

export async function getOrder(orderCode: string): Promise<Order> {
  var headers = {};
  headers = {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("user.email"),
  };
  let response = await fetch(
    apiEndPoint + "/orders/findByOrderCode/" + orderCode,
    {
      method: "GET",
      headers: headers,
    }
  );
  return response.json();
}

export async function getOrdersForUser(): Promise<Order[]> {
  if (localStorage.getItem("user.role") === "admin") return getOrders();
  else {
    let headers = {};
    headers = {
      token: localStorage.getItem("token"),
      email: localStorage.getItem("user.email"),
    };

    const apiEndPoint =
      process.env.REACT_APP_API_URI || "http://localhost:5000";
    let response = await fetch(apiEndPoint + "/orders", {
      method: "GET",
      headers: headers,
    });
    return response.json();
  }
}

export async function getOrders(): Promise<Order[]> {
  let headers = {};
  headers = {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("user.email"),
  };

  let response = await fetch(apiEndPoint + "/orders/list/", {
    method: "GET",
    headers: headers,
  });
  return response.json();
}

// REVIEWS

export async function getReviewsByCode(code: string): Promise<Review[]> {
  let response = await fetch(apiEndPoint + "/reviews/listByCode/" + code);
  return response.json();
}

export async function getReviewsByCodeAndEmail(
  code: string,
  email: string
): Promise<Review[]> {
  let response = await fetch(
    apiEndPoint + "/reviews/listByCodeAndEmail/" + code + "/" + email
  );
  return response.json();
}

export async function addReview(review: Review): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/reviews", {
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

// PLACES

export async function getPlaces(
  x: number,
  y: number,
  radiusMeters: number,
  maxResults: number
): Promise<any> {
  const url =
    "https://api.geoapify.com/v2/places?categories=commercial&filter=circle:" +
    x +
    "," +
    y +
    "," +
    radiusMeters +
    "&bias=proximity:" +
    x +
    "," +
    y +
    "&limit=" +
    maxResults +
    "&apiKey=" +
    process.env.REACT_APP_GEOAPIFY_KEY;

  let places;
  await fetch(url, {
    method: "GET",
  }).then((response) => (places = response.json()));
  return places;
}
