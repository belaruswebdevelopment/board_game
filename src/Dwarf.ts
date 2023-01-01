import { suitsConfig } from "./data/SuitData";
import { CardTypeRusNames, SuitNames } from "./typescript/enums";
import type { CanBeUndefType, CreateDwarfCardFromData, DwarfCard, IPlayersNumberTierCardData, PointsType, PointsValuesType } from "./typescript/interfaces";

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
export const BuildDwarfCards = (data: IPlayersNumberTierCardData): DwarfCard[] => {
    const cards: DwarfCard[] = [];
    let suit: SuitNames;
    for (suit in suitsConfig) {
        const pointValuesPlayers: PointsValuesType = suitsConfig[suit].pointsValues()[data.players],
            points: PointsType = pointValuesPlayers[data.tier];
        let count = 0;
        if (Array.isArray(points)) {
            count = points.length;
        } else {
            count = points;
        }
        for (let j = 0; j < count; j++) {
            let currentPoints: CanBeUndefType<number>;
            if (Array.isArray(points)) {
                const cardPoints: CanBeUndefType<number> = points[j];
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
export const CreateDwarfCard = ({
    type = CardTypeRusNames.Dwarf_Card,
    name,
    suit,
    rank = 1,
    points = null,
}: CreateDwarfCardFromData): DwarfCard => ({
    type,
    name,
    suit,
    rank,
    points,
});
