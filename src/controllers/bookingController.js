import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const createBooking = async(req,res) =>{
    const {name, email, phone, date, time, people, message} = req.body
}

export {createBooking};