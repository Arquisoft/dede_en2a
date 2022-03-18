import { Review } from "../shared/shareddtypes";

export function getReviewMean(reviews: Review[]) {
  let mean: number = 0;

  reviews.forEach((review) => {
    mean += review.rating;
  });

  mean /= reviews.length;

  return mean;
}
