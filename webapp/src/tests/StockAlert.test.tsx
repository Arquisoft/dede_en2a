import { fireEvent, render } from "@testing-library/react";
import StockAlert from "../components/shop/misc/StockAlert";

test("Stock available > 10 is rendered correctly", async () => {
  const { getByText, container } = render(<StockAlert stock={50} amount={0} />);

  expect(getByText("Stock available!")).toBeInTheDocument();
  expect(container.querySelector("div")!.className).toContain("colorSuccess");
});

test("Stock available < 10 is rendered correctly", async () => {
  const { getByText, container } = render(<StockAlert stock={9} amount={0} />);

  expect(getByText("Few units left!")).toBeInTheDocument();
  expect(container.querySelector("div")!.className).toContain("colorWarning");
});

test("Stock available == 0 is rendered correctly", async () => {
  const { getByText, container } = render(<StockAlert stock={0} amount={0} />);

  expect(getByText("No stock available!")).toBeInTheDocument();
  expect(container.querySelector("div")!.className).toContain("colorError");
});
