import express, { Request, Response, Router } from 'express';
import * as UserController from './UserController';

const api:Router = express.Router()

api.get('/users/list', UserController.getUsers)

api.get('/users/findByEmail/:email', UserController.getUser)

api.post('/users/create', UserController.createUser)

api.delete('/users/deleteByEmail/:email', UserController.deleteUser)

api.post('/users/update/:email', UserController.updateUser)

export default api