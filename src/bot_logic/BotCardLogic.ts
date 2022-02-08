import { Ctx } from "boardgame.io";
import { CreateCard, isCardNotAction } from "../Card";
import { suitsConfig } from "../data/SuitData";
import { IAverageSuitCardData, ICreateAverageSuitCard } from "../typescript/bot_interfaces";
import { ICard } from "../typescript/card_interfaces";
import { PlayerCardsType, TavernCardTypes } from "../typescript/card_types";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPlayerCards } from "../typescript/interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { ISuit } from "../typescript/suit_interfaces";

// Check all types in this file!
/**
 * <h3>Добавляет карту в массив потенциальных карт для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подсчёте потенциального количества очков для ботов.</li>
 * </ol>
 *
 * @param cards Массив потенциальных карт для ботов.
 * @param card Карта.
 */
const AddCardToCards = (cards: IPlayerCards, card: PlayerCardsType): void => {
    if (card.suit !== null) {
        cards[card.suit].push(card);
    }
    // TODO Else it can be upgrade coin card here and it is not error, sure? Or add LogTypes.ERROR logging?
};

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
    if (isCardNotAction(card1) && isCardNotAction(card2)) {
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
            G.publicPlayers.map((player: IPublicPlayer): number =>
                PotentialScoring(player, card))),
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
    } as ICreateAverageSuitCard),
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
    const potentialCards: IPlayerCards = {};
    let score = 0;
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            potentialCards[suit] = [];
            for (let j = 0; j < player.cards[suit].length; j++) {
                AddCardToCards(potentialCards, player.cards[suit][j]);
            }
        }
    }
    if (card !== null && `suit` in card) {
        AddCardToCards(potentialCards, CreateCard(card));
    }
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            score += suitsConfig[suit].scoringRule(potentialCards[suit]);
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
