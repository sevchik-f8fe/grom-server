import express from "express";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

import { checkAuthMiddleware, signIn, signUp } from "./controllers/authControllers.js";

const app = express();

axiosRetry(axios, { retries: 3 });
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.BD_LINK, {
        authSource: "admin",
    })
    .then(() => console.log('db is ok'))
    .catch((err) => console.log('err: ' + err));

// app.post('/point/create', createPoint);
app.post('/auth/signup', signUp);
app.post('/auth/signin', signIn);

const server = app.listen(3000, '127.0.0.1', () => {
    console.log('server is ok');
});