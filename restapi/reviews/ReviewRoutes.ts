import express, { Request, Response, Router } from "express";
import * as ReviewController from "./ReviewController";

const api: Router = express.Router();

api.get(
  "/reviews/listByCode/:productCode",
  ReviewController.getReviewsByProduct
);

api.post("/reviews", ReviewController.createReview);

api.get(
    "/reviews/listByCodeAndWebId/:productCode/:webId",
    ReviewController.getReviewsByProductAndUser
);

api.put(
    "/reviews/:productCode/:webId",
    ReviewController.modifyReview
);

export default api;
