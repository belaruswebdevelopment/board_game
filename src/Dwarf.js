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
                playerSuit: suitsConfig[suit].suit,
                points: currentPoints,
                name: `(фракция: ${suitsConfig[suit].suitName}, шевронов: 1, очков: ${Array.isArray(points) ? `${points[j]})` : `нет)`}`,
            }));
        }
    }
    return cards;
};
/**
 * <h3>Создание карты дворфа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт дворфов при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта дворфа.
 */
export const CreateDwarfCard = ({ type = CardTypeRusNames.DwarfCard, name, playerSuit, points = null, rank = 1, }) => ({
    type,
    name,
    playerSuit,
    points,
    rank,
});
/**
 * <h3>Создание карты дворфа на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты дворфа на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param suit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта дворфа на поле игрока.
 */
export const CreateDwarfPlayerCard = ({ type = CardTypeRusNames.DwarfPlayerCard, name, suit, points = null, rank = 1, }) => ({
    type,
    name,
    suit,
    points,
    rank,
});
//# sourceMappingURL=Dwarf.js.map