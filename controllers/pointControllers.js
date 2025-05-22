import Team from "../schemas/Team.js";
import Point from "../schemas/Point.js";
import Quest from "../schemas/Quest.js";

export const getTime = async (req, res) => {
    try {
        const quest = await Quest.find({});

        if (!quest) {
            return res.status(500).json({
                message: 'Ошибка получения данных.',
            });
        }

        res.status(201).json({
            startAt: quest[0].startAt,
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Ошибка получения данных.',
        });
    }
}