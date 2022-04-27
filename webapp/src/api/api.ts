import { Order, Product, Review, User } from "../shared/shareddtypes";

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

export async function getUser(webId: string): Promise<User | undefined> {
  if (webId === "" || webId === undefined)
    throw new Error("Provided WebID is empty"); // If no webId is provided

  let response = await fetch(
    apiEndPoint + "/users/findByWebId/" + window.btoa(webId)
  );

  if (response.status === 204)
    return Promise.resolve(undefined); // In case no user has been found
  else return response.json(); // we return the obtained user
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
  let response = await fetch(apiEndPoint + "/products/update/" + product.code, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: window.btoa(webId),
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

export async function createProduct(image: any, body: any, webId : string): Promise<boolean> {
  var data = new FormData();
  data.append("image", image, body.code + ".png");
  for (let key in body) {
    data.append(key, body[key]);
  }
  // We must send authorization through body because form-data request do not allow headers
  data.append("token", window.btoa(webId));

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

export async function deleteProduct(webId: string, code: string) {
  let response = await fetch(apiEndPoint + "/products/delete/" + code, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: window.btoa(webId),
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

// -*- ORDERS -*-

export async function createOrder(webId: string, body: any) {
  await fetch(apiEndPoint + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: window.btoa(webId),
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
        token: window.btoa(webId),
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
  if (role === "admin" || role === "moderator") {
    // In case the user is an admin: return THE WHOLE collection
    let response = await fetch(
      apiEndPoint + "/orders/listForAdminOrModerator",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: window.btoa(webId), // we have to check if the user is authenticated
        },
      }
    );

    return response.json();
  } else {
    // In case the user is a normal one: return HIS orders
    let response = await fetch(apiEndPoint + "/orders/listForUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: window.btoa(webId),
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
  if (response.status === 200) return response.json();
  else return [];
}

export async function addReview(review: Review): Promise<boolean> {
  let response = await fetch(apiEndPoint + "/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: window.btoa(review.webId),
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
