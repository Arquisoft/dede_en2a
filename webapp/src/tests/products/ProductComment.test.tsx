import { render, act, screen } from "@testing-library/react";
import ProductComment from "../../components/shop/comments/ProductComment";
import { Review } from "../../shared/shareddtypes";
import * as SolidHelper from "../../helpers/SolidHelper";

//Test that a review is rendered correctly
test("Renders a review", async () => {
  const review: Review = {
    webId:
      "aHR0cHM6Ly9hbmdlbGlwMjMwMy5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI2",
    productCode: "9999",
    rating: 4,
    comment: "This is a test comment",
  };

  //Mock the implemenatation of getNameFromPod
  jest
    .spyOn(SolidHelper, "getNameFromPod")
    .mockImplementation(
      (webId: string): Promise<string> => Promise.resolve("Test user")
    );

  let container: any;
  await act(async () => {
    container = render(<ProductComment review={review} />).container;
  });

  expect(screen.getByText("Test user")).toBeInTheDocument();
  expect(screen.getByText(review.comment)).toBeInTheDocument();

  //Check that the rating is rendered correctly with the correct number of stars with aria-label = "4 Stars"
  const rating = container.querySelector("[aria-label='4 Stars']");
  expect(rating).toBeInTheDocument();
});
