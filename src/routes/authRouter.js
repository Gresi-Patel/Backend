import express from 'express';
import { deleteUser, getUsers, loginController, signupController } from '../controllers/authController.js';
const authRouter=express.Router();

// authRouter.get('/signup',(req,res)=>{
//    return res.render('signup');
// });

authRouter.post('/signup',signupController);
authRouter.post("/login", loginController);
authRouter.get('/:id',getUsers);

// authRouter.get("/getUsers",getUsers);
// authRouter.delete("/deleteUser/:id",deleteUser)

export default authRouter;