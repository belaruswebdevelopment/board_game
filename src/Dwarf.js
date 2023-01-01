import { suitsConfig } from "./data/SuitData";
import { CardTypeRusNames, SuitNames } from "./typescript/enums";
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
        const pointValuesPlayers = suitsConfig[suit].pointsValues()[data.players], points = pointValuesPlayers[data.tier];
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
            cards.push(CreateDwarfCard({
                suit: suitsConfig[suit].suit,
                points: currentPoints,
                name: `(фракция: ${suitsConfig[suit].suitName}, шевронов: 1, очков: ${Array.isArray(points) ? `${points[j]})` : `нет)`}`,
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
 * @param name Название.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта дворфа.
 */
export const CreateDwarfCard = ({ type = CardTypeRusNames.Dwarf_Card, name, suit, rank = 1, points = null, }) => ({
    type,
    name,
    suit,
    rank,
    points,
});
//# sourceMappingURL=Dwarf.js.map