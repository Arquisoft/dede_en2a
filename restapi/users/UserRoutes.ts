import express, { Request, Response, Router } from 'express';
import * as UserController from './UserController';

const api:Router = express.Router()

api.get('/users', UserController.getUsers)