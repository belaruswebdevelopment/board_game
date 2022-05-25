import type { Ctx } from "boardgame.io";
import { CreateCard, IsActionCard, IsCardNotActionAndNotNull } from "../Card";
import { IsCoin } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { GameNames } from "../typescript/enums";
import type { CanBeUndef, DeckCardTypes, IAverageSuitCardData, ICard, IMyGameState, INumberArrayValues, INumberValues, IPlayer, IPublicPlayer, ISuit, PublicPlayerCoinTypes, SuitTypes, TavernCardTypes } from "../typescript/interfaces";

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
        const deckTier1: CanBeUndef<DeckCardTypes[]> = G.secret.decks[0];
        if (deckTier1 === undefined) {
            throw new Error(`В массиве колод карт отсутствует колода '1' эпохи.`);
        }
        if (deckTier1.length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    const deckTier2: CanBeUndef<DeckCardTypes[]> = G.secret.decks[1];
    if (deckTier2 === undefined) {
        throw new Error(`В массиве колод карт отсутствует колода '2' эпохи.`);
    }
    if (deckTier2.length < G.botData.deckLength) {
        const temp: number[][] = tavern.map((card: TavernCardTypes): number[] =>
            Object.values(G.publicPlayers).map((player: IPublicPlayer, index: number): number =>
                PotentialScoring(G, index, card))),
            tavernCardResults: CanBeUndef<number[]> = temp[cardId];
        if (tavernCardResults === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат выбранной карты таверны для текущего игрока.`);
        }
        const result: CanBeUndef<number> = tavernCardResults[Number(ctx.currentPlayer)];
        if (result === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат для текущего игрока с id '${ctx.currentPlayer}'.`);
        }
        temp.splice(cardId, 1);
        temp.forEach((player: number[]): number[] =>
            player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player: number[]): number =>
            Math.max(...player)));
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
    const pointsValuesPlayers: CanBeUndef<INumberValues | INumberArrayValues> = suitConfig.pointsValues()[data.players];
    if (pointsValuesPlayers === undefined) {
        throw new Error(`Отсутствует массив значений карт для указанного числа игроков - '${data.players}'.`);
    }
    const points: CanBeUndef<number | number[]> = pointsValuesPlayers[data.tier];
    if (points === undefined) {
        throw new Error(`Отсутствует массив значений карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
    }
    const count: number = Array.isArray(points) ? points.length : points;
    for (let i = 0; i < count; i++) {
        if (Array.isArray(points)) {
            const pointsValue: CanBeUndef<number> = points[i];
            if (pointsValue === undefined) {
                throw new Error(`Отсутствует значение с id '${i}' в массиве карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
            }
            totalPoints += pointsValue;
        } else {
            totalPoints += 1;
        }
    }
    totalPoints /= count;
    return CreateCard({
        suit: suitConfig.suit,
        points: totalPoints,
        name: `Average card`,
        game: GameNames.Basic,
    });
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
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialScoring = (G: IMyGameState, playerId: number, card: TavernCardTypes): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId],
        privatePlayer: CanBeUndef<IPlayer> = G.players[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок  с id '${playerId}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует игрок с id '${playerId}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let score = 0,
        suit: SuitTypes;
    for (suit in suitsConfig) {
        if (IsCardNotActionAndNotNull(card) && card.suit === suit) {
            score += suitsConfig[suit].scoringRule(player.cards[suit], card.points ?? 1);
        } else {
            score += suitsConfig[suit].scoringRule(player.cards[suit]);
        }
    }
    if (IsActionCard(card)) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin: CanBeUndef<PublicPlayerCoinTypes> = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerId}' на столе отсутствует монета с id '${i}'.`);
        }
        // TODO Check it it can be error in !multiplayer, but bot can't play in multiplayer now...
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerId}' на столе не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            score += boardCoin.value;
        }
        const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerId}' в руке не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            score += handCoin.value;
        }
    }
    return score;
};
