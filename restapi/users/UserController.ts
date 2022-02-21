import express, { Application, RequestHandler } from "express";

export const getUsers: RequestHandler = (req, res) => { res.json('getting users') }