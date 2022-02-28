import { Console } from "console";
import { Application, RequestHandler } from "express";
import { body } from "express-validator";
import { orderModel } from "./Order";

export const getOrders: RequestHandler = async (req, res) => {
    try {
        const orders = await orderModel.find()
        console.log(orders)
        return res.json(orders)
    } catch (error) {
        res.json(error)
    }
}

export const getUserOrders: RequestHandler = async (req, res) => {
    const orderFound = await orderModel.find({ userId: req.params.userId });
    if (orderFound) {
        return res.json(orderFound)
    } else {
        return res.status(204).json();
    }
}

export const createOrder: RequestHandler = async (req, res) => {
    try {
        const order = new orderModel(req.body)
        const ordersaved = await order.save()
        res.json(ordersaved)
    } catch (error) {
        res.status(301).json({ message: 'The data is not valid'})
    }
}

export const deleteOrder: RequestHandler = async (req, res) => {
    const orderFound = await orderModel.findByIdAndDelete(req.params.id);
    if (orderFound) {
        return res.json(orderFound)
    }else{
        return res.json({message: "There is no such order id"}).status(204)
    }
}

export const updatOrder: RequestHandler = async (req, res) => {
    try {
    }catch (error){
        res.json(error)
    }
}