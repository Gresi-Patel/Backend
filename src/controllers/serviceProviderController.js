import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getServiceProvider=async(req,res)=>{
    try{

        const serviceProvider=await prisma.user.findMany({
            where:{
                role:"service_provider"
            }
        });
        res.json(serviceProvider);  
    }
    catch(error){
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }

  export {getServiceProvider};