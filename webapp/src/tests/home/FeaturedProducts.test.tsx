import { fireEvent, getByTestId, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import FeaturedProducts from "../../components/home/FeaturedProducts";

test("FeaturedProducts is rendered", async () => {
  const { getByText, container } = render(
    <Router>
      <FeaturedProducts></FeaturedProducts>
    </Router>
  );

  //Check that the info about stock is rendered correctly
  expect(getByText("Our featured products")).toBeInTheDocument();
  expect(
    getByText(
      "These are the products we are most proud of. Feel free to check them out!"
    )
  ).toBeInTheDocument();

  expect(container.childNodes[0].childNodes.length).toBe(3);
});

test("Click on featured product", async () => {
  const { container } = render(
    <Router>
      <FeaturedProducts />
    </Router>
  );

  const addButton = getByTestId(container, "product10");
  fireEvent.click(addButton);
  expect(window.location.pathname).toBe("/product/10");
});
