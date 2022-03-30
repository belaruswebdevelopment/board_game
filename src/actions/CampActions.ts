import type { Ctx } from "boardgame.io";
import { IsArtefactCard, IsMercenaryPlayerCard } from "../Camp";
import { StackData } from "../data/StackData";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { AddCampCardToCards } from "../helpers/CampCardHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { CoinTypes, LogTypes, RusCardTypes, SuitNames } from "../typescript/enums";
import type { CampCardTypes, CoinType, ICoin, IMyGameState, IPlayer, IPublicPlayer, IStack, PlayerCardsType, PublicPlayerBoardCoinTypes } from "../typescript/interfaces";
import { StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "./AutoActions";

/**
 * <h3>Действия, связанные с добавлением монет в кошель для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchAction = (G: IMyGameState, ctx: Ctx, coinId: number): void => {
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoins: CoinType[];
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    const tempId: number =
        player.boardCoins.findIndex((coin: PublicPlayerBoardCoinTypes, index: number): boolean =>
            index >= G.tavernsNum && coin === null);
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока на столе отсутствует монета для добавления в кошель для обмена для действия артефакта 'VidofnirVedrfolnir'.`);
    }
    const coin: CoinType | undefined = handCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока в руке отсутствует выбранная монета: это должно проверяться в MoveValidator.`);
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.boardCoins[tempId] = coin;
    }
    player.boardCoins[tempId] = coin;
    handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошель.`);
    StartVidofnirVedrfolnirAction(G, ctx);
};

/**
 * <h3>Действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для сбросом по действию карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    if (ctx.playerID === undefined) {
        throw new Error(`Отсутствует обязательный параметр 'ctx.playerID'.`);
    }
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.playerID)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок ${ctx.playerID}.`);
    }
    const discardedCard: PlayerCardsType | undefined =
        player.cards[SuitNames.WARRIOR].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    }
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    }
    if (IsMercenaryPlayerCard(discardedCard) || IsArtefactCard(discardedCard)) {
        G.discardCampCardsDeck.push(discardedCard);
    } else {
        G.discardCardsDeck.push(discardedCard);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил карту '${discardedCard.name}' в колоду сброса.`);
    player.stack = [];
};

export const PickCampCardAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const campCard: CampCardTypes | undefined = G.camp[cardId];
    if (campCard === undefined) {
        throw new Error(`Отсутствует кликнутая карта лагеря.`);
    }
    if (campCard === null) {
        throw new Error(`Не существует кликнутая карта лагеря.`);
    }
    G.camp.splice(cardId, 1, null);
    AddCampCardToCards(G, ctx, campCard);
    if (IsArtefactCard(campCard)) {
        AddActionsToStackAfterCurrent(G, ctx, campCard.stack, campCard);
        StartAutoAction(G, ctx, campCard.actions);
    }
    if (G.odroerirTheMythicCauldron) {
        const minCoinValue: number = G.marketCoins.reduceRight((prev: ICoin, curr: ICoin): ICoin =>
            prev.value < curr.value ? prev : curr).value;
        const minCoinIndex: number =
            G.marketCoins.findIndex((coin: ICoin): boolean => coin.value === minCoinValue);
        if (minCoinIndex === -1) {
            throw new Error(`Не существует минимальная монета на рынке с значением - ${minCoinValue}.`);
        }
        const coin: ICoin | undefined = G.marketCoins.splice(minCoinIndex, 1)[0];
        if (coin === undefined) {
            throw new Error(`Отсутствует минимальная монета на рынке с индексом - ${minCoinIndex}.`);
        }
        G.odroerirTheMythicCauldronCoins.push(coin);
    }
};

/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли монета базовой.
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G: IMyGameState, ctx: Ctx, coinId: number, type: CoinTypes,
    isInitial: boolean): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack: IStack | undefined = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 0 действие.`);
    }
    const value: number | undefined = stack.config?.value;
    if (value === undefined) {
        throw new Error(`У конфига действия игрока отсутствует обязательный параметр значения улучшаемой монеты 'VidofnirVedrfolnir'.`);
    }
    if (value === 3) {
        AddActionsToStackAfterCurrent(G, ctx,
            [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)]);
    }
    UpgradeCoinAction(G, ctx, value, coinId, type, isInitial);
};
