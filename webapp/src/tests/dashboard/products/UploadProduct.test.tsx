import { render, fireEvent, act, screen } from "@testing-library/react";
import UploadProduct from "../../../components/dashboard/products/UploadProduct";
import { Product } from "../../../shared/shareddtypes";
import * as api from "../../../api/api";

const products: Product[] = [
  {
    code: "01",
    name: "testName",
    description: "testDescription",
    price: 10,
    stock: 10,
    image: "9999.png",
    category: "Clothes",
    weight: 1,
  },
  {
    code: "02",
    name: "testName2",
    description: "testDescription2",
    price: 20,
    stock: 20,
    image: "8888.png",
    category: "Decoration",
    weight: 1,
  },
];

//Test the upload product component for adding a product is rendered correctly
test("UploadPoduct component for adding a product renders correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

  await act(async () => {
    render(
      <UploadProduct
        isForUpdate={false}
        products={products}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    );
  });

  //Expect title to be rendered
  expect(screen.getByText("Add product")).toBeInTheDocument();

  //Expect the form to be rendered
  expect(screen.getByText("Product code")).toBeInTheDocument();
  expect(screen.getByText("Product name")).toBeInTheDocument();
  expect(screen.getByText("Product description")).toBeInTheDocument();
  expect(screen.getByText("Product price")).toBeInTheDocument();
  expect(screen.getByText("Product category")).toBeInTheDocument();
  expect(screen.getByText("Product stock")).toBeInTheDocument();

  //Expect the submit button to be rendered
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

//Test that error for fields are rendered
test("Error for product name is rendered correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

  let container: any;
  await act(async () => {
    container = render(
      <UploadProduct
        isForUpdate={false}
        products={products}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    ).container;
  });

  //Click the submit button with a empty field for product name
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for name to be rendered
  expect(screen.getByText("Incorrect name")).toBeInTheDocument();

  //Fill in the product name
  fireEvent.change(container.querySelector("input[name='name']"), {
    target: { value: "testName" },
  });
  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for description to be rendered
  expect(screen.getByText("Incorrect description")).toBeInTheDocument();

  //Fill in the product description
  fireEvent.change(container.querySelector("input[name='description']"), {
    target: { value: "testDescription" },
  });
  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for price to be rendered
  expect(screen.getByText("Incorrect price")).toBeInTheDocument();

  //Fill in the product price
  fireEvent.change(container.querySelector("input[name='price']"), {
    target: { value: "10" },
  });
  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for stock to be rendered
  expect(screen.getByText("Incorrect stock")).toBeInTheDocument();
});

//File error is rendered correctly
test("File error is rendered correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

  let container: any;
  await act(async () => {
    container = render(
      <UploadProduct
        isForUpdate={false}
        products={products}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    ).container;
  });

  //Fill in the product name
  fireEvent.change(container.querySelector("input[name='name']"), {
    target: { value: "testName" },
  });

  //Fill in the product description
  fireEvent.change(container.querySelector("input[name='description']"), {
    target: { value: "testDescription" },
  });

  //Fill in the product price
  fireEvent.change(container.querySelector("input[name='price']"), {
    target: { value: "10" },
  });

  //Fill in the product stock
  fireEvent.change(container.querySelector("input[name='stock']"), {
    target: { value: "10" },
  });

  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for file to be rendered
  expect(screen.getByText("Incorrect file")).toBeInTheDocument();
});

//A product with a repeated code is tried to add, error message is rendered correctly
test("A product with a repeated code is tried to add, error message is rendered correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

  let container: any;
  await act(async () => {
    container = render(
      <UploadProduct
        isForUpdate={false}
        products={products}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    ).container;
  });

  //Fill in the product name
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='name']"), {
      target: { value: "testName" },
    });
  });

  //Fill in the product description
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='description']"), {
      target: { value: "testDescription" },
    });
  });

  //Fill in the product price
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='price']"), {
      target: { value: "10" },
    });
  });

  //Fill in the product stock
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='stock']"), {
      target: { value: "10" },
    });
  });

  //Fill in the image
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='upload-photo']"), {
      target: { files: [new File([""], "test.jpg")] },
    });
  });

  //Mock the implementation for createProduct
  jest
    .spyOn(api, "createProduct")
    .mockImplementation(
      (product: Product): Promise<boolean> => Promise.resolve(false)
    );

  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message to be rendered
  expect(
    screen.getByText("That product code already exists! You should change it")
  ).toBeInTheDocument();
});

