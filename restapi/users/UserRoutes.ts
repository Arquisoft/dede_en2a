import express, { Router } from "express";
import * as UserController from "./UserController";

const api: Router = express.Router();

api.get("/users/findByWebId/:webId", UserController.getUser);

api.post("/users", UserController.createUser);

export default api;
