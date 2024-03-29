import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { AllStackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AssertPlayerCoinId } from "../is_helpers/AssertionTypeHelpers";
import { CoinTypeNames, ErrorNames, GameModeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, MyFnContextWithMyPlayerID, PlayerCoinIdType, PlayerStack, PrivatePlayer, PublicPlayer, UpgradableCoinValueType } from "../typescript/interfaces";
import { AddActionsToStack } from "./StackHelpers";

/**
 * <h3>Действия, связанные с улучшением монет от действий улучшающих монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях улучшающих монеты.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип обменной монеты.
 * @returns Значение на которое улучшается монета.
 */
export const UpgradeCoinActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, coinId: PlayerCoinIdType,
    type: CoinTypeNames): UpgradableCoinValueType => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<PlayerStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionForPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const value: CanBeUndefType<UpgradableCoinValueType> = stack.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${myPlayerID}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, value, coinId, type);
    return value;
};

export const UpgradeNextCoinsHrungnir = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    coinId: PlayerCoinIdType): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    for (let j = coinId; j < 5; j++) {
        AssertPlayerCoinId(j);
        // TODO Check for Local and Multiplayer games!
        const privateBoardCoin: CoinType = privatePlayer.boardCoins[j];
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
        UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, 2, j,
            CoinTypeNames.Board);
    }
    AddActionsToStack({ G, ctx, myPlayerID, ...rest },
        [AllStackData.startAddPlusTwoValueToAllCoinsUline(coinId)]);
};
