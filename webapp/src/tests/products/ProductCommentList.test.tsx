import { render, act, screen } from "@testing-library/react";
import ProductCommentList from "../../components/products/ProductCommentList";
import { Review } from "../../shared/shareddtypes";
import * as SolidHelper from "../../helpers/SolidHelper";

//Test that a list of reviews is rendered correctly
test("Renders a list of reviews", async () => {
  const reviews: Review[] = [
    {
      webId:
        "aHR0cHM6Ly9hbmdlbGlwMjMwMy5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI2",
      productCode: "9999",
      rating: 4,
      comment: "This is the first test comment",
    },
    {
      webId:
        "aHR0cHM6Ly9hbmdlbqweqwjMwMy5zb2xpZGNvbW11bml0eS5uZXQvcHJvZmlsZS9jYXJkI2",
      productCode: "9998",
      rating: 5,
      comment: "This is the second test comment",
    },
  ];

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
