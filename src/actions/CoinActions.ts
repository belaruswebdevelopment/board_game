import type { Ctx } from "boardgame.io";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypeNames, ErrorNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndef, CoinTypes, ICoin, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

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
 * @param value Значение улучшения монеты.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 */
export const UpgradeCoinAction = (G: IMyGameState, ctx: Ctx, isTrading: boolean, value: number,
    upgradingCoinId: number, type: CoinTypeNames): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
            ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinTypes[],
        boardCoins: PublicPlayerCoinTypes[];
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    } else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    let upgradingCoin: CanBeUndef<ICoin>;
    if (type === CoinTypeNames.Hand) {
        const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[upgradingCoinId];
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
    } else if (type === CoinTypeNames.Board) {
        const boardCoin: CanBeUndef<PublicPlayerCoinTypes> = boardCoins[upgradingCoinId];
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
    let upgradedCoin: CoinTypes = null;
    if (G.marketCoins.length) {
        const lastMarketCoin: CanBeUndef<ICoin> = G.marketCoins[G.marketCoins.length - 1];
        if (lastMarketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует последняя монета с id '${G.marketCoins.length - 1}'.`);
        }
        if (newValue > lastMarketCoin.value) {
            upgradedCoin = lastMarketCoin;
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                const marketCoin: CanBeUndef<ICoin> = G.marketCoins[i];
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
    if (upgradedCoin === null) {
        throw new Error(`На рынке монет нет доступных монет для обмена.`);
    }
    AddDataToLog(G, LogTypeNames.Game, `Начато обновление монеты с ценностью '${upgradingCoin.value}' на '+${value}'.`);
    AddDataToLog(G, LogTypeNames.Private, `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' с initial '${upgradingCoin.isInitial}' с ценностью '${upgradingCoin.value}' на '+${value}' с новым значением '${newValue}' с итоговым значением '${upgradedCoin.value}'.`);
    if (!upgradedCoin.isOpened && !(G.solo && ctx.currentPlayer === `1` && upgradingCoin.value === 2)) {
        ChangeIsOpenedCoinStatus(upgradedCoin, true);
    }
    if (((!G.solo || (G.solo && ctx.currentPlayer === `1` && upgradingCoin.value === 2))
        && type === CoinTypeNames.Hand) || (!G.solo && CheckPlayerHasBuff(player, BuffNames.EveryTurn)
            && type === CoinTypeNames.Board && isTrading)) {
        if (isTrading) {
            const handCoinId: number = player.handCoins.indexOf(null);
            if (G.multiplayer) {
                boardCoins[upgradingCoinId] = null;
                player.handCoins[handCoinId] = upgradedCoin;
            }
            player.boardCoins[upgradingCoinId] = null;
            handCoins[handCoinId] = upgradedCoin;
        } else {
            if (G.multiplayer) {
                player.handCoins[upgradingCoinId] = upgradedCoin;
            }
            handCoins[upgradingCoinId] = upgradedCoin;
        }
        AddDataToLog(G, LogTypeNames.Public, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока '${player.nickname}'.`);
    } else if (type === CoinTypeNames.Board) {
        if (G.multiplayer) {
            boardCoins[upgradingCoinId] = upgradedCoin;
        }
        player.boardCoins[upgradingCoinId] = upgradedCoin;
        AddDataToLog(G, LogTypeNames.Public, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока '${player.nickname}'.`);
    }
    if (!upgradingCoin.isInitial) {
        let returningIndex = 0;
        for (let i = 0; i < G.marketCoins.length; i++) {
            returningIndex = i;
            const marketCoinReturn: CanBeUndef<ICoin> = G.marketCoins[i];
            if (marketCoinReturn === undefined) {
                throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
            }
            if (marketCoinReturn.value > upgradingCoin.value) {
                break;
            }
        }
        G.marketCoins.splice(returningIndex, 0, upgradingCoin);
        AddDataToLog(G, LogTypeNames.Game, `Монета с ценностью '${upgradingCoin.value}' вернулась на рынок.`);
    }
};
