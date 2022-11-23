import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames, GameModeNames } from "../typescript/enums";
import { AddActionsToStack } from "./StackHelpers";
/**
 * <h3>Действия, связанные с улучшением монет от действий улучшающих монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип обменной монеты.
 * @returns Значение на которое улучшается монета.
 */
export const UpgradeCoinActions = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined, playerID);
    }
    const value = stack.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${playerID}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction({ G, ctx, playerID, ...rest }, false, value, coinId, type);
    return value;
};
export const UpgradeNextCoinsHrungnir = ({ G, ctx, playerID, ...rest }, coinId) => {
    const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
    }
    for (let j = coinId; j < 5; j++) {
        // TODO Check for Local and Multiplayer games!
        const privateBoardCoin = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' на поле отсутствует монета с id '${j}'.`);
        }
        // TODO Check `if (G.mode === GameModeNames.Multiplayer) {`
        if (G.mode === GameModeNames.Multiplayer) {
            // TODO Check if player has coins in hands to continue upgrade!?
            if (privateBoardCoin === null) {
                coinId = j;
                break;
            }
            if (!privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[j] = privateBoardCoin;
        }
        UpgradeCoinAction({ G, ctx, playerID, ...rest }, false, 2, j, CoinTypeNames.Board);
    }
    AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.startAddPlusTwoValueToAllCoinsUline(coinId)]);
};
//# sourceMappingURL=CoinActionHelpers.js.map