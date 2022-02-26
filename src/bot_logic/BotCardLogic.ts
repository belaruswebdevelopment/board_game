import { Ctx } from "boardgame.io";
import { CreateCard, IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { GameNames } from "../typescript/enums";
import { IAverageSuitCardData, ICard, IMyGameState, IPublicPlayer, ISuit, SuitTypes, TavernCardTypes } from "../typescript/interfaces";

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
    if (compareCard !== null && `suit` in compareCard) {
        if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        const temp: number[][] = tavern.map((card: TavernCardTypes): number[] =>
            G.publicPlayers.map((player: IPublicPlayer): number => PotentialScoring(player, card))),
            result = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach((player: number[]): number[] =>
            player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player: number[]): number =>
            Math.max(...player)));
    }
    if (compareCard !== null && `suit` in compareCard) {
        return CompareCards(compareCard, G.averageCards[compareCard.suit]);
    }
    // TODO FIX IT, UNREACHABLE!? 0 === DEFAULT?!
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
    let totalRank = 0,
        totalPoints = 0;
    const rank: number | number[] = suitConfig.ranksValues()[data.players][data.tier],
        points: number | number[] = suitConfig.pointsValues()[data.players][data.tier],
        count = Array.isArray(points) ? points.length : points;
    for (let i = 0; i < count; i++) {
        totalRank += Array.isArray(rank) ? rank[i] : 1;
        totalPoints += Array.isArray(points) ? points[i] : 1;
    }
    totalRank /= count;
    totalPoints /= count;
    const avgCard: ICard = CreateCard({
        suit: suitConfig.suit,
        rank: totalRank,
        points: totalPoints,
        name: `Average card`,
        game: GameNames.Basic,
    });
    return avgCard;
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
