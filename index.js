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

// import bodyParser from 'body-parser';


const app = express();
app.use(cors());
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

app.use('/admin',adminRouter)


// serviceProviderRouter.get("/",()={});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});


// http://localhost:4000/auth/signup
// http://localhost:4000/service_provider/
// http://localhost:4000/event_manager/
// http://localhost:4000/event/
// http://localhost:4000/service/
// http://localhost:4000/booking/
// http://localhost:4000/feedback/


