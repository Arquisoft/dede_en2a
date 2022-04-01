import { render } from "@testing-library/react";
import ProductCommentList from "../../components/products/ProductCommentList";
import { Review } from "../../shared/shareddtypes";

//Test that a list of reviews is rendered correctly
test("Renders a list of reviews", () => {
  const reviews: Review[] = [
    {
      userEmail: "test@email.com",
      productCode: "9999",
      rating: 4,
      comment: "This is the first test comment",
    },
    {
      userEmail: "prueba@email.com",
      productCode: "9998",
      rating: 5,
      comment: "This is the second test comment",
    },
  ];

  const { getByText, container } = render(
    <ProductCommentList reviews={reviews} />
  );

  //Check that the title is rendered
  expect(getByText("User opinions about this product!")).toBeInTheDocument();

  //Check that both emails and comments are rendered
  expect(getByText(reviews[0].userEmail)).toBeInTheDocument();
  expect(getByText(reviews[0].comment)).toBeInTheDocument();
  expect(getByText(reviews[1].userEmail)).toBeInTheDocument();
  expect(getByText(reviews[1].comment)).toBeInTheDocument();

  //Check that both ratings are rendered
  expect(container.querySelector("[aria-label='4 Stars']")).toBeInTheDocument();
  expect(container.querySelector("[aria-label='5 Stars']")).toBeInTheDocument();
});
