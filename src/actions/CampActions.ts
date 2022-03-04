import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { LogTypes, RusCardTypes } from "../typescript/enums";
import type { CoinType, IConfig, IMyGameState, IPublicPlayer, PlayerCardsType, SuitTypes } from "../typescript/interfaces";
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
export const AddCoinToPouchAction = (G: IMyGameState, ctx: Ctx, coinId: number): void | never => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        tempId: number = player.boardCoins.findIndex((coin: CoinType, index: number): boolean =>
            index >= G.tavernsNum && !IsCoin(coin));
    if (tempId !== -1) {
        player.boardCoins[tempId] = player.handCoins[coinId];
        player.handCoins[coinId] = null;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошелёк.`);
        StartVidofnirVedrfolnirAction(G, ctx);
    } else {
        throw new Error(`У игрока в 'boardCoins' отсутствует монета для добавления в кошель для обмена для действия артефакта 'VidofnirVedrfolnir'.`);
    }
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
    void | never => {
    // TODO Rework it for players and fix it for bots?
    // TODO ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        const player: IPublicPlayer = G.publicPlayers[Number(playerId)],
            discardedCard: PlayerCardsType = player.cards[suit].splice(cardId, 1)[0];
        if (!IsHeroCard(discardedCard)) {
            G.discardCardsDeck.push(discardedCard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил карту '${discardedCard.name}' в колоду сброса.`);
            player.stack = [];
        } else {
            throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
        }
    } else {
        // TODO Need it!?
        throw new Error(`Отсутствует обязательный параметр 'ctx.playerID'.`);
    }
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
    isInitial: boolean): void | never => {
    const playerConfig: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config;
    if (playerConfig !== undefined) {
        if (playerConfig.value === 3) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)]);
        } else if (playerConfig.value !== undefined) {
            UpgradeCoinAction(G, ctx, playerConfig.value, coinId, type, isInitial);
        } else {
            throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config.value'.`);
        }
    } else {
        throw new Error(`У игрока отсутствует обязательный параметр 'stack[0].config'.`);
    }
};
