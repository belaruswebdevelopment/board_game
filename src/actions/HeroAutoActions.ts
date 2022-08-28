import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ReturnCoinToPlayerHands } from "../helpers/CoinHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames } from "../typescript/enums";
import type { AutoActionArgsType, CanBeUndefType, IActionFunctionWithoutParams, IAutoActionFunction, ICoin, IMyGameState, IPlayer, IPublicPlayer, OneOrTwoType, PublicPlayerCoinType } from "../typescript/interfaces";
import { UpgradeCoinAction } from "./CoinActions";

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param args Аргументы действия.
 */
export const AddPickHeroAction: IAutoActionFunction = (G: IMyGameState, ctx: Ctx, ...args: AutoActionArgsType):
    void => {
    if (args.length !== 1) {
        throw new Error(`В массиве параметров функции количество аргументов не равно '1'.`);
    }
    const priority: CanBeUndefType<OneOrTwoType> = args[0] as CanBeUndefType<OneOrTwoType>;
    if (priority === undefined) {
        throw new Error(`В массиве параметров функции отсутствует аргумент с id '0'.`);
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (G.mode === GameModeNames.Solo1 && ctx.currentPlayer === `1`) {
        AddActionsToStack(G, ctx, [StackData.pickHeroSoloBot(priority)]);
    } else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
        AddActionsToStack(G, ctx, [StackData.pickHeroSoloBotAndvari(priority)]);
    } else {
        AddActionsToStack(G, ctx, [StackData.pickHero(priority)]);
    }
    AddDataToLog(G, LogTypeNames.Game, `${(G.mode === GameModeNames.Solo1 || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `1` ? `Соло бот` : `Игрок '${player.nickname}'`} должен выбрать нового героя.`);
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
export const GetClosedCoinIntoPlayerHandAction: IActionFunctionWithoutParams = (G: IMyGameState, ctx: Ctx): void => {
    if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
        || (G.mode === GameModeNames.Solo1 && ctx.currentPlayer === `0`)
        || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `0`)) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        for (let i = 0; i < player.boardCoins.length; i++) {
            if (i > G.currentTavern) {
                ReturnCoinToPlayerHands(G, ctx, Number(ctx.currentPlayer), i, false);
            }
        }
    }
};

// TODO Add code for Thrud Grid action!
// TODO Refactor and add throw errors
/**
 * <h3>Действия, связанные с улучшением минимальной монеты игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих минимальную монету игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param args Аргументы действия.
 */
export const UpgradeMinCoinAction: IAutoActionFunction = (G: IMyGameState, ctx: Ctx, ...args: AutoActionArgsType):
    void => {
    if (args.length !== 1) {
        throw new Error(`В массиве параметров функции количество аргументов не равно '1'.`);
    }
    const value: CanBeUndefType<number> = args[0];
    if (value === undefined) {
        throw new Error(`В массиве параметров функции отсутствует аргумент с id '0'.`);
    }
    // TODO Check it `G.mode === GameModeNames.Solo1 ? 1 : Number(ctx.currentPlayer)` and rework to `Number(ctx.currentPlayer)` if bot always upgrade Grid `2` in his turn during setup!
    const currentPlayer: number = G.mode === GameModeNames.Solo1 ? 1 : Number(ctx.currentPlayer),
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[currentPlayer],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[currentPlayer];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            currentPlayer);
    }
    let type: CoinTypeNames;
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
        && CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
        let handCoins: PublicPlayerCoinType[];
        if (G.mode === GameModeNames.Multiplayer) {
            handCoins = privatePlayer.handCoins;
        } else {
            handCoins = player.handCoins;
        }
        const allCoins: ICoin[] = [],
            allHandCoins: ICoin[] = handCoins.filter(IsCoin);
        for (let i = 0; i < player.boardCoins.length; i++) {
            const boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[i];
            if (boardCoin === null) {
                const handCoin: CanBeUndefType<ICoin> = allHandCoins.splice(0, 1)[0];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке отсутствует монета с id '${i}'.`);
                }
                allCoins.push(handCoin);
            } else {
                if (boardCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на поле отсутствует монета с id '${i}'.`);
                }
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на поле не может быть закрыта монета с id '${i}'.`);
                }
                allCoins.push(boardCoin);
            }
        }
        const minCoinValue: number = Math.min(...allCoins.filter((coin: ICoin): boolean =>
            !coin.isTriggerTrading).map((coin: ICoin): number => coin.value)),
            upgradingCoinsArray: ICoin[] =
                allCoins.filter((coin: ICoin): boolean => coin.value === minCoinValue),
            upgradingCoinsValue: number = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin: ICoin): boolean => coin.isInitial === true);
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId: number = allCoins.findIndex((coin: ICoin): boolean =>
                coin.value === minCoinValue),
                boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[upgradingCoinId];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
            }
            if (boardCoin === null) {
                const handCoinIndex: number =
                    handCoins.findIndex((coin: PublicPlayerCoinType, index: number): boolean => {
                        if (coin !== null && !IsCoin(coin)) {
                            throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                        }
                        return coin?.value === minCoinValue;
                    });
                if (handCoinIndex === -1) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке нет минимальной монеты с значением '${minCoinValue}'.`);
                }
                const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[handCoinIndex];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке отсутствует монета с id '${handCoinIndex}'.`);
                }
                if (!IsCoin(handCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке не может не быть монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypeNames.Hand;
            } else {
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypeNames.Board;
            }
            UpgradeCoinAction(G, ctx, false, value, upgradingCoinId, type);
        } else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStack(G, ctx,
                [StackData.pickConcreteCoinToUpgrade(minCoinValue, value)]);
            DrawCurrentProfit(G, ctx);
        } else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    } else {
        const minCoinValue: number =
            Math.min(...(player.boardCoins.filter((coin: PublicPlayerCoinType): boolean =>
                IsCoin(coin) && !coin.isTriggerTrading) as ICoin[])
                .map((coin: ICoin): number => coin.value));
        if (G.mode === GameModeNames.Solo1 && minCoinValue !== 2) {
            throw new Error(`В массиве монет соло бота с id '${currentPlayer}' не может быть минимальная монета не со значением '2'.`);
        }
        const upgradingCoinsArray = player.boardCoins.filter((coin: PublicPlayerCoinType): boolean =>
            coin?.value === minCoinValue) as ICoin[],
            upgradingCoinsValue: number = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin: PublicPlayerCoinType): boolean =>
                    coin?.isInitial === true);
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId: number =
                player.boardCoins.findIndex((coin: PublicPlayerCoinType): boolean =>
                    coin?.value === minCoinValue),
                boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[upgradingCoinId];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе отсутствует монета с id '${upgradingCoinId}'.`);
            }
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
            }
            type = CoinTypeNames.Board;
            UpgradeCoinAction(G, ctx, false, value, upgradingCoinId, type);
        } else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStack(G, ctx,
                [StackData.pickConcreteCoinToUpgrade(minCoinValue, value)]);
            DrawCurrentProfit(G, ctx);
        } else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    }
};