//A product is added correctly
test("A product is added correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation((): Promise<Product[]> => Promise.resolve(products));

  let container: any;
  await act(async () => {
    container = render(
      <UploadProduct
        isForUpdate={false}
        products={products}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    ).container;
  });

  //Fill in the product code
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='code']"), {
      target: { value: "01" },
    });
  });

  await act(async () => {
    fireEvent.change(container.querySelector("input[name='code']"), {
      target: { value: "05" },
    });
  });

  //Fill in the product name
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='name']"), {
      target: { value: "testName" },
    });
  });

  //Fill in the product description
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='description']"), {
      target: { value: "testDescription" },
    });
  });

  //Fill in the product price
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='price']"), {
      target: { value: "10" },
    });
  });

  //Fill in the product description
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='category']"), {
      target: { value: "Clothes" },
    });
  });
  //Fill in the product stock
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='stock']"), {
      target: { value: "10" },
    });
  });

  //Fill in the image
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='upload-photo']"), {
      target: { files: [new File([""], "test.jpg")] },
    });
  });

  //Mock the implementation for createProduct
  jest
    .spyOn(api, "createProduct")
    .mockImplementation(
      (product: Product): Promise<boolean> => Promise.resolve(true)
    );

  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });

  //Confirm message is rendered
  expect(screen.getByText("Product added correctly")).toBeInTheDocument();
});

//Test the UploadProduct component for updating a product is rendered correctly
test("UploadPoduct component for updating a product renders correctly", () => {
  const { getByText, getByTestId } = render(
    <UploadProduct
      isForUpdate={true}
      products={products}
      refreshShop={() => {}}
      webId="https://testId.com/"
      role="admin"
    />
  );

  //Expect title to be rendered
  expect(getByText("Update product")).toBeInTheDocument();

  //Check that the select box is renderd
  expect(getByTestId("select-product")).toBeInTheDocument();

  //Expect the form to be rendered
  expect(getByText("Product name")).toBeInTheDocument();
  expect(getByText("Product description")).toBeInTheDocument();
  expect(getByText("Product price")).toBeInTheDocument();
  expect(getByText("Product category")).toBeInTheDocument();
  expect(getByText("Product stock")).toBeInTheDocument();

  //Expect the submit button to be rendered
  expect(getByText("Submit")).toBeInTheDocument();
});

//Test for upload when a product is selected all the fields are filled correctly
test("UploadPoduct component for updating a product is filled correctly", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <UploadProduct
        isForUpdate={true}
        products={products}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    ).container;
  });

  //Select the product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  //Expect the product name to be filled
  expect(container.querySelector("input[name='name']").value).toBe("testName");

  //Expect the product description to be filled
  expect(container.querySelector("input[name='description']").value).toBe(
    "testDescription"
  );

  //Expect the product price to be filled
  expect(container.querySelector("input[name='price']").value).toBe("10");

  //Expect the product stock to be filled
  expect(container.querySelector("input[name='stock']").value).toBe("10");

  //Expect the product category to be filled
  expect(container.querySelector("input[name='category']").value).toBe(
    "Clothes"
  );

  //Mock the implementation for updateProduct
  jest
    .spyOn(api, "updateProduct")
    .mockImplementation(
      (webId: string, product: Product): Promise<boolean> =>
        Promise.resolve(true)
    );

  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });

  //Confirm message is rendered
  expect(screen.getByText("Product updated correctly")).toBeInTheDocument();
});
