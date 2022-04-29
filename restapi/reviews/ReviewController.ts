import {RequestHandler} from "express";
import {verifyWebID} from "../utils/WebIDValidation";
import {reviewModel} from "./Review";

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
    if (verfied)
        try {
            const reviewSaved = await review.save();
            res.json(reviewSaved);
        } catch (error) {
            res.status(412).json({message: "The data is not valid"});
        }
    else res.status(403).json({message: "Invalid webId"});
};

export const modifyReview: RequestHandler = async (req, res) => {
    const review = await reviewModel.find({
        productCode: req.params.productCode,
        webId: req.params.webId,
    });

    try {
        const reviewSaved = await reviewModel.findByIdAndUpdate(review[0]._id, req.body);
        res.json(reviewSaved);
    } catch (error) {
        res.status(412).json({message: "The data is not valid"});
    }
};

export const getReviewsByProductAndUser: RequestHandler = async (req, res) => {
    const reviews = await reviewModel.find({
        productCode: req.params.productCode,
        webId: req.params.webId,
    });
    return res.json(reviews);
};
