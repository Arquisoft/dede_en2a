import { fireEvent, render, act, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../../components/navigation/NavBar";

test("NavBar renders correctly", async () => {
  await act(async () => {
    render(
      <Router>
        <NavBar
          totalUnitsInCart={5}
          logCurrentUserOut={() => {}}
          toggleColorMode={() => {}}
          mode={"dark"}
          webId={"https://webid.com"}
        />
      </Router>
    );
  });

  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Shop")).toBeInTheDocument();
  expect(screen.getByText("Cart")).toBeInTheDocument();

  expect(screen.getByText("5")).toBeInTheDocument();
});
