import express, { Request, Response, Router } from 'express';
import * as ReviewController from './ReviewController';

const api:Router = express.Router()

api.get('/reviews/listByCode/:productCode', ReviewController.getReviewsByProduct)

api.post('/reviews', ReviewController.createReview)

api.get('/reviews/listByCodeAndEmail/:productCode/:email', ReviewController.getReviewsByProductAndUser)

export default api
