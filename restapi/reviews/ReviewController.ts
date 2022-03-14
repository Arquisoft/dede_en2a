import { RequestHandler } from "express";
import { body } from "express-validator";
import { reviewModel, reviewSchema } from "./Review";

export const getAllReviews: RequestHandler = async (req, res) => {
  try {
    const reviews = await reviewModel.find();
    return res.json(reviews);
  } catch (error) {
    res.json(error);
  }
};

export const getReviewsByUser: RequestHandler = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ userEmail: req.params.email });
    return res.json(reviews);
  } catch (error) {
    res.json(error);
  }
};

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
  try {
    const reviewSaved = await new reviewModel(req.body).save();
    res.json(reviewSaved);
  } catch (error) {
    res.status(412).json({ message: "The data is not valid " + error });
  }
};
export const getReviewsByProductAndUser: RequestHandler = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      productCode: req.params.productCode,
      userEmail: req.params.email
    });
    return res.json(reviews);
  } catch (error) {
    res.json(error);
  }
};
