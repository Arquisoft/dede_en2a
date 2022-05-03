import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../../api/api";
import UploadProduct from "../../../components/dashboard/products/UploadProduct";
import { testProducts } from "../../../helpers/TestHelper";
import { Product } from "../../../shared/shareddtypes";
//Test the upload product component for adding a product is rendered correctly
test("UploadPoduct component for adding a product renders correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation(
      (): Promise<Product[]> => Promise.resolve(testProducts)
    );

  await act(async () => {
    render(
      <Router>
        <UploadProduct
          isForUpdate={false}
          products={testProducts}
          refreshShop={() => {}}
          webId="https://testId.com/"
          role="admin"
        />
      </Router>
    );
  });

  //Expect title to be rendered
  expect(screen.getByText("Add product")).toBeInTheDocument();

  //Expect the form to be rendered
  expect(screen.getByText("Code")).toBeInTheDocument();
  expect(screen.getByText("Name of the product")).toBeInTheDocument();
  expect(screen.getByText("Write a description")).toBeInTheDocument();
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("Category")).toBeInTheDocument();
  expect(screen.getByText("Available stock")).toBeInTheDocument();
  expect(screen.getByText("Weight in kilograms")).toBeInTheDocument();

  //Expect the submit button to be rendered
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

//Test that error for fields are rendered
test("Error for product name is rendered correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation(
      (): Promise<Product[]> => Promise.resolve(testProducts)
    );

  let container: any;
  await act(async () => {
    container = render(
      <Router>
        <UploadProduct
          isForUpdate={false}
          products={testProducts}
          refreshShop={() => {}}
          webId="https://testId.com/"
          role="admin"
        />
      </Router>
    ).container;
  });

  //Click the submit button with a empty field for product name
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for name to be rendered
  expect(
    screen.getByText("No name for the product has been provided. Check it!")
  ).toBeInTheDocument();

  //Fill in the product name
  fireEvent.change(container.querySelector("input[name='name']"), {
    target: { value: "Test product 1" },
  });
  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for description to be rendered
  expect(
    screen.getByText("No description has been provided. Check it!")
  ).toBeInTheDocument();

  //Fill in the product description
  fireEvent.change(container.querySelector("textarea[name='description']"), {
    target: { value: "Test product 1 description" },
  });
  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for price to be rendered
  expect(
    screen.getByText("Price cannot be a number below 0. Please modify it")
  ).toBeInTheDocument();

  //Fill in the product price
  fireEvent.change(container.querySelector("input[name='price']"), {
    target: { value: "100" },
  });
  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
});

//File error is rendered correctly
test("File error is rendered correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation(
      (): Promise<Product[]> => Promise.resolve(testProducts)
    );

  let container: any;
  await act(async () => {
    container = render(
      <Router>
        <UploadProduct
          isForUpdate={false}
          products={testProducts}
          refreshShop={() => {}}
          webId="https://testId.com/"
          role="admin"
        />
      </Router>
    ).container;
  });

  //Fill in the product name
  fireEvent.change(container.querySelector("input[name='name']"), {
    target: { value: "Test product 1" },
  });

  //Fill in the product description
  fireEvent.change(container.querySelector("textarea[name='description']"), {
    target: { value: "Test product 1 description" },
  });

  //Fill in the product price
  fireEvent.change(container.querySelector("input[name='price']"), {
    target: { value: "100" },
  });

  //Fill in the product stock
  fireEvent.change(container.querySelector("input[name='stock']"), {
    target: { value: "10" },
  });

  //Fill in the product weight
  fireEvent.change(container.querySelector("input[name='weight']"), {
    target: { value: "1" },
  });

  //Click the submit button
  await act(async () => {
    fireEvent.click(screen.getByText("Submit"));
  });
  //Expect the error message for file to be rendered
  expect(
    screen.getByText("No file has been provided. This field is mandatory")
  ).toBeInTheDocument();
});

