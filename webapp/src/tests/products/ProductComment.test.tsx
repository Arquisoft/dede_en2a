import { act, render, screen } from "@testing-library/react";
import ProductComment from "../../components/shop/comments/ProductComment";
import * as SolidHelper from "../../helpers/SolidHelper";
import { reviews } from "../../helpers/TestHelper";

//Test that a review is rendered correctly
test("Renders a review", async () => {
  //Mock the implemenatation of getNameFromPod
  jest
    .spyOn(SolidHelper, "getNameFromPod")
    .mockImplementation(
      (webId: string): Promise<string> => Promise.resolve("Test user")
    );

  let container: any;
  await act(async () => {
    container = render(<ProductComment review={reviews[0]} />).container;
  });

  expect(screen.getByText("Test user")).toBeInTheDocument();
  expect(screen.getByText(reviews[0].comment)).toBeInTheDocument();

  //Check that the rating is rendered correctly with the correct number of stars with aria-label = "4 Stars"
  const rating = container.querySelector("[aria-label='4 Stars']");
  expect(rating).toBeInTheDocument();
});
