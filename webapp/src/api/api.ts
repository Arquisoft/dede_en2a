import { Order, Review, User, Product } from "../shared/shareddtypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

// -*- USERS -*-

export async function addUser(user: User): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      webId: user.webId,
    }),
  });
  if (response.status === 200) {
    return true;
  } else return false;
}

export async function checkUser( // TODO: this should be refactored
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

  if (response.status === 200) return true;
  else return false;
}

export async function getUser(webId: String): Promise<User> {
  let response = await fetch(apiEndPoint + "/users/findByWebId/" + webId); // TODO: change controller
  return response.json();
}

// -*- PLACES -*-

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

// -*- PRODUCTS -*-

export async function getProducts(): Promise<Product[]> {
  let response = await fetch(apiEndPoint + "/products/");
  return response.json();
}

export async function getProduct(productCode: string): Promise<Product> {
  let response = await fetch(
    apiEndPoint + "/products/listByCode/" + productCode
  );
  return response.json();
}

export async function updateProduct(webId: string, product: Product) {
  await fetch(apiEndPoint + "/products/update/" + product.code, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      webId: webId,
    },

    body: JSON.stringify({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    }),
  });
}

export async function createProduct(image: any, body: any) {
  var data = new FormData();
  data.append("image", image, body.code + ".png");
  for (let key in body) {
    data.append(key, body[key]);
  }

  let response = await fetch(apiEndPoint + "/products", {
    //TODO - Pass token and email to verify identity
    method: "POST",
    body: data,
  });

  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function deleteProduct(webId: string, code: string) {
  await fetch(apiEndPoint + "/products/delete/" + code, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      webId: webId,
    },
  });
}

// -*- ORDERS -*-

export async function createOrder(webId: string, body: any) {
  await fetch(apiEndPoint + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      webId: webId,
    },
    body: body,
  });
}

export async function getOrders(): Promise<Order[]> {
  let response = await fetch(apiEndPoint + "/orders/list/");
  return response.json();
}

export async function getOrderByCode(
  webId: string,
  orderCode: string
): Promise<Order> {
  let response = await fetch(
    apiEndPoint + "/orders/findByOrderCode/" + orderCode,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
}

export async function getOrdersForUser(
  webId: string,
  role: string
): Promise<Order[]> {
  if (role === "admin") return getOrders(); // TODO: make role a type
  else {
    const apiEndPoint =
      process.env.REACT_APP_API_URI || "http://localhost:5000";
    let response = await fetch(apiEndPoint + "/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        webId: webId,
      },
    });
    return response.json();
  }
}

// -*- REVIEWS -*-

export async function getReviewsByCode(code: string): Promise<Review[]> {
  let response = await fetch(apiEndPoint + "/reviews/listByCode/" + code);
  return response.json();
}

export async function getReviewsByCodeAndWebId(
  code: string,
  webId: string
): Promise<Review[]> {
  let response = await fetch(
    apiEndPoint + "/reviews/listByCodeAndWebId/" + code + "/" + webId
  );
  return response.json();
}

export async function addReview(review: Review): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      webId: review.webId,
    },
    body: JSON.stringify({
      rating: review.rating,
      comment: review.comment,
      userEmail: review.webId,
      productCode: review.productCode,
    }),
  });
  if (response.status === 200) {
    return true;
  } else return false;
}
