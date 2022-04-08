import { render } from "@testing-library/react";
import ProductComment from "../../components/products/ProductComment";
import { Review } from "../../shared/shareddtypes";

//Test that a review is rendered correctly
test("Renders a review", () => {
  const review: Review = {
    webId: "test@email.com",
    productCode: "9999",
    rating: 4,
    comment: "This is a test comment",
  };

  const { getByText, container } = render(<ProductComment review={review} />);

  expect(getByText(review.webId)).toBeInTheDocument();
  expect(getByText(review.comment)).toBeInTheDocument();

  //Check that the rating is rendered correctly with the correct number of stars with aria-label = "4 Stars"
  const rating = container.querySelector("[aria-label='4 Stars']");
  expect(rating).toBeInTheDocument();
});
