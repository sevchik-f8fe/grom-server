import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import Team from "../schemas/Team.js";
import Admin from "../schemas/Admin.js";

// const updatePosition = async (req, res) => {
//     try {
//         const { teamName, coords } = req;

//         const team = await Team.findOne({ teamName: teamName });

//         if (!team) {
//             console.log(`Team ${teamName} not found`);
//             return res.status(404).json({
//                 message: 'Ошибка отправки данных.',
//             });
//         }

//         team.currentCoords = coords;
//         await team.save();
//     } catch (e) {
//         res.status(500).json({
//             message: 'Ошибка отправки данных.',
//         });
//     }
// }

const updatePosition = async (data) => {
    try {
        const { teamName, coords } = data;

        const team = await Team.findOne({ teamName: teamName });

        if (!team) {
            console.log(`Team ${teamName} not found`);
            return;
        }

        team.currentCoords = coords;
        await team.save();
    } catch (e) {
        console.log(`err: `, e);
    }
}