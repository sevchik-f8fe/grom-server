import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import Team from "../schemas/Team.js";
import Admin from "../schemas/Admin.js";

const reg = /[<>;'"]/;

export const signUp = async (req, res) => {
    try {
        const { coords, captain, subordinates } = req.body;

        for (const key in captain) {
            if (captain.hasOwnProperty(key)) {
                if (!captain[key] || captain[key].length > 50 || reg.test(captain[key])) {
                    return res.status(400).json({
                        message: 'Ошибка регистрации. Проверьте введенные данные.',
                    });
                };
            }
        }

        for (let i = 0; i < subordinates.length; i++) {
            const member = subordinates[i];
            for (const key in member) {
                if (member.hasOwnProperty(key)) {
                    if (!member[key] || member[key].length > 50 || reg.test(member[key])) {
                        return res.status(400).json({
                            message: 'Ошибка регистрации. Проверьте введенные данные.',
                        });
                    };
                }
            }
        }

        const existingTeam = await Team.findOne({ teamName: captain.teamname });

        if (existingTeam) {
            return res.status(400).json({
                message: 'Команда с таким названием уже существует.',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(captain.password, salt);

        const newTeamData = {
            teamName: captain.teamname,
            currentCoords: coords,
            online: true,
            captain: {
                email: captain.email,
                phone: captain.phone,
                username: captain.username,
                fullName: captain.fullname,
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
        console.log(err);
        res.status(500).json({
            message: 'Ошибка регистрации. Проверьте введенные данные.',
        });
    }
}

export const signIn = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || phone.length > 50 || reg.test(phone) || !password || password.length > 50 || reg.test(password)) {
            return res.status(400).json({
                message: 'Ошибка авторизации. Проверьте введенные данные.',
            });
        };

        const admin = await Admin.findOne({ phone });

        if (admin) {
            const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

            if (!isValidPassword) {
                return res.status(400).json({
                    message: 'Ошибка авторизации. Проверьте введенные данные.',
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
                message: 'Ошибка авторизации. Проверьте введенные данные.',
            });
        }

        const isValidPassword = await bcrypt.compare(password, team.captain.passwordHash);

        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Ошибка авторизации. Проверьте введенные данные.',
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
            team: team ? team : admin,
            isAdmin: false,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка авторизации. Проверьте введенные данные.',
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
            res.status(500).json({
                message: 'Ошибка авторизации. Проверьте введенные данные.',
            });
        }
    } else {
        res.status(500).json({
            message: 'Ошибка авторизации. Проверьте введенные данные.',
        });
    }
}