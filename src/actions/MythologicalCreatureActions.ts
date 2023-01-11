import { ChangeIsOpenedCoinStatus } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { UpgradeNextCoinsHrungnir } from "../helpers/CoinActionHelpers";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames } from "../typescript/enums";
import type { ActionFunctionWithoutParams, CanBeUndefType, CoinType, MyFnContextWithMyPlayerID, Player, PublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";
import { UpgradeCoinAction } from "./CoinActions";

/**
 * <h3>Действия, связанные с улучшением всех монет игрока на +2 Hrungnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При активации способности Гиганта Hrungnir.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const AddPlusTwoValueToAllCoinsAction: ActionFunctionWithoutParams = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)],
        privatePlayer: CanBeUndefType<Player> = G.players[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    for (let j = 0; j < 5; j++) {
        // TODO Check for Local and Multiplayer games!
        const privateBoardCoin: CanBeUndefType<CoinType> = privatePlayer.boardCoins[j];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
        }
        let publicBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[j];
        if (publicBoardCoin === undefined) {
            throw new Error(`В массиве монет публичного игрока с id '${myPlayerID}' на поле отсутствует монета с id '${j}'.`);
        }
        // TODO Check `if (G.mode === GameModeNames.Multiplayer) {`
        if (G.mode === GameModeNames.Multiplayer) {
            if (privateBoardCoin !== null) {
                if (!privateBoardCoin.isOpened) {
                    ChangeIsOpenedCoinStatus(privateBoardCoin, true);
                }
                publicBoardCoin = privateBoardCoin;
            }
        }
        // TODO Duplicate opening
        // if (!publicBoardCoin.isOpened) {
        //     ChangeIsOpenedCoinStatus(publicBoardCoin, true);
        // }
        if (publicBoardCoin !== null) {
            UpgradeCoinAction({ G, ctx, myPlayerID, ...rest }, false, 2, j,
                CoinTypeNames.Board);
        }
    }
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.EveryTurn)) {
        UpgradeNextCoinsHrungnir({ G, ctx, myPlayerID, ...rest }, 0);
    }
};
