//IMPORTS
import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config(); // now we can run .env files
import connectToDB from './db/connectionToDB.js'; //connection with database
import notFound from './errorMiddleware/notFound.js'; // for route that does not exists
import errorHandler from './errorMiddleware/errorHandler.js'; // my custom error handler
import 'express-async-errors'; //This library is about what happens when you hit an error.
import productRoutes from './routes/routesProducts.js';
import usersRoutes from './routes/routesUser.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloud from 'cloudinary';
const cloudinary = cloud.v2;
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

//CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
//
//
//
//MIDDLEWARE
app.use(express.json()); // now we can use req.body json() data
app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET)); // we can read cookie with signature

//main routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', usersRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

//error middleware
app.use(notFound); // goes at the end but before errorHandler
app.use(errorHandler); // goes at the end together with notFound

//
//
//
//CONNECTION TO DATABASE AND STARTING SERVER
const port = process.env.PORT || 5000;
const startServerAndDB = async () => {
  try {
    await connectToDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
startServerAndDB();
