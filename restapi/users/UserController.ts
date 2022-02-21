import { Application, RequestHandler } from "express";
import { userModel } from "./User";

export const getUsers: RequestHandler = (req, res) => {
    res.json('getting users')
}

export const getUser: RequestHandler = (req, res) => {
    res.json('getting a user')
}

export const createUser: RequestHandler = (req, res) => {
    //const user = new userModel(req.body)
    //user.save().then(() => { console.log("conseguido") })
    res.json('creating a user') 
}

export const deleteUser: RequestHandler = (req, res) => {
    res.json('deleting a user')
}

export const updateUser: RequestHandler = (req, res) => {
    res.json('updating a user')
}