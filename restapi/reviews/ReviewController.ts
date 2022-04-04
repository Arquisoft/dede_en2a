import { RequestHandler } from "express";
import { verifyToken } from "../utils/generateToken";
import { reviewModel } from "./Review";

export const getReviewsByProduct: RequestHandler = async (req, res) => {
  const reviews = await reviewModel.find({
    productCode: req.params.productCode,
  });
  return res.json(reviews);
};

export const createReview: RequestHandler = async (req, res) => {
  const review = new reviewModel(req.body);
  const isVerified = verifyToken(req.headers.token + "", review.userEmail);
  if (isVerified) {
    try {
      const reviewSaved = await review.save();
      res.json(reviewSaved);
    } catch (error) {
      res.status(412).json({ message: "The data is not valid" });
    }
  } else {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const getReviewsByProductAndUser: RequestHandler = async (req, res) => {
  const reviews = await reviewModel.find({
    productCode: req.params.productCode,
    userEmail: req.params.email,
  });
  return res.json(reviews);
};
