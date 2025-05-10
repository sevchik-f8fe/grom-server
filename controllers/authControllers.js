import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import Team from "../schemas/Team.js";
import Admin from "../schemas/Admin.js";

export const signUp = async (req, res) => {
    try {
        const { teamName, captain, subordinates } = req.body;

        const existingTeam = await Team.findOne({ teamName });

        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Команда с таким названием уже существует.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(captain.password, salt);

        const newTeamData = {
            teamName,
            captain: {
                email: captain.email,
                phone: captain.phone,
                username: captain.username,
                fullName: captain.fullName,
                passwordHash,
            },
            subordinates,
        };

        const team = new Team(newTeamData);
        await team.save();

        const token = jwt.sign(
            {
                _id: team._id,
            },
            process.env.JWT,
            {
                expiresIn: '1d',
            },
        );

        res.status(201).json({
            team,
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось зарегистрировать команду.',
        });
    }
}

export const signIn = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const admin = await Admin.findOne({ phone });

        if (admin) {
            const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

            if (!isValidPassword) {
                return res.status(400).json({
                    message: 'Ошибка авторизации',
                });
            }

            const token = jwt.sign(
                {
                    _id: admin._id,
                    isAdmin: true,
                },
                process.env.JWT,
                {
                    expiresIn: '1d',
                },
            );

            return res.status(201).json({
                token,
                isAdmin: true,
            });
        }

        const team = await Team.findOne({ 'captain.phone': phone });

        if (!team) {
            return res.status(404).json({
                message: 'Ошибка авторизации',
            });
        }

        const isValidPassword = await bcrypt.compare(password, team.captain.passwordHash);

        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Ошибка авторизации',
            });
        }

        const token = jwt.sign(
            {
                _id: team._id,
                isCaptain: true,
            },
            process.env.JWT,
            {
                expiresIn: '1d',
            },
        );

        res.status(200).json({
            token,
            isAdmin: false,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка авторизации',
        });
    }
}

export const checkAuthMiddleware = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT);
            req.body.isAdmin = decodedToken.isAdmin;

            next();
        } catch (err) {
            res.status(500).json({ message: 'Ошибка' });
        }
    } else {
        res.status(500).json({ message: 'Ошибка' });
    }
}