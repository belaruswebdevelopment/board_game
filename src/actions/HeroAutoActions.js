import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ReturnCoinToPlayerHands } from "../helpers/CoinHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { AssertOneOrTwo, AssertPlayerCoinId, AssertUpgradableCoinValue, AssertUpgradingCoinsArray } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin, IsInitialCoin, IsTriggerTradingCoin } from "../is_helpers/IsCoinTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames } from "../typescript/enums";
import { UpgradeCoinAction } from "./CoinActions";
/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param context
 * @param priority Приоритет выбора героя.
 * @returns
 */
export const AddPickHeroAction = ({ G, ctx, myPlayerID, ...rest }, priority /* OneOrTwoType */) => {
    AssertOneOrTwo(priority);
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (G.mode === GameModeNames.Solo && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.pickHeroSoloBot(priority)]);
    }
    else if (G.mode === GameModeNames.SoloAndvari && myPlayerID === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.pickHeroSoloBotAndvari(priority)]);
    }
    else {
        AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.pickHero(priority)]);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `Соло бот` : `Игрок '${player.nickname}'`} должен выбрать нового героя.`);
};
/**
 * <h3>Действия, связанные с возвращением закрытых монет со стола в руку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, возвращающих закрытые монеты со стола в руку.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const GetClosedCoinIntoPlayerHandAction = ({ G, ctx, myPlayerID, ...rest }) => {
    if (G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
        || (G.mode === GameModeNames.Solo && myPlayerID === `0`)
        || (G.mode === GameModeNames.SoloAndvari && myPlayerID === `0`)) {
        const player = G.publicPlayers[Number(myPlayerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
        }
        for (let i = 0; i < player.boardCoins.length; i++) {
            AssertPlayerCoinId(i);
            if (i > G.currentTavern) {
                const isCoinReturned = ReturnCoinToPlayerHands({ G, ctx, myPlayerID, ...rest }, i, false);
                if (!isCoinReturned) {
                    break;
                }
            }
        }
    }
};
// TODO Add code for Thrud Grid action!
// TODO Refactor & split into different functions and add throw errors
/**
 * <h3>Действия, связанные с улучшением минимальной монеты игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих минимальную монету игрока.</li>
 * </ol>
 *
 * @param context
 * @param value Значение обмена монеты.
 * @returns
 */
export const UpgradeMinCoinAction = ({ G, ctx, myPlayerID, ...rest }, value /* UpgradableCoinValueType */) => {
    AssertUpgradableCoinValue(value);
    // TODO Check it `G.mode === GameModeNames.Solo1 ? 1 : Number(ctx.currentPlayer)` and rework to `Number(ctx.currentPlayer)` if bot always upgrade Grid `2` in his turn during setup!
    const currentPlayer = G.mode === GameModeNames.Solo ? 1 : Number(myPlayerID), player = G.publicPlayers[currentPlayer], privatePlayer = G.players[currentPlayer];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, currentPlayer);
    }
    let type;
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
        && CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        let handCoins;
        if (G.mode === GameModeNames.Multiplayer) {
            handCoins = privatePlayer.handCoins;
        }
        else {
            handCoins = player.handCoins;
        }
        const allCoins = [], allHandCoins = handCoins.filter(IsCoin);
        for (let i = 0; i < player.boardCoins.length; i++) {
            AssertPlayerCoinId(i);
            const boardCoin = player.boardCoins[i];
            if (boardCoin === null) {
                const handCoin = allHandCoins.splice(0, 1)[0];
                if (handCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке отсутствует монета с id '${i}'.`);
                }
                allCoins.push(handCoin);
            }
            else {
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на поле не может быть закрыта монета с id '${i}'.`);
                }
                allCoins.push(boardCoin);
            }
        }
        const minCoinValue = Math.min(...allCoins.filter((coin) => !IsTriggerTradingCoin(coin)).map((coin) => coin.value));
        AssertUpgradableCoinValue(minCoinValue);
        const upgradingCoinsArray = allCoins.filter((coin) => coin.value === minCoinValue), 
        // TODO Can add type!?
        upgradingCoinsValue = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin) => IsInitialCoin(coin));
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId = allCoins.findIndex((coin) => coin.value === minCoinValue);
            if (upgradingCoinId === -1) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет минимальной монеты с значением '${minCoinValue}'.`);
            }
            AssertPlayerCoinId(upgradingCoinId);
            const boardCoin = player.boardCoins[upgradingCoinId];
            if (boardCoin === null) {
                const handCoinIndex = handCoins.findIndex((coin, index) => {
                    if (coin !== null && !IsCoin(coin)) {
                        throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
                    }
                    return (coin === null || coin === void 0 ? void 0 : coin.value) === minCoinValue;
                });
                if (handCoinIndex === -1) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке нет минимальной монеты с значением '${minCoinValue}'.`);
                }
                AssertPlayerCoinId(handCoinIndex);
                const handCoin = handCoins[handCoinIndex];
                if (!IsCoin(handCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' в руке не может не быть монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypeNames.Hand;
            }
            else {
                if (!IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
                }
                type = CoinTypeNames.Board;
            }
            UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, value, upgradingCoinId, type);
        }
        else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.pickConcreteCoinToUpgrade(minCoinValue, value)]);
            DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
        }
        else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    }
    else {
        // TODO Can i refactor `as`?
        const minCoinValue = Math.min(...player.boardCoins.filter((coin) => IsCoin(coin) && !IsTriggerTradingCoin(coin))
            .map((coin) => coin.value));
        AssertUpgradableCoinValue(minCoinValue);
        if (G.mode === GameModeNames.Solo && minCoinValue !== 2) {
            throw new Error(`В массиве монет соло бота с id '${currentPlayer}' не может быть минимальная монета не со значением '2'.`);
        }
        // TODO Can i refactor `as`?
        const upgradingCoinsArray = player.boardCoins.filter((coin) => IsCoin(coin) && coin.value === minCoinValue);
        AssertUpgradingCoinsArray(upgradingCoinsArray);
        const upgradingCoinsValue = upgradingCoinsArray.length;
        let isInitialInUpgradingCoinsValue = false;
        if (upgradingCoinsValue > 1) {
            isInitialInUpgradingCoinsValue =
                upgradingCoinsArray.some((coin) => IsInitialCoin(coin));
        }
        if (upgradingCoinsValue === 1 || ((upgradingCoinsValue > 1) && !isInitialInUpgradingCoinsValue)) {
            const upgradingCoinId = player.boardCoins.findIndex((coin) => IsCoin(coin) && coin.value === minCoinValue);
            if (upgradingCoinId === -1) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет минимальной монеты с значением '${minCoinValue}'.`);
            }
            AssertPlayerCoinId(upgradingCoinId);
            const boardCoin = player.boardCoins[upgradingCoinId];
            if (boardCoin === null) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе нет монеты с id '${upgradingCoinId}'.`);
            }
            if (!IsCoin(boardCoin)) {
                throw new Error(`В массиве монет игрока с id '${currentPlayer}' на столе не может быть закрытой монеты с id '${upgradingCoinId}'.`);
            }
            type = CoinTypeNames.Board;
            UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, value, upgradingCoinId, type);
        }
        else if (upgradingCoinsValue > 1 && isInitialInUpgradingCoinsValue) {
            AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [AllStackData.pickConcreteCoinToUpgrade(minCoinValue, value)]);
            DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
        }
        else if (upgradingCoinsValue <= 0) {
            throw new Error(`Количество возможных монет для обмена не может быть меньше либо равно нулю.`);
        }
    }
};
//# sourceMappingURL=HeroAutoActions.js.map