import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "../../components/home/Home";

test("Home page is rendered", async () => {
  
    const { getByText, container } = render(
      <Router>
        <Home></Home>
      </Router>
    );
  
    //Check that the info about stock is rendered correctly
    expect(getByText("Welcome to DeDe")).toBeInTheDocument();
    expect(getByText("Our featured products")).toBeInTheDocument();

    // Expect there are 2 elements inside the first (stack)
    expect(container.childNodes[0].childNodes.length).toBe(2)
});