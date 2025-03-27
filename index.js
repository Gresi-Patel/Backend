import express from 'express';
import authRouter from './src/routes/authRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app=express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src","views")); // If views is inside src/

app.use(authRouter);

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
  });