import express, { Request, Response, Router } from 'express';
import * as UserController from './UserController';

const api:Router = express.Router()

api.get('/users', UserController.getUsers)

api.get('/users/:id', UserController.getUser)

api.post('/users', UserController.createUser)

api.delete('/users/:id', UserController.deleteUser)

api.put('/users/:id', UserController.updateUser)