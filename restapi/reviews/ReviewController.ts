import { RequestHandler } from "express";
import { verifyWebID } from "../utils/WebIDValidation";
import { reviewModel } from "./Review";

export const getReviewsByProduct: RequestHandler = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      productCode: req.params.productCode,
    });
    return res.json(reviews);
  } catch (error) {
    res.json(error);
  }
};

export const createReview: RequestHandler = async (req, res) => {
  const review = new reviewModel(req.body);

  if (verifyWebID(req.headers.webId + ""))
    try {
      const reviewSaved = await review.save();
      res.json(reviewSaved);
    } catch (error) {
      res.status(412).json({ message: "The data is not valid " + error });
    }
  else res.status(203).json({ message: "Invalid token " });
};

export const getReviewsByProductAndUser: RequestHandler = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      productCode: req.params.productCode,
      webId: req.params.webId,
    });
    return res.json(reviews);
  } catch (error) {
    res.json(error);
  }
};
