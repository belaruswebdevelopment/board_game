import { INVALID_MOVE } from "boardgame.io/core";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { ThrowMyError } from "../Error";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { IsValidMove } from "../MoveValidator";
import { BidsDefaultStageNames, BidUlineDefaultStageNames, CoinMoveNames, CoinTypeNames, CommonStageNames, ErrorNames, GameModeNames, TavernsResolutionStageNames } from "../typescript/enums";
// TODO Check moves with solo mode!
/**
 * <h3>Выбор места для монет на столе для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по месту для монет на столе.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const ClickBoardCoinMove = ({ G, ctx, playerID, ...rest }, coinId) => {
    // TODO Add Place coins async
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, BidsDefaultStageNames.ClickBoardCoin, CoinMoveNames.ClickBoardCoinMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
    }
    const publicBoardCoin = player.boardCoins[coinId];
    if (publicBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${playerID}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    let handCoins, privateBoardCoin;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
        privateBoardCoin = privatePlayer.boardCoins[coinId];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' на столе отсутствует монета с id '${coinId}'.`);
        }
    }
    else {
        handCoins = player.handCoins;
    }
    if ((G.mode === GameModeNames.Multiplayer && !IsCoin(publicBoardCoin) && publicBoardCoin !== null
        && privateBoardCoin !== undefined && IsCoin(privateBoardCoin))
        || (G.mode === GameModeNames.Basic && IsCoin(publicBoardCoin))) {
        const tempId = handCoins.indexOf(null);
        if (IsCoin(publicBoardCoin)) {
            handCoins[tempId] = publicBoardCoin;
        }
        else {
            if (privateBoardCoin !== undefined && IsCoin(privateBoardCoin)) {
                handCoins[tempId] = privateBoardCoin;
            }
        }
        if (G.mode === GameModeNames.Multiplayer) {
            player.handCoins[tempId] = {};
            privatePlayer.boardCoins[coinId] = null;
        }
        player.boardCoins[coinId] = null;
    }
    else if (player.selectedCoin !== null) {
        const tempSelectedId = player.selectedCoin, handCoin = handCoins[tempSelectedId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует нужная монета с id '${tempSelectedId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может отсутствовать монета с id '${coinId}'.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            privatePlayer.boardCoins[coinId] = handCoin;
            player.boardCoins[coinId] = {};
            player.handCoins[tempSelectedId] = null;
        }
        else {
            if ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `0`) {
                ChangeIsOpenedCoinStatus(handCoin, true);
            }
            player.boardCoins[coinId] = handCoin;
        }
        handCoins[tempSelectedId] = null;
        player.selectedCoin = null;
    }
    else {
        throw new Error(`Неразрешённый мув - это должно проверяться в MoveValidator.`);
    }
};
/**
 * <h3>Выбор монеты для улучшения.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const ClickCoinToUpgradeMove = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, CommonStageNames.ClickCoinToUpgrade, CoinMoveNames.ClickCoinToUpgradeMove, {
        coinId,
        type,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, myPlayerID: playerID, ...rest });
    UpgradeCoinActions({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};
/**
 * <h3>Выбор конкретной монеты для улучшения.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по конкретной монете.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const PickConcreteCoinToUpgradeMove = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, CommonStageNames.PickConcreteCoinToUpgrade, CoinMoveNames.PickConcreteCoinToUpgradeMove, {
        coinId,
        type,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinActions({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};
/**
 * <h3>Выбор монеты в руке для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете в руке.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandCoinMove = ({ G, ctx, playerID, ...rest }, coinId) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, BidsDefaultStageNames.ClickHandCoin, CoinMoveNames.ClickHandCoinMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    player.selectedCoin = coinId;
};
/**
 * <h3>Выбор монеты в руке для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете в руке.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandCoinUlineMove = ({ G, ctx, playerID, ...rest }, coinId) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, BidUlineDefaultStageNames.ClickHandCoinUline, CoinMoveNames.ClickHandCoinUlineMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
    }
    let handCoin;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoin = privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке отсутствует монета с id '${coinId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может отсутствовать монета с id '${coinId}'.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
        }
        if (IsCoin(handCoin) && !handCoin.isOpened) {
            ChangeIsOpenedCoinStatus(handCoin, true);
        }
        privatePlayer.boardCoins[G.currentTavern + 1] = handCoin;
    }
    else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует монета с id '${coinId}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${coinId}'.`);
        }
        if (IsCoin(handCoin) && !handCoin.isOpened) {
            ChangeIsOpenedCoinStatus(handCoin, true);
        }
    }
    player.boardCoins[G.currentTavern + 1] = handCoin;
    if (G.mode === GameModeNames.Multiplayer) {
        privatePlayer.handCoins[coinId] = null;
    }
    player.handCoins[coinId] = null;
};
/**
 * <h3>Выбор монеты в руке для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете в руке.</li>
 * </ol>
 *
 * @param context
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandTradingCoinUlineMove = ({ G, ctx, playerID, ...rest }, coinId) => {
    const isValidMove = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest }, TavernsResolutionStageNames.ClickHandTradingCoinUline, CoinMoveNames.ClickHandTradingCoinUlineMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(playerID)], privatePlayer = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, playerID);
    }
    let handCoin;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoin = privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке отсутствует монета с id '${coinId}'.`);
        }
    }
    else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerID}' в руке отсутствует монета с id '${coinId}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${coinId}'.`);
        }
    }
    if (IsCoin(handCoin) && !handCoin.isOpened) {
        ChangeIsOpenedCoinStatus(handCoin, true);
    }
    const firstTradingBoardCoin = player.boardCoins[G.tavernsNum];
    if (firstTradingBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${playerID}' на поле отсутствует нужная монета с id '${G.tavernsNum}'.`);
    }
    if (firstTradingBoardCoin === null) {
        if (G.mode === GameModeNames.Multiplayer) {
            if (handCoin === null) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может отсутствовать монета с id '${coinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            privatePlayer.boardCoins[G.tavernsNum] = handCoin;
        }
        player.boardCoins[G.tavernsNum] = handCoin;
    }
    else {
        if (G.mode === GameModeNames.Multiplayer) {
            if (handCoin === null) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может отсутствовать монета с id '${coinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            privatePlayer.boardCoins[G.tavernsNum + 1] = handCoin;
        }
        player.boardCoins[G.tavernsNum + 1] = handCoin;
    }
    if (G.mode === GameModeNames.Multiplayer) {
        privatePlayer.handCoins[coinId] = null;
    }
    player.handCoins[coinId] = null;
};
//# sourceMappingURL=CoinMoves.js.map