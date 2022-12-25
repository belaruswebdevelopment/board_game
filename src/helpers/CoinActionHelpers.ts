import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames, GameModeNames } from "../typescript/enums";
import type { CanBeUndefType, CoinType, IPlayer, IPublicPlayer, IStack, MyFnContextWithMyPlayerID } from "../typescript/interfaces";
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
export const UpgradeCoinActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, coinId: number,
    type: CoinTypeNames): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined,
            myPlayerID);
    }
    const value: CanBeUndefType<number> = stack.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${myPlayerID}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, value, coinId, type);
    return value;
};

export const UpgradeNextCoinsHrungnir = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, coinId: number):
    void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined,
            myPlayerID);
    }
    for (let j = coinId; j < 5; j++) {
        // TODO Check for Local and Multiplayer games!
        const privateBoardCoin: CanBeUndefType<CoinType> = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
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
        UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, 2, j,
            CoinTypeNames.Board);
    }
    AddActionsToStack({ G, ctx, myPlayerID, ...rest }, [StackData.startAddPlusTwoValueToAllCoinsUline(coinId)]);
};