//A product with a repeated code is tried to add, error message is rendered correctly
test("A product with a repeated code is tried to add, error message is rendered correctly", async () => {
  //Mock the implementation of getProducts
  jest
    .spyOn(api, "getProducts")
    .mockImplementation(
      (): Promise<Product[]> => Promise.resolve(testProducts)
    );

  let container: any;
  await act(async () => {
    container = render(
      <Router>
        <UploadProduct
          isForUpdate={false}
          products={testProducts}
          refreshShop={() => {}}
          webId="https://testId.com/"
          role="admin"
        />
      </Router>
    ).container;
  });

  //Fill in the product name
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='name']"), {
      target: { value: "Test product 1" },
    });
  });

  //Fill in the product description
  await act(async () => {
    fireEvent.change(container.querySelector("textarea[name='description']"), {
      target: { value: "Test product 1 description" },
    });
  });

  //Fill in the product price
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='price']"), {
      target: { value: "100" },
    });
  });

  //Fill in the product stock
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='stock']"), {
      target: { value: "10" },
    });
  });

  //Fill in the product weight
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='weight']"), {
      target: { value: "1" },
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
    .mockImplementation(
      (): Promise<Product[]> => Promise.resolve(testProducts)
    );

  let container: any;
  await act(async () => {
    container = render(
      <Router>
        <UploadProduct
          isForUpdate={false}
          products={testProducts}
          refreshShop={() => {}}
          webId="https://testId.com/"
          role="admin"
        />
      </Router>
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
      target: { value: "Test product 1" },
    });
  });

  //Fill in the product description
  await act(async () => {
    fireEvent.change(container.querySelector("textarea[name='description']"), {
      target: { value: "Test product 1 description" },
    });
  });

  //Fill in the product price
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='price']"), {
      target: { value: "100" },
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

  //Fill in the product weight
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='weight']"), {
      target: { value: "1" },
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
    <Router>
      <UploadProduct
        isForUpdate={true}
        products={testProducts}
        refreshShop={() => {}}
        webId="https://testId.com/"
        role="admin"
      />
    </Router>
  );

  //Expect title to be rendered
  expect(getByText("Update product")).toBeInTheDocument();

  //Check that the select box is renderd
  expect(getByTestId("select-product")).toBeInTheDocument();

  //Expect the form to be rendered
  expect(screen.getByText("Name of the product")).toBeInTheDocument();
  expect(screen.getByText("Write a description")).toBeInTheDocument();
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("Category")).toBeInTheDocument();
  expect(screen.getByText("Available stock")).toBeInTheDocument();
  expect(screen.getByText("Weight in kilograms")).toBeInTheDocument();

  //Expect the submit button to be rendered
  expect(getByText("Submit")).toBeInTheDocument();
});

//Test for upload when a product is selected all the fields are filled correctly
test("UploadPoduct component for updating a product is filled correctly", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <Router>
        <UploadProduct
          isForUpdate={true}
          products={testProducts}
          refreshShop={() => {}}
          webId="https://testId.com/"
          role="admin"
        />
      </Router>
    ).container;
  });

  //Select the product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  const autocomplete = screen.getByTestId("select-product");
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(autocomplete, { key: "Enter" });

  //Expect the product name to be filled
  expect(container.querySelector("input[name='name']").value).toBe(
    "Test product 2"
  );

  //Expect the product description to be filled
  expect(container.querySelector("textarea[name='description']").value).toBe(
    "Test product 2 description"
  );

  //Expect the product price to be filled
  expect(container.querySelector("input[name='price']").value).toBe("200");

  //Expect the product stock to be filled
  expect(container.querySelector("input[name='stock']").value).toBe("20");

  //Expect the product category to be filled
  expect(container.querySelector("input[name='category']").value).toBe(
    "Clothes"
  );

  //Expect the product weight to be filled
  expect(container.querySelector("input[name='weight']").value).toBe("2");

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
