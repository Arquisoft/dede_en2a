import { act, render, screen } from "@testing-library/react";
import ProductCommentList from "../../components/shop/comments/ProductCommentList";
import * as SolidHelper from "../../helpers/SolidHelper";
import { reviews } from "../../helpers/TestHelper";

//Test that a list of reviews is rendered correctly
test("Renders a list of reviews", async () => {
  //Mock the implemenatation of getNameFromPod
  jest
    .spyOn(SolidHelper, "getNameFromPod")
    .mockImplementation(
      (webId: string): Promise<string> => Promise.resolve("Test user")
    );

  let container: any;
  await act(async () => {
    container = render(<ProductCommentList reviews={reviews} />).container;
  });

  //Check that the title is rendered
  expect(
    screen.getByText("User opinions about this product!")
  ).toBeInTheDocument();

  expect(screen.getByText(reviews[0].comment)).toBeInTheDocument();
  expect(screen.getByText(reviews[1].comment)).toBeInTheDocument();

  //Check that both ratings are rendered
  expect(container.querySelector("[aria-label='4 Stars']")).toBeInTheDocument();
  expect(container.querySelector("[aria-label='5 Stars']")).toBeInTheDocument();
});
