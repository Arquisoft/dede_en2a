import express, { Request, Response, Router } from 'express';
import * as ReviewController from './ReviewController';

const api:Router = express.Router()

api.get('/reviews/list/', ReviewController.getAllReviews)

api.get('/reviews/listByEmail/:email', ReviewController.getReviewsByUser)

api.get('/reviews/listByCode/:productCode', ReviewController.getReviewsByProduct)

api.post('/reviews/create', ReviewController.createReview)

export default api