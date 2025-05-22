import Team from "../schemas/Team.js";

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