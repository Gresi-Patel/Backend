import express from 'express';
const authRouter=express.Router();

authRouter.get('/signup',(req,res)=>{
   return res.render('signup');
})








export default authRouter;