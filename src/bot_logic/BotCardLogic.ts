import { Ctx } from "boardgame.io";
import { CreateCard, isCardNotActionAndNotNull } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { IAverageSuitCardData } from "../typescript_interfaces/bot_interfaces";
import { ICard } from "../typescript_interfaces/card_interfaces";
import { IMyGameState } from "../typescript_interfaces/game_data_interfaces";
import { IPublicPlayer } from "../typescript_interfaces/player_interfaces";
import { ISuit } from "../typescript_interfaces/suit_interfaces";
import { TavernCardTypes } from "../typescript_types/card_types";

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
    if (isCardNotActionAndNotNull(card1) && isCardNotActionAndNotNull(card2)) {
        if (card1.suit === card2.suit) {
            const result: number = (card1.points !== undefined && card1.points !== null ?
                card1.points : 1) - (card2.points !== undefined && card2.points !== null ? card2.points : 1);
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
    const avgCard: ICard = CreateCard({
        suit: suitConfig.suit,
        rank: 0,
        points: 0
    }),
        rank: number | number[] = suitConfig.ranksValues()[data.players][data.tier],
        points: number | number[] = suitConfig.pointsValues()[data.players][data.tier];
    const count = Array.isArray(points) ? points.length : points;
    if (avgCard.points !== null) {
        for (let i = 0; i < count; i++) {
            avgCard.rank += Array.isArray(rank) ? rank[i] : 1;
            avgCard.points += Array.isArray(points) ? points[i] : 1;
        }
        avgCard.rank /= count;
        avgCard.points /= count;
    }
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
    let score = 0;
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            if (isCardNotActionAndNotNull(card) && card.suit === suit) {
                score += suitsConfig[suit].scoringRule(player.cards[suit], card.points ?? 1);
            } else {
                score += suitsConfig[suit].scoringRule(player.cards[suit]);
            }
        }
    }
    if (card !== null && `value` in card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i]?.value ?? 0;
        score += player.handCoins[i]?.value ?? 0;
    }
    return score;
};
