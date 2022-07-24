import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { CreateDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { ErrorNames, RusCardTypeNames } from "../typescript/enums";
import type { CanBeUndefType, DeckCardTypes, IDwarfCard, IMyGameState, IPlayer, IPlayersNumberTierCardData, IPublicPlayer, ISuit, PointsType, PointsValuesType, PublicPlayerCoinType, SuitNamesKeyofTypeofType, TavernCardType } from "../typescript/interfaces";

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
export const CompareCards = (card1: TavernCardType, card2: TavernCardType): number => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (card1.type === RusCardTypeNames.Dwarf_Card && card2.type === RusCardTypeNames.Dwarf_Card) {
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
export const EvaluateCard = (G: IMyGameState, ctx: Ctx, compareCard: TavernCardType, cardId: number,
    tavern: TavernCardType[]): number => {
    if (compareCard !== null && compareCard.type === RusCardTypeNames.Dwarf_Card) {
        const deckTier1: CanBeUndefType<DeckCardTypes[]> = G.secret.decks[0];
        if (deckTier1 === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 0);
        }
        if (deckTier1.length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    const deckTier2: CanBeUndefType<DeckCardTypes[]> = G.secret.decks[1];
    if (deckTier2 === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
    }
    if (deckTier2.length < G.botData.deckLength) {
        const temp: number[][] = tavern.map((card: TavernCardType): number[] =>
            Object.values(G.publicPlayers).map((player: IPublicPlayer, index: number): number =>
                PotentialScoring(G, ctx, index, card))),
            tavernCardResults: CanBeUndefType<number[]> = temp[cardId];
        if (tavernCardResults === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат выбранной карты таверны для текущего игрока.`);
        }
        const result: CanBeUndefType<number> = tavernCardResults[Number(ctx.currentPlayer)];
        if (result === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат для текущего игрока с id '${ctx.currentPlayer}'.`);
        }
        temp.splice(cardId, 1);
        temp.forEach((player: number[]): number[] =>
            player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player: number[]): number =>
            Math.max(...player)));
    }
    if (compareCard !== null && compareCard.type === RusCardTypeNames.Dwarf_Card) {
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
export const GetAverageSuitCard = (suitConfig: ISuit, data: IPlayersNumberTierCardData): IDwarfCard => {
    let totalPoints = 0;
    const pointsValuesPlayers: CanBeUndefType<PointsValuesType> = suitConfig.pointsValues()[data.players];
    if (pointsValuesPlayers === undefined) {
        throw new Error(`Отсутствует массив значений карт для указанного числа игроков - '${data.players}'.`);
    }
    const points: CanBeUndefType<PointsType> = pointsValuesPlayers[data.tier];
    if (points === undefined) {
        throw new Error(`Отсутствует массив значений карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
    }
    const count: number = Array.isArray(points) ? points.length : points;
    for (let i = 0; i < count; i++) {
        if (Array.isArray(points)) {
            const pointsValue: CanBeUndefType<number> = points[i];
            if (pointsValue === undefined) {
                throw new Error(`Отсутствует значение с id '${i}' в массиве карт для числа игроков - '${data.players}' в указанной эпохе - '${data.tier}'.`);
            }
            totalPoints += pointsValue;
        } else {
            totalPoints += 1;
        }
    }
    totalPoints /= count;
    return CreateDwarfCard({
        suit: suitConfig.suit,
        points: totalPoints,
        name: `Average card`,
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
 * @param ctx
 * @param player Игрок.
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialScoring = (G: IMyGameState, ctx: Ctx, playerId: number, card: TavernCardType): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            playerId);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let score = 0,
        suit: SuitNamesKeyofTypeofType;
    for (suit in suitsConfig) {
        if (card !== null && card.type === RusCardTypeNames.Dwarf_Card && card.suit === suit) {
            score +=
                suitsConfig[suit].scoringRule(player.cards[suit], suit, card.points ?? 1);
        } else {
            score += suitsConfig[suit].scoringRule(player.cards[suit], suit);
        }
    }
    if (card !== null && card.type === RusCardTypeNames.Royal_Offering_Card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[i];
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
        const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[i];
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
