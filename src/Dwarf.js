import { suitsConfig } from "./data/SuitData";
import { RusCardTypeNames } from "./typescript/enums";
/**
 * <h3>Создаёт все карты дворфов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @param data Данные для создания карт.
 * @returns Все карты дворфов.
 */
export const BuildDwarfCards = (data) => {
    const cards = [];
    let suit;
    for (suit in suitsConfig) {
        const pointValuesPlayers = suitsConfig[suit].pointsValues()[data.players];
        if (pointValuesPlayers === undefined) {
            throw new Error(`Отсутствует массив значений очков карт для указанного числа игроков - '${data.players}'.`);
        }
        const points = pointValuesPlayers[data.tier];
        if (points === undefined) {
            throw new Error(`Отсутствует массив значений очков карт для указанного числа игроков - '${data.players}' для указанной эпохи - '${data.tier}'.`);
        }
        let count = 0;
        if (Array.isArray(points)) {
            count = points.length;
        }
        else {
            count = points;
        }
        for (let j = 0; j < count; j++) {
            let currentPoints;
            if (Array.isArray(points)) {
                const cardPoints = points[j];
                if (cardPoints === undefined) {
                    throw new Error(`Отсутствует значение очков карты с id '${j}'.`);
                }
                currentPoints = cardPoints;
            }
            else {
                currentPoints = null;
            }
            cards.push(CreateDwarfCard({
                suit: suitsConfig[suit].suit,
                points: currentPoints,
                name: `(фракция: ${suitsConfig[suitsConfig[suit].suit].suitName}, шевронов: 1, очков: ${Array.isArray(points) ? points[j] + `)` : `нет)`}`,
            }));
        }
    }
    return cards;
};
/**
 * <h3>Создание карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @returns Карта дворфа.
 */
export const CreateDwarfCard = ({ type = RusCardTypeNames.Dwarf_Card, suit, rank = 1, points, name, } = {}) => ({
    type,
    suit,
    rank,
    points,
    name,
});
//# sourceMappingURL=Dwarf.js.map