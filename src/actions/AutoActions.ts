import type { Ctx, StageArg } from "boardgame.io";
import { IsCoin, ReturnCoinToPlayerHands, UpgradeCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes, Stages } from "../typescript/enums";
import type { ArgsTypes, CoinType, IMyGameState, IPublicPlayer, IStack, SuitTypes } from "../typescript/interfaces";

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
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickHero()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен выбрать нового героя.`);
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
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
export const DiscardTradingCoinAction = (G: IMyGameState, ctx: Ctx): void | never => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        let tradingCoinIndex: number =
            player.boardCoins.findIndex((coin: CoinType): boolean => coin?.isTriggerTrading === true);
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && tradingCoinIndex === -1) {
            tradingCoinIndex =
                player.handCoins.findIndex((coin: CoinType): boolean => coin?.isTriggerTrading === true);
            if (tradingCoinIndex !== -1) {
                player.handCoins.splice(tradingCoinIndex, 1, null);
            } else {
                throw new Error(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
            }
        } else if (tradingCoinIndex !== -1) {
            player.boardCoins.splice(tradingCoinIndex, 1, null);
        } else {
            throw new Error(`У игрока не может отсутствовать обменная монета.`);
        }
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил монету активирующую обмен.`);
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
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
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        for (let i = 0; i < player.boardCoins.length; i++) {
            if (i > G.currentTavern) {
                ReturnCoinToPlayerHands(player, i);
            }
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
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
export const StartDiscardSuitCardAction = (G: IMyGameState, ctx: Ctx): void | never => {
    const currentPlayer: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (currentPlayer !== undefined) {
        const suit: SuitTypes | undefined = currentPlayer.stack[1]?.config?.suit;
        if (suit !== undefined) {
            const value: Record<string, StageArg> = {};
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: IPublicPlayer | undefined = G.publicPlayers[i];
                if (player !== undefined) {
                    if (i !== Number(ctx.currentPlayer) && player.cards[suit].length) {
                        value[i] = {
                            stage: Stages.DiscardSuitCard,
                        };
                        AddActionsToStackAfterCurrent(G, ctx, [StackData.discardSuitCard(i)]);
                    }
                } else {
                    throw new Error(`В массиве игроков отсутствует игрок.`);
                }
            }
            ctx.events?.setActivePlayers({
                value,
                minMoves: 1,
                maxMoves: 1,
            });
        } else {
            throw new Error(`У конфига действия игрока отсутствует обязательный параметр принадлежности сбрасываемой карты к конкретной фракции.`);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
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
export const StartVidofnirVedrfolnirAction = (G: IMyGameState, ctx: Ctx): void | never => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player !== undefined) {
        const number: number = player.boardCoins.filter((coin: CoinType, index: number): boolean =>
            index >= G.tavernsNum && coin === null).length,
            handCoinsNumber: number = player.handCoins.length;
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && number > 0 && handCoinsNumber) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.addCoinToPouch(number)]);
        } else {
            let coinsValue = 0,
                stack: IStack[] = [];
            for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
                const coin: CoinType | undefined = player.boardCoins[j];
                if (coin !== undefined) {
                    if (IsCoin(coin) && !coin.isTriggerTrading) {
                        coinsValue++;
                    }
                } else {
                    throw new Error(`В массиве монет игрока на поле отсутствует нужная монета.`);
                }
            }
            if (coinsValue === 1) {
                stack = [StackData.upgradeCoinVidofnirVedrfolnir(5)];
            } else if (coinsValue === 2) {
                stack = [StackData.upgradeCoinVidofnirVedrfolnir(3)];
            } else {
                throw new Error(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта 'VidofnirVedrfolnir', а не ${coinsValue} монет(ы).`);
            }
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
    } else {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
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
