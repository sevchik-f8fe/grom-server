import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import Team from "../schemas/Team.js";
import Admin from "../schemas/Admin.js";
import Quest from "../schemas/Quest.js";
import Point from "../schemas/Point.js";

export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({});

        if (!teams) {
            return res.status(500).json({
                message: 'Ошибка получения данных.',
            });
        }

        res.status(201).json({
            teams,
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Ошибка получения данных.',
        });
    }
}

export const getPoints = async (req, res) => {
    try {
        const points = await Point.find({});

        if (!points) {
            return res.status(500).json({
                message: 'Ошибка получения данных.',
            });
        }

        res.status(201).json({
            points,
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Ошибка получения данных.',
        });
    }
}

export const checkAdminAuthMiddleware = async (req, res, next) => {
    const { phone } = req.body;
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            jwt.verify(token, process.env.JWT);

            const admin = await Admin.findOne({ phone });

            if (!admin) {
                console.log('er aa: no admin')
                res.status(404).json({
                    message: 'Ошибка авторизации. Проверьте введенные данные.',
                });
            }

            next();
        } catch (err) {
            console.log('er aa: ', err)
            res.status(404).json({
                message: 'Ошибка авторизации. Проверьте введенные данные.',
            });
        }
    } else {
        console.log('er aa: no token')
        res.status(404).json({
            message: 'Ошибка авторизации. Проверьте введенные данные.',
        });
    }
}
