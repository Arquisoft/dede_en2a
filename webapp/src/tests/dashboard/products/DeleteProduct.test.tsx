import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import * as api from "../../../api/api";
import DeleteProduct from "../../../components/dashboard/products/DeleteProduct";
import { testProducts } from "../../../helpers/TestHelper";


//Test that the DeleteProduct component renders correctly
test("DeleteProduct renders correctly", () => {
  const { getByText } = render(
    <Router>
    <DeleteProduct
      products={testProducts}
      webId="https://test.com"
      role="admin"
      refreshShop={() => {}}
    />
    </Router>
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
      <Router>
      <DeleteProduct
        products={testProducts}
        webId="https://test.com"
        role="admin"
        refreshShop={() => {}}
      />
      </Router>
    ).container;
  });

  //Select the first product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });
  const autocomplete = screen.getByTestId("select-product");
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(autocomplete, { key: "Enter" });

  //Check that the form is filled correctly
  expect(container.querySelector("input[name='code']").value).toBe("02");

  expect(container.querySelector("input[name='name']").value).toBe("Test product 2");
  expect(container.querySelector("input[name='description']").value).toBe(
    "Test product 2 description"
  );
  expect(container.querySelector("input[name='price']").value).toBe("200");
  expect(container.querySelector("input[name='stock']").value).toBe("20");
  expect(container.querySelector("input[name='category']").value).toBe(
    "Clothes"
  );
});

//Test when the delete button is clicked and no product is selected the notification is shown
test("DeleteProduct notification is shown when no product is selected", async () => {
  let container: any;

  await act(async () => {
    container = render(
      <Router>
      <DeleteProduct
        products={testProducts}
        webId="https://test.com"
        role="admin"
        refreshShop={() => {}}
      />
      </Router>
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
      <Router>
      <DeleteProduct
        products={testProducts}
        webId="https://test.com"
        role="admin"
        refreshShop={() => {}}
      />
      </Router>
    ).container;
  });

  //Select the first product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  const autocomplete = screen.getByTestId("select-product");
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(autocomplete, { key: "Enter" });

  //Mock the implementation of the deleteProduct function
  jest
    .spyOn(api, "deleteProduct")
    .mockImplementation((webId: string, code: string): Promise<boolean> => {
      return Promise.resolve(false);
    });

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
      <Router>
      <DeleteProduct
        products={testProducts}
        webId="https://test.com"
        role="admin"
        refreshShop={() => {}}
      />
      </Router>
    ).container;
  });

  //Select the first product
  await act(async () => {
    fireEvent.change(container.querySelector("input[name='selection']"), {
      target: { value: "01" },
    });
  });

  const autocomplete = screen.getByTestId("select-product");
  fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
  fireEvent.keyDown(autocomplete, { key: "Enter" });

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
