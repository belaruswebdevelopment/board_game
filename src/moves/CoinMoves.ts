import { INVALID_MOVE } from "boardgame.io/core";
import { ChangeIsOpenedCoinStatus } from "../Coin";
import { ThrowMyError } from "../Error";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { AssertPlayerCoinId } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { IsValidMove } from "../MoveValidator";
import { BidsDefaultStageNames, BidUlineDefaultStageNames, CoinMoveNames, CoinTypeNames, CommonStageNames, ErrorNames, GameModeNames, TavernsResolutionStageNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, InvalidMoveType, Move, MyFnContext, PlayerCoinIdType, PlayerHandCoinsType, PrivatePlayer, PublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";

// Move all coinId to MarketCoinId types?!
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
export const ClickBoardCoinMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    // TODO Add Place coins async
    AssertPlayerCoinId(coinId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        BidsDefaultStageNames.ClickBoardCoin, CoinMoveNames.ClickBoardCoinMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(playerID)],
        privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            playerID);
    }
    const publicBoardCoin: PublicPlayerCoinType = player.boardCoins[coinId];
    let handCoins: PlayerHandCoinsType,
        privateBoardCoin: CanBeUndefType<PublicPlayerCoinType>;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
        privateBoardCoin = privatePlayer.boardCoins[coinId];
    } else {
        handCoins = player.handCoins;
    }
    if ((G.mode === GameModeNames.Multiplayer && !IsCoin(publicBoardCoin) && publicBoardCoin !== null
        && privateBoardCoin !== undefined && IsCoin(privateBoardCoin))
        || (G.mode === GameModeNames.Basic && IsCoin(publicBoardCoin))) {
        const tempId: number = handCoins.indexOf(null);
        AssertPlayerCoinId(tempId);
        if (IsCoin(publicBoardCoin)) {
            handCoins[tempId] = publicBoardCoin;
        } else {
            if (privateBoardCoin !== undefined && IsCoin(privateBoardCoin)) {
                handCoins[tempId] = privateBoardCoin;
            }
        }
        if (G.mode === GameModeNames.Multiplayer) {
            player.handCoins[tempId] = {};
            privatePlayer.boardCoins[coinId] = null;
        }
        player.boardCoins[coinId] = null;
    } else if (player.selectedCoin !== null) {
        const tempSelectedId: PlayerCoinIdType = player.selectedCoin,
            handCoin: PublicPlayerCoinType = handCoins[tempSelectedId];
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
        } else {
            if ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `0`) {
                ChangeIsOpenedCoinStatus(handCoin, true);
            }
            player.boardCoins[coinId] = handCoin;
        }
        handCoins[tempSelectedId] = null;
        player.selectedCoin = null;
    } else {
        throw new Error(`Неразрешённый мув - это должно проверяться в MoveValidator.`);
    }
};

// TODO type: CoinTypeNames => string and asserts it value if no other strings can be valid in moves!?
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
export const ClickCoinToUpgradeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number,
    type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    AssertPlayerCoinId(coinId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.ClickCoinToUpgrade, CoinMoveNames.ClickCoinToUpgradeMove, {
        coinId,
        type,
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded({ G, ctx, myPlayerID: playerID, ...rest });
    UpgradeCoinActions({ G, ctx, myPlayerID: playerID, ...rest }, coinId, type);
};

// TODO type: CoinTypeNames => string and asserts it value if no other strings can be valid in moves!?
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
export const PickConcreteCoinToUpgradeMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    coinId: number, type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    AssertPlayerCoinId(coinId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        CommonStageNames.PickConcreteCoinToUpgrade, CoinMoveNames.PickConcreteCoinToUpgradeMove, {
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
export const ClickHandCoinMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    AssertPlayerCoinId(coinId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        BidsDefaultStageNames.ClickHandCoin, CoinMoveNames.ClickHandCoinMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
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
export const ClickHandCoinUlineMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    AssertPlayerCoinId(coinId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        BidUlineDefaultStageNames.ClickHandCoinUline, CoinMoveNames.ClickHandCoinUlineMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(playerID)],
        privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            playerID);
    }
    let handCoin: PublicPlayerCoinType;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoin = privatePlayer.handCoins[coinId];
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
    } else {
        handCoin = player.handCoins[coinId];
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
export const ClickHandTradingCoinUlineMove: Move = ({ G, ctx, playerID, ...rest }: MyFnContext,
    coinId: number): CanBeVoidType<InvalidMoveType> => {
    AssertPlayerCoinId(coinId);
    const isValidMove: boolean = IsValidMove({ G, ctx, myPlayerID: playerID, ...rest },
        TavernsResolutionStageNames.ClickHandTradingCoinUline,
        CoinMoveNames.ClickHandTradingCoinUlineMove, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(playerID)],
        privatePlayer: CanBeUndefType<PrivatePlayer> = G.players[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
        );
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined,
            playerID);
    }
    let handCoin: PublicPlayerCoinType;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoin = privatePlayer.handCoins[coinId];
    } else {
        handCoin = player.handCoins[coinId];
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerID}' в руке не может быть закрыта монета с id '${coinId}'.`);
        }
    }
    if (IsCoin(handCoin) && !handCoin.isOpened) {
        ChangeIsOpenedCoinStatus(handCoin, true);
    }
    const firstTradingBoardCoin: PublicPlayerCoinType = player.boardCoins[G.tavernsNum];
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
    } else {
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
