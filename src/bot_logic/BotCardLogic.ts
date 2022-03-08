import type { Ctx } from "boardgame.io";
import { CreateCard, IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { GameNames } from "../typescript/enums";
import type { DeckCardTypes, IAverageSuitCardData, ICard, IMyGameState, INumberArrayValues, INumberValues, IPublicPlayer, ISuit, SuitTypes, TavernCardTypes } from "../typescript/interfaces";

// Check all types in this file!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param card1 Первая карта.
 * @param card2 Вторая карта.
 * @returns Сравнительное значение.
 */
export const CompareCards = (card1: TavernCardTypes, card2: TavernCardTypes): number => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (IsCardNotActionAndNotNull(card1) && IsCardNotActionAndNotNull(card2)) {
        if (card1.suit === card2.suit) {
            const result: number = (card1.points ?? 1) - (card2.points ?? 1);
            if (result === 0) {
                return result;
            }
            return result > 0 ? 1 : -1;
        }
    }
    return 0;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param compareCard Карта для сравнения.
 * @param cardId Id карты.
 * @param tavern Таверна.
 * @returns Сравнительное значение.
 */
export const EvaluateCard = (G: IMyGameState, ctx: Ctx, compareCard: TavernCardTypes, cardId: number,
    tavern: TavernCardTypes[]): number => {
    if (IsCardNotActionAndNotNull(compareCard)) {
        const deckTier1: DeckCardTypes[] | undefined = G.decks[0];
        if (deckTier1 !== undefined) {
            if (deckTier1.length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
                return CompareCards(compareCard, G.averageCards[compareCard.suit]);
            }
        } else {
            throw new Error(`В массиве колод карт отсутствует колода 1 эпохи.`);
        }
    }
    const deckTier2: DeckCardTypes[] | undefined = G.decks[1];
    if (deckTier2 !== undefined) {
        if (deckTier2.length < G.botData.deckLength) {
            const temp: number[][] = tavern.map((card: TavernCardTypes): number[] =>
                G.publicPlayers.map((player: IPublicPlayer): number => PotentialScoring(player, card)));
            const tavernCardResults: number[] | undefined = temp[cardId];
            if (tavernCardResults !== undefined) {
                const result: number | undefined = tavernCardResults[Number(ctx.currentPlayer)];
                if (result !== undefined) {
                    temp.splice(cardId, 1);
                    temp.forEach((player: number[]): number[] =>
                        player.splice(Number(ctx.currentPlayer), 1));
                    return result - Math.max(...temp.map((player: number[]): number =>
                        Math.max(...player)));
                } else {
                    throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат для текущего игрока.`);
                }
            } else {
                throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат выбранной карты таверны для текущего игрока.`);
            }
        }
    } else {
        throw new Error(`В массиве колод карт отсутствует колода 2 эпохи.`);
    }
    if (IsCardNotActionAndNotNull(compareCard)) {
        return CompareCards(compareCard, G.averageCards[compareCard.suit]);
    }
    return 0;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param suitConfig Конфиг карт дворфов.
 * @param data ????????????????????????????????????????????????????????????????????
 * @returns "Средняя" карта дворфа.
 */
export const GetAverageSuitCard = (suitConfig: ISuit, data: IAverageSuitCardData): ICard => {
    let totalPoints = 0;
    const pointsValuesPlayers: INumberValues | INumberArrayValues | undefined = suitConfig.pointsValues()[data.players];
    if (pointsValuesPlayers !== undefined) {
        const points: number | number[] | undefined = pointsValuesPlayers[data.tier];
        if (points !== undefined) {
            const count: number = Array.isArray(points) ? points.length : points;
            for (let i = 0; i < count; i++) {
                if (Array.isArray(points)) {
                    const pointsValue: number | undefined = points[i];
                    if (pointsValue !== undefined) {
                        totalPoints += pointsValue;
                    } else {
                        throw new Error(`Отсутствует значение ${i} в массиве карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
                    }
                } else {
                    totalPoints += 1;
                }
            }
            totalPoints /= count;
            return CreateCard({
                suit: suitConfig.suit,
                rank: 1,
                points: totalPoints,
                name: `Average card`,
                game: GameNames.Basic,
            });
        } else {
            throw new Error(`Отсутствует массив значений карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
        }
    } else {
        throw new Error(`Отсутствует массив значений карт для указанного числа игроков - '${data.players}'.`);
    }
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialScoring = (player: IPublicPlayer, card: TavernCardTypes): number => {
    let score = 0,
        suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (IsCardNotActionAndNotNull(card) && card.suit === suit) {
                score += suitsConfig[suit].scoringRule(player.cards[suit], card.points ?? 1);
            } else {
                score += suitsConfig[suit].scoringRule(player.cards[suit]);
            }
        }
    }
    if (IsActionCard(card)) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i]?.value ?? 0;
        score += player.handCoins[i]?.value ?? 0;
    }
    return score;
};
