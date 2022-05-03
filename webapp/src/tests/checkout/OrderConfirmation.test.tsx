import { act, fireEvent, screen, render } from "@testing-library/react";
import OrderConfirmation from "../../components/checkout/OrderConfirmation";
import { BrowserRouter as Router } from "react-router-dom";

test("OrderConfirmation renders correctly", async () => {
  await act(async () => {
    render(
      <Router>
        <OrderConfirmation pdf={"testCode"} />
      </Router>
    );
  });

  expect(screen.getByText("It's ordered!")).toBeInTheDocument();
  expect(
    screen.getByText(
      "We've received your order and will ship your package as as soon as possible."
    )
  ).toBeInTheDocument();

  //Check that the finish button works
  expect(screen.getByText("Finish")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Finish"));
  expect(window.location.pathname).toBe("/");
});
