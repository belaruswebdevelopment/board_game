import type { Ctx } from "boardgame.io";
import { IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ReturnCoinToPlayerHands } from "../helpers/CoinHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { BuffNames, CoinTypes } from "../typescript/enums";
import type { AutoActionArgsTypes, ICoin, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";
import { UpgradeCoinAction } from "./CoinActions";

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
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    for (let i = 0; i < player.boardCoins.length; i++) {
        if (i > G.currentTavern) {
            ReturnCoinToPlayerHands(G, Number(ctx.currentPlayer), i, false);
        }
    }
};

// TODO Refactor and add throw errors
export const UpgradeMinCoinAction = (G: IMyGameState, ctx: Ctx, ...args: AutoActionArgsTypes): void => {
    if (args.length !== 1) {
        throw new Error(`В массиве параметров функции отсутствует требуемый параметр 'value'.`);
    }
    const multiplayer: boolean = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let type: CoinTypes;
    if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
        let handCoins: PublicPlayerCoinTypes[];
        if (multiplayer) {
            handCoins = privatePlayer.handCoins;
        } else {
            handCoins = player.handCoins;
        }
        const allCoins: PublicPlayerCoinTypes[] = [],
            allHandCoins: PublicPlayerCoinTypes[] =
                handCoins.filter((coin: PublicPlayerCoinTypes, index: number): boolean => {
                    if (coin !== null && !IsCoin(coin)) {
                        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                    }
                    return IsCoin(coin);
                });
        for (let i = 0; i < player.boardCoins.length; i++) {
            const boardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[i];
            if (boardCoin === null) {
                const handCoin: PublicPlayerCoinTypes | undefined = allHandCoins.splice(0, 1)[0];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${i}'.`);
                }
                if (handCoin === null) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${i}'.`);
                }
                if (!IsCoin(handCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${i}'.`);
                }
                allCoins.push(handCoin);
            } else {
                if (boardCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует монета с id '${i}'.`);
                }
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле не может быть закрыта монета с id '${i}'.`);
                }
                if (IsCoin(boardCoin)) {
                    allCoins.push(boardCoin);
                }
            }
        }
        const minCoinValue: number =
            Math.min(...allCoins.filter((coin: PublicPlayerCoinTypes): boolean =>
                IsCoin(coin) && !coin.isTriggerTrading).map((coin: PublicPlayerCoinTypes): number =>
                    (coin as ICoin).value)),
            upgradingCoinsArray =
                allCoins.filter((coin: PublicPlayerCoinTypes): boolean => coin?.value === minCoinValue),
            upgradingCoinsValue: number = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin: PublicPlayerCoinTypes): boolean => coin?.isInitial === true);
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId: number = allCoins.findIndex((coin: PublicPlayerCoinTypes): boolean =>
                coin?.value === minCoinValue),
                boardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[upgradingCoinId];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
            }
            if (boardCoin === null) {
                const handCoinIndex: number =
                    handCoins.findIndex((coin: PublicPlayerCoinTypes, index: number): boolean => {
                        if (coin !== null && !IsCoin(coin)) {
                            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                        }
                        return coin?.value === minCoinValue;
                    });
                if (handCoinIndex === -1) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке нет минимальной монеты с значением '${minCoinValue}'.`);
                }
                const handCoin: PublicPlayerCoinTypes | undefined = handCoins[handCoinIndex];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${handCoinIndex}'.`);
                }
                if (!IsCoin(handCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypes.Hand;
            } else {
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypes.Board;
            }
            UpgradeCoinAction(G, ctx, false, ...args, upgradingCoinId, type);
        } else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStackAfterCurrent(G, ctx,
                [StackData.pickConcreteCoinToUpgrade(minCoinValue, ...args)]);
            DrawCurrentProfit(G, ctx);
        } else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    } else {
        const minCoinValue: number =
            Math.min(...player.boardCoins.filter((coin: PublicPlayerCoinTypes): boolean =>
                IsCoin(coin) && !coin.isTriggerTrading)
                .map((coin: PublicPlayerCoinTypes): number => (coin as ICoin).value)),
            upgradingCoinsArray = player.boardCoins.filter((coin: PublicPlayerCoinTypes): boolean =>
                coin?.value === minCoinValue),
            upgradingCoinsValue: number = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin: PublicPlayerCoinTypes): boolean =>
                    coin?.isInitial === true);
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId: number =
                player.boardCoins.findIndex((coin: PublicPlayerCoinTypes): boolean =>
                    coin?.value === minCoinValue),
                boardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[upgradingCoinId];
            if (boardCoin === undefined) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${upgradingCoinId}'.`);
            }
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
            }
            type = CoinTypes.Board;
            UpgradeCoinAction(G, ctx, false, ...args, upgradingCoinId, type);
        } else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStackAfterCurrent(G, ctx,
                [StackData.pickConcreteCoinToUpgrade(minCoinValue, ...args)]);
            DrawCurrentProfit(G, ctx);
        } else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    }
};
