import { fireEvent, render, act, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavMenu from "../../components/navigation/NavMenu";

test("NavMenu renders correctly", async () => {
  await act(async () => {
    render(
      <Router>
        <NavMenu orientation="horizontal" color="primary" />
      </Router>
    );
  });

  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Shop")).toBeInTheDocument();
  expect(screen.getByText("Cart")).toBeInTheDocument();
});
