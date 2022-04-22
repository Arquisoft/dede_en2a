import { Order, Review, User, Product } from "../shared/shareddtypes";

const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";

// -*- USERS -*-

export async function addUser(webId: string): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      webId: window.btoa(webId),
    }),
  });
  if (response.status === 200) {
    return true;
  } else return false;
}

export async function getUser(webId: string): Promise<User> {
  let response = await fetch(
    apiEndPoint + "/users/findByWebId/" + window.btoa(webId)
  );
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
      webId: window.btoa(webId),
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
      webId: window.btoa(webId),
    },
  });
}

// -*- ORDERS -*-

export async function createOrder(webId: string, body: any) {
  await fetch(apiEndPoint + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      webId: window.btoa(webId),
    },
    body: body,
  });
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
        webId: window.btoa(webId),
      },
    }
  );
  return response.json();
}

export async function getOrdersForUser(
  webId: string,
  role: string
): Promise<Order[]> {
  const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000";
  if (role === "admin") {
    // In case the user is an admin: return THE WHOLE collection
    let response = await fetch(apiEndPoint + "/orders/list/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        webId: window.btoa(webId), // we have to check if the user is authenticated
      },
    });

    return response.json();
  } else {
    // In case the user is a normal one: return HIS orders
    let response = await fetch(apiEndPoint + "/orders/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        webId: window.btoa(webId),
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
    apiEndPoint +
      "/reviews/listByCodeAndWebId/" +
      code +
      "/" +
      window.btoa(webId)
  );
  return response.json();
}

export async function addReview(review: Review): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      webId: window.btoa(review.webId),
    },
    body: JSON.stringify({
      rating: review.rating,
      comment: review.comment,
      webId: window.btoa(review.webId),
      productCode: review.productCode,
    }),
  });
  if (response.status === 200) {
    return true;
  } else return false;
}
