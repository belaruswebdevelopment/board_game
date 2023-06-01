import { ChangeIsOpenedCoinStatus } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RemoveCoinFromMarket } from "../helpers/DiscardCoinHelpers";
import { CheckValkyryRequirement } from "../helpers/MythologicalCreatureHelpers";
import { AssertBettermentMinMaxType, AssertCoinUpgradePossibleMaxValue, AssertPlayerCoinId } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsInitialCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames, PlayerIdForSoloGameNames, ValkyryBuffNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с улучшением монет от карт улучшения монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт, улучшающих монеты.</li>
 * </ol>
 *
 * @param context
 * @param isTrading Является ли монета обменной.
 * @param value Значение улучшения монеты.
 * @param upgradingCoinId Id обменной монеты.
 * @param type Тип обменной монеты.
 * @returns
 */
export const UpgradeCoinAction = ({ G, ctx, myPlayerID, ...rest }, isTrading, value, upgradingCoinId, type) => {
    const player = G.publicPlayers[Number(myPlayerID)], privatePlayer = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let handCoins, boardCoins;
    if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.SoloAndvari
        && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)) {
        handCoins = privatePlayer.handCoins;
        boardCoins = privatePlayer.boardCoins;
    }
    else {
        handCoins = player.handCoins;
        boardCoins = player.boardCoins;
    }
    let upgradingCoin, _exhaustiveCheck;
    const handCoin = handCoins[upgradingCoinId], boardCoin = boardCoins[upgradingCoinId];
    switch (type) {
        case CoinTypeNames.Hand:
            if (handCoin === null) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может не быть монеты с id '${upgradingCoinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть закрыта монета с id '${upgradingCoinId}'.`);
            }
            if (IsTriggerTradingCoin(handCoin)) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может быть монета, активирующая обмен монет, с id '${upgradingCoinId}'.`);
            }
            upgradingCoin = handCoin;
            break;
        case CoinTypeNames.Board:
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе не может не быть монеты с id '${upgradingCoinId}'.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе не может быть закрыта монета с id '${upgradingCoinId}'.`);
            }
            if (IsTriggerTradingCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' на столе не может быть монета, активирующая обмен монет, с id '${upgradingCoinId}'.`);
            }
            upgradingCoin = boardCoin;
            break;
        default:
            _exhaustiveCheck = type;
            throw new Error(`Не существует такого типа монеты.`);
            return _exhaustiveCheck;
    }
    // TODO Split into different functions!?
    const buffValue = CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.UpgradeCoin) ? 2 : 0, newValue = upgradingCoin.value + value + buffValue;
    AssertCoinUpgradePossibleMaxValue(newValue);
    let upgradedCoin = null;
    if (G.royalCoins.length) {
        const lastRoyalCoin = G.royalCoins[G.royalCoins.length - 1];
        if (lastRoyalCoin === undefined) {
            throw new Error(`В массиве монет рынка отсутствует последняя монета с id '${G.royalCoins.length - 1}'.`);
        }
        if (newValue > lastRoyalCoin.value) {
            upgradedCoin = lastRoyalCoin;
            RemoveCoinFromMarket({ G, ctx, ...rest }, G.royalCoins.length - 1);
        }
        else {
            for (let i = 0; i < G.royalCoins.length; i++) {
                const royalCoin = G.royalCoins[i];
                if (royalCoin === undefined) {
                    throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
                }
                if (royalCoin.value < newValue) {
                    upgradedCoin = royalCoin;
                }
                else if (royalCoin.value >= newValue) {
                    upgradedCoin = royalCoin;
                    RemoveCoinFromMarket({ G, ctx, ...rest }, i);
                    if (G.expansions.Idavoll.active) {
                        const betterment = royalCoin.value - newValue;
                        AssertBettermentMinMaxType(betterment);
                        if (betterment > 0) {
                            for (let j = 0; j < betterment; j++) {
                                CheckValkyryRequirement({ G, ctx, myPlayerID, ...rest }, ValkyryBuffNames.CountBettermentAmount);
                            }
                        }
                    }
                    break;
                }
                if (i === G.royalCoins.length - 1) {
                    RemoveCoinFromMarket({ G, ctx, ...rest }, i);
                }
            }
        }
    }
    if (upgradedCoin === null) {
        throw new Error(`На рынке монет нет доступных монет для обмена.`);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Начато обновление монеты с ценностью '${upgradingCoin.value}' на '+${value}'.`);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Начато обновление монеты c ID '${upgradingCoinId}' с типом '${type}' с initial '${IsInitialCoin(upgradingCoin) ? true : false}' с ценностью '${upgradingCoin.value}' на '+${value}' с новым значением '${newValue}' с итоговым значением '${upgradedCoin.value}'.`);
    // TODO Check it && check is it need for solo bot Andvari?!
    if (!upgradedCoin.isOpened
        && !(G.mode === GameModeNames.Solo && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId
            && upgradingCoin.value === 2)) {
        ChangeIsOpenedCoinStatus(upgradedCoin, true);
    }
    // TODO Check it && check is it need for solo bot Andvari?!
    if ((((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
        || (G.mode === GameModeNames.Solo && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId
            && upgradingCoin.value === 2)) && type === CoinTypeNames.Hand)
        || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
            && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)
            && type === CoinTypeNames.Board && isTrading)) {
        if (isTrading) {
            const handCoinId = player.handCoins.indexOf(null);
            if (handCoinId === -1) {
                throw new Error(`В массиве монет игрока с id '${myPlayerID}' в руке не может не быть пустого места для возврата улучшенной монеты.`);
            }
            AssertPlayerCoinId(handCoinId);
            if (G.mode === GameModeNames.Multiplayer) {
                boardCoins[upgradingCoinId] = null;
                player.handCoins[handCoinId] = upgradedCoin;
            }
            player.boardCoins[upgradingCoinId] = null;
            handCoins[handCoinId] = upgradedCoin;
        }
        else {
            if (G.mode === GameModeNames.Multiplayer) {
                player.handCoins[upgradingCoinId] = upgradedCoin;
            }
            handCoins[upgradingCoinId] = upgradedCoin;
        }
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Монета с ценностью '${upgradedCoin.value}' вернулась на руку игрока '${player.nickname}'.`);
    }
    else if (type === CoinTypeNames.Board) {
        if (G.mode === GameModeNames.Multiplayer
            || (G.mode === GameModeNames.SoloAndvari && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)) {
            boardCoins[upgradingCoinId] = upgradedCoin;
        }
        player.boardCoins[upgradingCoinId] = upgradedCoin;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Монета с ценностью '${upgradedCoin.value}' вернулась на поле игрока '${player.nickname}'.`);
    }
    if (!IsInitialCoin(upgradingCoin)) {
        let returningIndex = 0;
        for (let i = 0; i < G.royalCoins.length; i++) {
            returningIndex = i;
            const royalCoinReturn = G.royalCoins[i];
            if (royalCoinReturn === undefined) {
                throw new Error(`В массиве монет рынка отсутствует монета с id '${i}'.`);
            }
            if (royalCoinReturn.value > upgradingCoin.value) {
                break;
            }
        }
        G.royalCoins.splice(returningIndex, 0, upgradingCoin);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Монета с ценностью '${upgradingCoin.value}' вернулась на рынок.`);
    }
    if (player.currentMaxCoinValue === upgradingCoin.value && upgradedCoin.value > player.currentMaxCoinValue) {
        player.currentMaxCoinValue = upgradedCoin.value;
    }
    player.currentCoinsScore += upgradedCoin.value - upgradingCoin.value;
};
//# sourceMappingURL=CoinActions.js.map