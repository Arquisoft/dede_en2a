import express, { Request, Response, Router } from 'express';
import {check} from 'express-validator';
import User from './models/users';

const api:Router = express.Router()

//This is not a restapi as it mantains state but it is here for
//simplicity. A database should be used instead.

api.get(
    "/users/list",
    async (req: Request, res: Response): Promise<Response> => {
        const users = await User.find({}).sort('-_id');
        return res.status(200).send(users);
    }
);

api.post(
  "/users/add",[
    check('name').isLength({ min: 1 }).trim().escape(),
    check('email').isEmail().normalizeEmail(),
  ],
  async (req: Request, res: Response): Promise<Response> => {
    let name = req.body.name;
    let email = req.body.email;
    let user = new User({
      name:name,
      email:email
    });

    await user.save();
    
    return res.sendStatus(200);
  }
);

export default api;