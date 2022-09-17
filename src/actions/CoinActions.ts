import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { AddDataToLog } from "../Logging";
import { BuffNames, CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, Ctx, ICoin, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";

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
 * @returns
 */
export const UpgradeCoinAction = (G: IMyGameState, ctx: Ctx, isTrading: boolean, value: number,
    upgradingCoinId: number, type: CoinTypeNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined,
            ctx.currentPlayer);
    }
    let handCoins: PublicPlayerCoinType[],
        boardCoins: PublicPlayerCoinType[];
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    } else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    let upgradingCoin: CanBeUndefType<ICoin>,
        _exhaustiveCheck: never;
    const handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[upgradingCoinId],
        boardCoin: CanBeUndefType<PublicPlayerCoinType> = boardCoins[upgradingCoinId];
    switch (type) {
        case CoinTypeNames.Hand:
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
            break;
        case CoinTypeNames.Board:
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
            break;
        default:
            _exhaustiveCheck = type;
            throw new Error(`Не существует такого типа монеты.`);
            return _exhaustiveCheck;
    }
    // TODO Split into different functions!?
    if (upgradingCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' отсутствует обменная монета.`);
    }
    const buffValue: number = CheckPlayerHasBuff(player, BuffNames.UpgradeCoin) ? 2 : 0,
        newValue: number = upgradingCoin.value + value + buffValue;
    let upgradedCoin: CoinType = null;
    if (G.marketCoins.length) {
        const lastMarketCoin: CanBeUndefType<ICoin> = G.marketCoins[G.marketCoins.length - 1];
        if (lastMarketCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует последняя монета с id '${G.marketCoins.length - 1}'.`);
        }
        if (newValue > lastMarketCoin.value) {
            upgradedCoin = lastMarketCoin;
            G.marketCoins.splice(G.marketCoins.length - 1, 1);
        } else {
            for (let i = 0; i < G.marketCoins.length; i++) {
                const marketCoin: CanBeUndefType<ICoin> = G.marketCoins[i];
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
    // TODO Check it && check is it need for solo bot Andvari?!
    if (!upgradedCoin.isOpened
        && !(G.mode === GameModeNames.Solo && ctx.currentPlayer === `1` && upgradingCoin.value === 2)) {
        ChangeIsOpenedCoinStatus(upgradedCoin, true);
    }
    // TODO Check it && check is it need for solo bot Andvari?!
    if ((((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
        || (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1` && upgradingCoin.value === 2))
        && type === CoinTypeNames.Hand) || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && CheckPlayerHasBuff(player, BuffNames.EveryTurn)
            && type === CoinTypeNames.Board && isTrading)) {
        if (isTrading) {
            const handCoinId: number = player.handCoins.indexOf(null);
            if (G.mode === GameModeNames.Multiplayer) {
                boardCoins[upgradingCoinId] = null;
                player.handCoins[handCoinId] = upgradedCoin;
            }
            player.boardCoins[upgradingCoinId] = null;
            handCoins[handCoinId] = upgradedCoin;
        } else {
            if (G.mode === GameModeNames.Multiplayer) {
                player.handCoins[upgradingCoinId] = upgradedCoin;
            }
            handCoins[upgradingCoinId] = upgradedCoin;
        }
        AddDataToLog(G, LogTypeNames.Public, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока '${player.nickname}'.`);
    } else if (type === CoinTypeNames.Board) {
        if (G.mode === GameModeNames.Multiplayer
            || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)) {
            boardCoins[upgradingCoinId] = upgradedCoin;
        }
        player.boardCoins[upgradingCoinId] = upgradedCoin;
        AddDataToLog(G, LogTypeNames.Public, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока '${player.nickname}'.`);
    }
    if (!upgradingCoin.isInitial) {
        let returningIndex = 0;
        for (let i = 0; i < G.marketCoins.length; i++) {
            returningIndex = i;
            const marketCoinReturn: CanBeUndefType<ICoin> = G.marketCoins[i];
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
