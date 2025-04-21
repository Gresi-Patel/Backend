import express from 'express';
import authRouter from './src/routes/authRouter.js';
import path from 'path';
// import { fileURLToPath } from 'url';
import cors from 'cors';
import { serviceProviderRouter } from './src/routes/serviceProviderRouter.js';
import { eventManagerRouter } from './src/routes/eventManagerRouter.js';
import { eventRouter } from './src/routes/eventRouter.js';
import { serviceRouter } from './src/routes/serviceRouter.js';
import { bookingRouter } from './src/routes/bookingRouter.js';
import feedbackRouter from './src/routes/feedbackRouter.js';
import adminRouter from './src/routes/adminRoutes.js';
import { subCategoryRouter } from './src/routes/subCategoryRouter.js';
import { serviceSubtypeRouter } from './src/routes/subTypeRouter.js';
import serviceCategoryRouter from './src/routes/serviceCategoryRouter.js';
import otpRouter from './src/routes/otpRoutes.js';
import paymentRouter from './src/routes/paymentRouter.js';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import bodyParser from 'body-parser';


const app = express();
// app.use(cors());

app.use('/invoices', express.static(path.join(__dirname, 'public/invoices')));


//  Correct CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://6805bf80c11323943a6198aa--oneplace-event.netlify.app/'], 
  credentials: true,
}));

// Optional: handle preflight
app.options('*', cors());
app.use(express.json());


// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set EJS as the view engine
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "src","views")); 

app.use('/auth', authRouter);
app.use('/service_provider', serviceProviderRouter);
app.use('/event_manager', eventManagerRouter);
app.use('/event', eventRouter);
app.use('/service', serviceRouter)
app.use('/bookings', bookingRouter)
app.use('/feedback', feedbackRouter)
app.use('/subcategory', subCategoryRouter)
app.use('/subtype', serviceSubtypeRouter)
app.use('/service-category', serviceCategoryRouter)
app.use('/otp-api', otpRouter)
app.use('/payment',paymentRouter)

app.use('/admin', adminRouter)


// serviceProviderRouter.get("/",()={});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});


// http://localhost:4000/auth/signup
// http://localhost:4000/service_provider/
// http://localhost:4000/event_manager/
// http://localhost:4000/event/
// http://localhost:4000/service/
// http://localhost:4000/booking/
// http://localhost:4000/feedback/


