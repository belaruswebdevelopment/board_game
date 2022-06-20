import { suitsConfig } from "./data/SuitData";
import { GameNames, RusCardTypes } from "./typescript/enums";
import type { CanBeUndef, CreateDwarfCardType, IDwarfCard, INumberArrayValues, INumberValues, IPlayersNumberTierCardData, SuitTypes } from "./typescript/interfaces";

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
export const BuildDwarfCards = (data: IPlayersNumberTierCardData): IDwarfCard[] => {
    const cards: IDwarfCard[] = [];
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        const pointValuesPlayers: CanBeUndef<INumberValues | INumberArrayValues> =
            suitsConfig[suit].pointsValues()[data.players];
        if (pointValuesPlayers === undefined) {
            throw new Error(`Отсутствует массив значений очков карт для указанного числа игроков - '${data.players}'.`);
        }
        const points: CanBeUndef<number | number[]> = pointValuesPlayers[data.tier];
        if (points === undefined) {
            throw new Error(`Отсутствует массив значений очков карт для указанного числа игроков - '${data.players}' для указанной эпохи - '${data.tier}'.`);
        }
        let count = 0;
        if (Array.isArray(points)) {
            count = points.length;
        } else {
            count = points;
        }
        for (let j = 0; j < count; j++) {
            let currentPoints: number | null;
            if (Array.isArray(points)) {
                const cardPoints: CanBeUndef<number> = points[j];
                if (cardPoints === undefined) {
                    throw new Error(`Отсутствует значение очков карты с id '${j}'.`);
                }
                currentPoints = cardPoints;
            } else {
                currentPoints = null;
            }
            cards.push(CreateDwarfCard({
                suit: suitsConfig[suit].suit,
                points: currentPoints,
                name: `(фракция: ${suitsConfig[suitsConfig[suit].suit].suitName}, шевронов: 1, очков: ${Array.isArray(points) ? points[j] + `)` : `нет)`}`,
                game: GameNames.Basic,
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
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @returns Карта дворфа.
 */
export const CreateDwarfCard = ({
    type = RusCardTypes.Dwarf,
    suit,
    rank = 1,
    points,
    name,
    game,
    tier = 0,
}: CreateDwarfCardType = {} as CreateDwarfCardType): IDwarfCard => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
    tier,
});

/**
 * <h3>Проверка, является ли объект картой дворфа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой дворфа.
 */
export const IsDwarfCard = (card: unknown): card is IDwarfCard =>
    card !== null && (card as IDwarfCard).suit !== undefined && (card as IDwarfCard).tier !== undefined
    && !(`description` in (card as IDwarfCard));
