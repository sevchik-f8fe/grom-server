import express from "express";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const app = express();

axiosRetry(axios, { retries: 3 });
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.BD_LINK)
    .then(() => console.log('db is ok'))
    .catch((err) => console.log('err: ' + err));


const server = app.listen(3000, '127.0.0.1', () => {
    console.log('server is ok');
});