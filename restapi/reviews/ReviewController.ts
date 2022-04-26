import { RequestHandler } from "express";
import { verifyWebID } from "../utils/WebIDValidation";
import { reviewModel } from "./Review";

export const getReviewsByProduct: RequestHandler = async (req, res) => {
  const reviews = await reviewModel.find({
    productCode: req.params.productCode,
  });
  return res.json(reviews);
};

export const createReview: RequestHandler = async (req, res) => {
  const review = new reviewModel(req.body);
  const webId = req.headers.token + "";
  const verfied = await verifyWebID(webId);
  console.log("--------------------------------" + webId);
  if (verfied)
    try {
      const reviewSaved = await review.save();
      res.json(reviewSaved);
    } catch (error) {
      res.status(412).json({ message: "The data is not valid" });
    }
  else res.status(403).json({ message: "Invalid webId" });
};

export const getReviewsByProductAndUser: RequestHandler = async (req, res) => {
  const reviews = await reviewModel.find({
    productCode: req.params.productCode,
    webId: req.params.webId,
  });
  return res.json(reviews);
};
