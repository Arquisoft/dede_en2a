import { Application, RequestHandler } from "express";
import { body } from "express-validator";
import { cartModel } from "./Cart";

export const getUserCart: RequestHandler = async (req, res) => {
    const userCart = await cartModel.find({ userEmail: req.params.userEmail });
    if (userCart) {
        return res.json(userCart)
    } else {
        return res.status(204).json();
    }
}

export const createCart: RequestHandler = async (req, res) => {
    try {
        const cart = new cartModel(req.body)
        const cartSaved = await cart.save()
        res.json(cartSaved)
    } catch (error) {
        res.status(301).json(" Something went wrong")
    }
}

export const deleteCart: RequestHandler = async (req, res) => {
    const cart = await cartModel.findOneAndDelete({userEmail: req.params.userEmail});
    if (cart) {
        return res.json(cart)
    }else{
        return res.json({message: "There is no a cart for that id"}).status(204)
    }
}

export const addProductToCart: RequestHandler = async (req, res) => {
    try {
    }catch (error){
        res.json(error)
    }
}

export const removeProductFromCart: RequestHandler = async (req, res) => {
    try {
    }catch (error){
        res.json(error)
    }
}