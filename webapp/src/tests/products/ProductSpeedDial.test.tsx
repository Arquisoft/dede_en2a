import React from "react";

import { fireEvent, render } from "@testing-library/react";
import ProductSpeedDial from "../../components/products/ProductSpeedDial";
import { BrowserRouter as Router } from "react-router-dom";

const empty = () => {};

test("The dial is rendered", async () => {

    const { container } = render(
        <Router>
            <ProductSpeedDial addToCart={empty} review={empty} share={empty}/>
        </Router>
    );

    let addButton = container.querySelector("[aria-label='Add to Shopping Cart']");
    expect(addButton).toBeInTheDocument();

    let reviewButton = container.querySelector("[aria-label='Review item']");
    expect(reviewButton).toBeInTheDocument();

    let shareButton = container.querySelector("[aria-label='Share']");
    expect(shareButton).toBeInTheDocument();

});

test("The Add Button Works", async () => {

    let works = false;
    const buttonTest = () => {works = true;};

    const { container } = render(
        <Router>
            <ProductSpeedDial addToCart={buttonTest} review={empty} share={empty}/>
        </Router>
    );

    let addButton = container.querySelector("[aria-label='Add to Shopping Cart']") as HTMLElement;
    fireEvent.click(addButton);

    expect(works).toBe(true);
});

test("The Review Button Works", async () => {

    let works = false;
    const buttonTest = () => {works = true;};

    const { container } = render(
        <Router>
            <ProductSpeedDial addToCart={empty} review={buttonTest} share={empty}/>
        </Router>
    );

    let addButton = container.querySelector("[aria-label='Review item']") as HTMLElement;
    fireEvent.click(addButton);

    expect(works).toBe(true);
});

test("The Share Button Works", async () => {

    let works = false;
    const buttonTest = () => {works = true;};

    const {container} = render(
        <Router>
            <ProductSpeedDial addToCart={empty} review={empty} share={buttonTest}/>
        </Router>
    );

    let addButton = container.querySelector("[aria-label='Share']") as HTMLElement;
    fireEvent.click(addButton);

    expect(works).toBe(true);
});
