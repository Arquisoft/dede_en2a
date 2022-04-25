import { render, fireEvent, act, screen } from "@testing-library/react";
import DeleteProduct from "../../../components/dashboard/products/DeleteProduct";
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
  },
  {
    code: "02",
    name: "testName2",
    description: "testDescription2",
    price: 20,
    stock: 20,
    image: "8888.png",
    category: "Decoration",
  },
];

//Test that the DeleteProduct component renders correctly
test("DeleteProduct renders correctly", () => {
  const { getByText } = render(
    <DeleteProduct
      products={products}
      webId="http://test.com"
      role="admin"
      refreshShop={() => {}}
    />
  );

  //Check that the title is rendered correctly
  expect(getByText("Delete a product")).toBeInTheDocument();

  //Check that the form is rendered correctly
  expect(getByText("Product code")).toBeInTheDocument();
  expect(getByText("Product name")).toBeInTheDocument();
  expect(getByText("Product description")).toBeInTheDocument();
  expect(getByText("Product price")).toBeInTheDocument();
  expect(getByText("Product stock")).toBeInTheDocument();
  expect(getByText("Product category")).toBeInTheDocument();

  //Check that the delete button is rendered correctly
  expect(getByText("Delete")).toBeInTheDocument();
});

//Test that the form is filled when a product is selected
test("DeleteProduct form is filled when a product is selected", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <DeleteProduct
        products={products}
        webId="http://test.com"
        role="admin"
        refreshShop={() => {}}
      />
    ).container;
  });

  //Select the first product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  //Check that the form is filled correctly
  expect(container.querySelector("input[name='code']").value).toBe("01");
  expect(container.querySelector("input[name='name']").value).toBe("testName");
  expect(container.querySelector("input[name='description']").value).toBe(
    "testDescription"
  );
  expect(container.querySelector("input[name='price']").value).toBe("10");
  expect(container.querySelector("input[name='stock']").value).toBe("10");
  expect(container.querySelector("input[name='category']").value).toBe(
    "Clothes"
  );
});

//Test when the delete button is clicked and no product is selected the notification is shown
test("DeleteProduct notification is shown when no product is selected", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <DeleteProduct
        products={products}
        webId="http://test.com"
        role="admin"
        refreshShop={() => {}}
      />
    ).container;
  });

  //Click the delete button
  await act(async () => {
    fireEvent.click(screen.getByText("Delete"));
  });

  //Check that the notification is shown
  expect(screen.getByText("Select a product to delete"));
});

//Test the error when trying to delete a product.
test("DeleteProduct error is shown when trying to delete a product", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <DeleteProduct
        products={products}
        webId="http://test.com"
        role="admin"
        refreshShop={() => {}}
      />
    ).container;
  });

  //Select the first product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  //Mock the implementation of the deleteProduct function
  jest
    .spyOn(api, "deleteProduct")
    .mockImplementation(
      (webId: string, code: string): Promise<boolean> => Promise.resolve(false)
    );

  //Click the delete button
  await act(async () => {
    fireEvent.click(screen.getByText("Delete"));
  });

  //Check that the error is shown
  expect(screen.getByText("There was a problem while deleting"));
});

//Test the success when trying to delete a product.
test("DeleteProduct success is shown when trying to delete a product", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <DeleteProduct
        products={products}
        webId="http://test.com"
        role="admin"
        refreshShop={() => {}}
      />
    ).container;
  });

  //Select the first product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  //Mock the implementation of the deleteProduct function
  jest
    .spyOn(api, "deleteProduct")
    .mockImplementation(
      (webId: string, code: string): Promise<boolean> => Promise.resolve(true)
    );

  //Click the delete button
  await act(async () => {
    fireEvent.click(screen.getByText("Delete"));
  });

  //Check that the success is shown
  expect(screen.getByText("Product deleted correctly"));
});
