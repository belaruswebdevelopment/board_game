import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { LogTypes, RusCardTypes } from "../typescript/enums";
import type { CoinType, IMyGameState, IPublicPlayer, IStack, PlayerCardsType, SuitTypes } from "../typescript/interfaces";
import { StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "./AutoActions";

/**
 * <h3>Действия, связанные с добавлением монет в кошелёк для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchAction = (G: IMyGameState, ctx: Ctx, coinId: number): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const tempId: number = player.boardCoins.findIndex((coin: CoinType, index: number): boolean =>
        index >= G.tavernsNum && !IsCoin(coin));
    if (tempId === -1) {
        throw new Error(`В массиве монет игрока на столе отсутствует монета для добавления в кошель для обмена для действия артефакта 'VidofnirVedrfolnir'.`);
    }
    const coin: CoinType | undefined = player.handCoins[coinId];
    if (coin === undefined) {
        throw new Error(`В массиве монет игрока в руке отсутствует выбранная монета: это должно проверяться в MoveValidator.`);
    }
    player.boardCoins[tempId] = coin;
    player.handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошелёк.`);
    StartVidofnirVedrfolnirAction(G, ctx);
};

/**
 * <h3>Действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для сбросом по действию карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes, playerId: number, cardId: number):
    void => {
    // TODO Rework it for players and fix it for bots?
    // TODO ctx.playerID === playerId???
    if (ctx.playerID === undefined) {
        // TODO Need it!?
        throw new Error(`Отсутствует обязательный параметр 'ctx.playerID'.`);
    }
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(playerId)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const discardedCard: PlayerCardsType | undefined = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    }
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    }
    G.discardCardsDeck.push(discardedCard);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил карту '${discardedCard.name}' в колоду сброса.`);
    player.stack = [];
};

/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли монета базовой.
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G: IMyGameState, ctx: Ctx, coinId: number, type: string,
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
