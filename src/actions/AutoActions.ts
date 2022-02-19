import { Ctx, StageArg } from "boardgame.io";
import { ReturnCoinToPlayerHands, UpgradeCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { LogTypes, Stages } from "../typescript/enums";
import { ArgsTypes, CoinType, IBuffs, IConfig, IMyGameState, IPublicPlayer, IStack, SuitTypes } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const AddPickHeroAction = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.pickHero()]);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен выбрать нового героя.`);
};

/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardTradingCoinAction = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    let tradingCoinIndex: number =
        player.boardCoins.findIndex((coin: CoinType): boolean => Boolean(coin?.isTriggerTrading));
    if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined)
        && tradingCoinIndex === -1) {
        tradingCoinIndex =
            player.handCoins.findIndex((coin: CoinType): boolean => Boolean(coin?.isTriggerTrading));
        player.handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        player.boardCoins.splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил монету активирующую обмен.`);
};

/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const GetClosedCoinIntoPlayerHandAction = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    for (let i = 0; i < player.boardCoins.length; i++) {
        if (i > G.currentTavern) {
            ReturnCoinToPlayerHands(player, i);
        }
    }
};

/**
 * <h3>Старт действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardSuitCardAction = (G: IMyGameState, ctx: Ctx): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[1].config;
    if (config !== undefined && config.suit !== undefined) {
        const value: Record<string, StageArg> = {};
        for (let i = 0; i < ctx.numPlayers; i++) {
            if (i !== Number(ctx.currentPlayer) && G.publicPlayers[i].cards[config.suit as SuitTypes].length) {
                value[i] = {
                    stage: Stages.DiscardSuitCard,
                };
                AddActionsToStackAfterCurrent(G, ctx, [StackData.discardSuitCard(i)]);
            }
        }
        ctx.events?.setActivePlayers({
            value,
            minMoves: 1,
            maxMoves: 1,
        });
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.suit'.`);
    }
};

/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartVidofnirVedrfolnirAction = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        number: number = player.boardCoins.filter((coin: CoinType, index: number): boolean =>
            index >= G.tavernsNum && coin === null).length,
        handCoinsNumber: number = player.handCoins.length;
    if (player.buffs.find((buff: IBuffs): boolean => buff.everyTurn !== undefined) && number > 0
        && handCoinsNumber) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.addCoinToPouch(number)]);
    } else {
        let coinsValue = 0,
            stack: IStack[] = [];
        for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
            if (!player.boardCoins[j]?.isTriggerTrading) {
                coinsValue++;
            }
        }
        if (coinsValue === 1) {
            stack = [StackData.upgradeCoinVidofnirVedrfolnir(5)];
        } else if (coinsValue === 2) {
            stack = [StackData.upgradeCoinVidofnirVedrfolnir(3)];
        } else {
            // TODO log error!?
        }
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
};

/**
 * <h3>Действия, связанные с улучшением монет от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinAction = (G: IMyGameState, ctx: Ctx, ...args: ArgsTypes): void => {
    UpgradeCoin(G, ctx, ...args as [number, number, string, boolean]);
};
