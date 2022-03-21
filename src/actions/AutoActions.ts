import type { Ctx, StageArg } from "boardgame.io";
import { IsCoin, ReturnCoinToPlayerHands, UpgradeCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, LogTypes, Stages } from "../typescript/enums";
import type { ArgsTypes, CoinType, IMyGameState, IPlayer, IPublicPlayer, IStack, PublicPlayerBoardCoinTypes, SuitTypes } from "../typescript/interfaces";

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
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    AddActionsToStackAfterCurrent(G, ctx, [StackData.pickHero()]);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен выбрать нового героя.`);
};

/**
 * <h3>Действия, связанные со сбросом обменной монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Jarnglofi.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DiscardTradingCoinAction = (G: IMyGameState, ctx: Ctx): void => {
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
    let tradingCoinIndex: number =
        player.boardCoins.findIndex((coin: PublicPlayerBoardCoinTypes): boolean =>
            coin?.isTriggerTrading === true);
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && tradingCoinIndex === -1) {
        tradingCoinIndex = handCoins.findIndex((coin: CoinType): boolean => coin?.isTriggerTrading === true);
        if (tradingCoinIndex === -1) {
            throw new Error(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
        }
        handCoins.splice(tradingCoinIndex, 1, null);
    } else {
        if (tradingCoinIndex === -1) {
            throw new Error(`У игрока не может отсутствовать обменная монета.`);
        }
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins.splice(tradingCoinIndex, 1, null);
        }
        player.boardCoins.splice(tradingCoinIndex, 1, null);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} сбросил монету активирующую обмен.`);
};

export const FinishOdroerirTheMythicCauldronAction = (G: IMyGameState): void => {
    G.odroerirTheMythicCauldron = false;
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
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        if (i > G.currentTavern) {
            ReturnCoinToPlayerHands(G, Number(ctx.currentPlayer), i);
        }
    }
};

/**
 * <h3>Старт действия, связанные с сбросом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты лагеря артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardSuitCardAction = (G: IMyGameState, ctx: Ctx): void => {
    const currentPlayer: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (currentPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const stack1: IStack | undefined = currentPlayer.stack[1];
    if (stack1 === undefined) {
        throw new Error(`В массиве стека действий игрока отсутствует 1 действие.`);
    }
    const suit: SuitTypes | null | undefined = stack1.config?.suit;
    if (suit === undefined) {
        throw new Error(`У конфига действия игрока отсутствует обязательный параметр принадлежности сбрасываемой карты к конкретной фракции.`);
    }
    if (suit === null) {
        throw new Error(`У конфига действия игрока не задан обязательный параметр принадлежности сбрасываемой карты к конкретной фракции.`);
    }
    const value: Record<string, StageArg> = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: IPublicPlayer | undefined = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок.`);
        }
        if (i !== Number(ctx.currentPlayer) && player.cards[suit].length) {
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
};

/**
 * <h3>Действия, связанные со стартом способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте способности карты лагеря артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartVidofnirVedrfolnirAction = (G: IMyGameState, ctx: Ctx): void => {
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
    const number: number =
        player.boardCoins.filter((coin: PublicPlayerBoardCoinTypes, index: number): boolean =>
            index >= G.tavernsNum && coin === null).length,
        handCoinsNumber: number = handCoins.filter((coin: CoinType): boolean => IsCoin(coin)).length;
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && number > 0 && handCoinsNumber) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.addCoinToPouch(number)]);
    } else {
        let coinsValue = 0,
            stack: IStack[] = [];
        for (let j: number = G.tavernsNum; j < player.boardCoins.length; j++) {
            let coin: PublicPlayerBoardCoinTypes | undefined;
            if (multiplayer && privatePlayer !== undefined) {
                coin = privatePlayer.boardCoins[j];
                if (coin === undefined) {
                    throw new Error(`В массиве приватных монет игрока на поле отсутствует монета ${j}.`);
                }
                if (IsCoin(coin)) {
                    player.boardCoins[j] = coin;
                }
            } else {
                coin = player.boardCoins[j];
                if (coin === undefined) {
                    throw new Error(`В массиве монет игрока на поле отсутствует монета ${j}.`);
                }
            }
            if (IsCoin(coin) && !coin.isTriggerTrading) {
                coinsValue++;
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
