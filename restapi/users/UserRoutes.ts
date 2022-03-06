import express, { Request, Response, Router } from 'express';
import * as UserController from './UserController';

const api:Router = express.Router()

api.get('/users/list', UserController.getUsers)

api.get('/users/findByEmail/:email', UserController.getUser)

api.get('/users/verify/:email/:uniqueString', UserController.verifyUser)

api.get('/users/verified', UserController.verified)

api.get('/users/notVerified/:message', UserController.notVerified)

api.post('/users/create', UserController.createUser)

api.delete('/users/deleteByEmail/:email', UserController.deleteUser)

api.post('/users/update/:email', UserController.updateUser)

api.post('/users/requestToken/', UserController.requestToken)

export default api