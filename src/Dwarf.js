import { suitsConfig } from "./data/SuitData";
import { AssertAllNumberValuesArraysLengthType } from "./is_helpers/AssertionTypeHelpers";
import { CardTypeRusNames } from "./typescript/enums";
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
        let count;
        if (Array.isArray(points)) {
            count = points.length;
        }
        else {
            count = points;
        }
        for (let j = 0; j < count; j++) {
            let currentPoints;
            if (Array.isArray(points)) {
                AssertAllNumberValuesArraysLengthType(j);
                currentPoints = points[j];
                if (currentPoints === undefined) {
                    throw new Error(`Отсутствует значение очков карты с id '${j}'.`);
                }
            }
            cards.push(CreateDwarfCard({
                name: `(фракция: ${suitsConfig[suit].suitName}, шевронов: 1, очков: ${Array.isArray(points) ? `${currentPoints})` : `нет)`}`,
                playerSuit: suitsConfig[suit].suit,
                points: currentPoints,
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
export const CreateDwarfCard = ({ name, playerSuit, points = null, rank = 1, type = CardTypeRusNames.DwarfCard, }) => ({
    name,
    playerSuit,
    points,
    rank,
    type,
});
/**
 * <h3>Создание карты дворфа на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты дворфа на поле игрока.</li>
 * </ol>
 *
 * @param name Название.
 * @param points Очки.
 * @param rank Шевроны.
 * @param suit Название фракции дворфов.
 * @param type Тип.
 * @returns Карта дворфа на поле игрока.
 */
export const CreateDwarfPlayerCard = ({ name, points = null, rank = 1, suit, type = CardTypeRusNames.DwarfPlayerCard, }) => ({
    name,
    points,
    rank,
    suit,
    type,
});
//# sourceMappingURL=Dwarf.js.map