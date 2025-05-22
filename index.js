import express from "express";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";

import WebSocket, { WebSocketServer } from "ws";

import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

import Team from "./schemas/Team.js";
import { checkTeamAuthMiddleware, signIn, signUp } from "./controllers/authControllers.js";
import { checkAdminAuthMiddleware, getPoints, getTeams } from "./controllers/adminControllers.js";
import { getTime } from "./controllers/pointControllers.js";

const app = express();

const wss = new WebSocketServer({ port: 8080 })

axiosRetry(axios, { retries: 3 });
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());

mongoose
    .connect(process.env.BD_LINK, {
        authSource: "admin",
    })
    .then(() => console.log('db is ok'))
    .catch((err) => console.log('err: ' + err));



wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        updateTeamCoordsAndBroadcast(wss, message);
    });

    ws.on('close', () => console.log('Client disconnected'));
});

async function updateTeamCoordsAndBroadcast(wss, message) {
    try {
        const { teamName, coords } = JSON.parse(message);

        if (!Array.isArray(coords) || coords.length !== 2 || !coords.every(Number.isFinite)) {
            console.log('Invalid coords format. Expected [longitude, latitude].');
            return;
        }

        const updatedTeam = await Team.findOneAndUpdate(
            { teamName: teamName },
            { currentCoords: coords },
            { new: true }
        );

        if (!updatedTeam) {
            console.log(`Team with name ${teamName} not found.`);
            return;
        }

        console.log(`Updated coordinates for team ${teamName}:`, coords);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'teamUpdate', // Тип сообщения для идентификации в админке
                    teamName: updatedTeam.teamName,
                    currentCoords: updatedTeam.currentCoords,
                }));
            }
        });

    } catch (error) {
        console.error('Error updating team coordinates:', error);
    }
}

app.post('/admin/getTeams', checkAdminAuthMiddleware, getTeams);
app.post('/admin/getPoints', checkAdminAuthMiddleware, getPoints);

app.get('/getTime', getTime);

app.post('/auth/signup', signUp);
app.post('/auth/signin', signIn);
app.get('/', async (req, res) => {
    res.json({ ok: 'da' })
})

app.listen(3000, '127.0.0.1', () => {
    console.log('server is ok');
});