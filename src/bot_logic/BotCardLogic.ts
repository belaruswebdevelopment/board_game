import { suitsConfig } from "../data/SuitData";
import { StartSuitScoring } from "../dispatchers/SuitScoringDispatcher";
import { CreateDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CardTypeRusNames, ErrorNames, GameModeNames, SuitNames } from "../typescript/enums";
import type { CanBeUndefType, DwarfCard, FnContext, IPlayer, IPlayersNumberTierCardData, IPublicPlayer, MyFnContextWithMyPlayerID, PointsType, PointsValuesType, PublicPlayerCoinType, TavernAllCardType, TavernCardType } from "../typescript/interfaces";

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
export const CompareTavernCards = (card1: TavernCardType, card2: TavernCardType): number => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    // TODO If Mythological Creatures cards!?
    if (card1.type === CardTypeRusNames.Dwarf_Card && card2.type === CardTypeRusNames.Dwarf_Card) {
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
 * @param context
 * @param compareCard Карта для сравнения.
 * @param cardId Id карты.
 * @param tavern Таверна.
 * @returns Сравнительное значение.
 */
export const EvaluateTavernCard = ({ G, ctx, ...rest }: FnContext, compareCard: TavernCardType, cardId: number,
    tavern: TavernAllCardType): number => {
    if (compareCard !== null && compareCard.type === CardTypeRusNames.Dwarf_Card) {
        if (G.secret.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareTavernCards(compareCard, G.averageCards[compareCard.suit]);
        }
    }
    // TODO If Mythological Creatures cards!?
    if (G.secret.decks[1].length < G.botData.deckLength) {
        const temp: number[][] = tavern.map((card: TavernCardType): number[] =>
            Object.values(G.publicPlayers).map((player: IPublicPlayer, index: number): number =>
                PotentialTavernCardScoring({ G, ctx, myPlayerID: String(index), ...rest }, card))),
            tavernCardResults: CanBeUndefType<number[]> = temp[cardId];
        if (tavernCardResults === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат выбранной карты таверны для текущего игрока.`);
        }
        const result: CanBeUndefType<number> = tavernCardResults[Number(ctx.currentPlayer)];
        if (result === undefined) {
            throw new Error(`В массиве потенциального количества очков карт отсутствует нужный результат для текущего игрока с id '${ctx.currentPlayer}'.`);
        }
        const amount = 1,
            removedFromTemp: number[][] = temp.splice(cardId, amount);
        if (amount !== removedFromTemp.length) {
            throw new Error(`Недостаточно карт в массиве temp: требуется - '${amount}', в наличии - '${removedFromTemp.length}'.`);
        }
        temp.forEach((player: number[]): number[] => {
            const removedFromPlayer: number[] =
                player.splice(Number(ctx.currentPlayer), amount);
            if (amount !== removedFromPlayer.length) {
                throw new Error(`Недостаточно карт в массиве player: требуется - '${amount}', в наличии - '${removedFromPlayer.length}'.`);
            }
            return removedFromPlayer;
        });
        if (amount !== removedFromTemp.length) {
            throw new Error(`Недостаточно карт в массиве temp: требуется - '${amount}', в наличии - '${removedFromTemp.length}'.`);
        }
        return result - Math.max(...temp.map((player: number[]): number =>
            Math.max(...player)));
    }
    if (compareCard !== null && compareCard.type === CardTypeRusNames.Dwarf_Card) {
        return CompareTavernCards(compareCard, G.averageCards[compareCard.suit]);
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
 * @param suit Фракция дворфов.
 * @param data ????????????????????????????????????????????????????????????????????
 * @returns "Средняя" карта дворфа.
 */
export const GetAverageSuitCard = (suit: SuitNames, data: IPlayersNumberTierCardData): DwarfCard => {
    let totalPoints = 0;
    const pointsValuesPlayers: PointsValuesType = suitsConfig[suit].pointsValues()[data.players],
        points: PointsType = pointsValuesPlayers[data.tier],
        count: number = Array.isArray(points) ? points.length : points;
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
    // TODO Rework it to non-dwarf card?
    return CreateDwarfCard({
        suit: suitsConfig[suit].suit,
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
 * @param context
 * @param card Карта.
 * @returns Потенциальное значение.
 */
const PotentialTavernCardScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, card: TavernCardType):
    number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let handCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let score = 0,
        suit: SuitNames;
    for (suit in suitsConfig) {
        if (card !== null && card.type === CardTypeRusNames.Dwarf_Card && card.suit === suit) {
            score +=
                StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit], card.points ?? 1]);
        } else {
            score += StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit]]);
        }
    }
    if (card !== null && card.type === CardTypeRusNames.Royal_Offering_Card) {
        score += card.value;
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе отсутствует монета с id '${i}'.`);
        }
        // TODO Check it it can be error in !multiplayer, but bot can't play in multiplayer now...
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            score += boardCoin.value;
        }
        const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(handCoin)) {
            score += handCoin.value;
        }
    }
    return score;
};
