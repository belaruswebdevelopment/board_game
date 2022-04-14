import type { Ctx } from "boardgame.io";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypes, LogTypes } from "../typescript/enums";
import type { CoinType, ICoin, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с улучшением монет от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли монета обменной.
 * @param value Значение увеличения монеты.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @param isInitial Является ли обменная монета базовой.
 */
export const UpgradeCoinAction = (G: IMyGameState, ctx: Ctx, isTrading: boolean, value: number,
    upgradingCoinId: number, type: CoinTypes): void => {
    const multiplayer: boolean = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[];
    if (multiplayer) {
        handCoins = privatePlayer.handCoins;
    } else {
        handCoins = player.handCoins;
    }
    let upgradingCoin: ICoin | undefined;
    if (type === CoinTypes.Hand) {
        const handCoin: PublicPlayerCoinTypes | undefined = handCoins[upgradingCoinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке нет монеты с id '${upgradingCoinId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${upgradingCoinId}'.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${upgradingCoinId}'.`);
        }
        upgradingCoin = handCoin;
    } else if (type === CoinTypes.Board) {
        const boardCoin: PublicPlayerCoinTypes | undefined = player.boardCoins[upgradingCoinId];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
        }
        if (boardCoin === null) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может не быть монеты с id '${upgradingCoinId}'.`);
        }
        if (!IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может быть закрыта монета с id '${upgradingCoinId}'.`);
        }
        upgradingCoin = boardCoin;
    } else {
        throw new Error(`Не существует типа монеты - '${type}'.`);
    }
    // TODO Split into different functions!?
    if (upgradingCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' отсутствует обменная монета.`);
    }
    const buffValue: number = CheckPlayerHasBuff(player, BuffNames.UpgradeCoin) ? 2 : 0,
        newValue: number = upgradingCoin.value + value + buffValue;
    let upgradedCoin: CoinType = null;
    if (G.marketCoins.length) {
        const lastMarketCoin = G.marketCoins[G.marketCoins.length - 1];
        if (lastMarketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует последняя монета с id '${G.marketCoins.length - 1}'.`);
        }
        if (newValue > lastMarketCoin.value) {
            upgradedCoin = lastMarketCoin;
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                const marketCoin = G.marketCoins[i];
                if (marketCoin === undefined) {
                    throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
                }
                if (marketCoin.value < newValue) {
                    upgradedCoin = marketCoin;
                } else if (marketCoin.value >= newValue) {
                    upgradedCoin = marketCoin;
                    G.marketCoins.splice(i, 1);
                    break;
                }
                if (i === G.marketCoins.length - 1) {
                    G.marketCoins.splice(i, 1);
                }
            }
        }
    }
    AddDataToLog(G, LogTypes.GAME, `Начато обновление монеты с ценностью '${upgradingCoin.value}' на '+${value}'.`);
    if (upgradedCoin !== null) {
        AddDataToLog(G, LogTypes.PRIVATE, `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' с initial '${upgradingCoin.isInitial}' с ценностью '${upgradingCoin.value}' на '+${value}' с новым значением '${newValue}' с итоговым значением '${upgradedCoin.value}'.`);
        if (!upgradedCoin.isOpened) {
            ChangeIsOpenedCoinStatus(upgradedCoin, true);
        }
        if (type === CoinTypes.Hand
            || (CheckPlayerHasBuff(player, BuffNames.EveryTurn) && type === CoinTypes.Board && isTrading)) {
            if (isTrading) {
                const handCoinId: number = player.handCoins.indexOf(null);
                if (multiplayer) {
                    privatePlayer.boardCoins[upgradingCoinId] = null;
                    player.handCoins[handCoinId] = upgradedCoin;
                }
                player.boardCoins[upgradingCoinId] = null;
                handCoins[handCoinId] = upgradedCoin;
            } else {
                if (multiplayer) {
                    player.handCoins[upgradingCoinId] = upgradedCoin;
                }
                handCoins[upgradingCoinId] = upgradedCoin;
            }
            AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока '${player.nickname}'.`);
        } else if (type === CoinTypes.Board) {
            if (multiplayer) {
                privatePlayer.boardCoins[upgradingCoinId] = upgradedCoin;
            }
            player.boardCoins[upgradingCoinId] = upgradedCoin;
            AddDataToLog(G, LogTypes.PUBLIC, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока '${player.nickname}'.`);
        }
        if (!upgradingCoin.isInitial) {
            let returningIndex = 0;
            for (let i = 0; i < G.marketCoins.length; i++) {
                returningIndex = i;
                const marketCoinReturn = G.marketCoins[i];
                if (marketCoinReturn === undefined) {
                    throw new Error(`В массиве монет рынка отсутствует монета ${i}.`);
                }
                if (marketCoinReturn.value > upgradingCoin.value) {
                    break;
                }
            }
            G.marketCoins.splice(returningIndex, 0, upgradingCoin);
            AddDataToLog(G, LogTypes.GAME, `Монета с ценностью '${upgradingCoin.value}' вернулась на рынок.`);
        }
    } else {
        AddDataToLog(G, LogTypes.PRIVATE, `На рынке монет нет доступных монет для обмена.`);
    }
};
