import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Hero from "../../components/home/Hero";

test("Hero is rendered", async () => {
  
    const { getByText, container } = render(
      <Router>
        <Hero></Hero>
      </Router>
    );
  
    //Check that the info about stock is rendered correctly
    expect(getByText("Welcome to DeDe")).toBeInTheDocument();
    expect(getByText("Start shopping")).toBeInTheDocument();
});