import { INVALID_MOVE } from "boardgame.io/core";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { EndWarriorOrExplorerDistinctionIfCoinUpgraded } from "../helpers/DistinctionAwardingHelpers";
import { IsValidMove } from "../MoveValidator";
import { CoinTypeNames, ErrorNames, GameModeNames, StageNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, Ctx, IMyGameState, InvalidMoveType, IPlayer, IPublicPlayer, Move, PublicPlayerCoinType } from "../typescript/interfaces";

// TODO Check moves with solo mode!
/**
 * <h3>Выбор места для монет на столе для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по месту для монет на столе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns
 */
export const ClickBoardCoinMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    // TODO Add Place coins async
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.default2, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    const publicBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[coinId];
    if (publicBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    let handCoins: PublicPlayerCoinType[],
        privateBoardCoin: CanBeUndefType<PublicPlayerCoinType>;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
        privateBoardCoin = privatePlayer.boardCoins[coinId];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${coinId}'.`);
        }
    } else {
        handCoins = player.handCoins;
    }
    if ((G.mode === GameModeNames.Multiplayer && !IsCoin(publicBoardCoin) && publicBoardCoin !== null
        && privateBoardCoin !== undefined && IsCoin(privateBoardCoin))
        || (G.mode === GameModeNames.Basic && IsCoin(publicBoardCoin))) {
        const tempId: number = handCoins.indexOf(null);
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
        const tempSelectedId: number = player.selectedCoin,
            handCoin: CanBeUndefType<PublicPlayerCoinType> = handCoins[tempSelectedId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует нужная монета с id '${tempSelectedId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
        }
        if (G.mode === GameModeNames.Multiplayer) {
            privatePlayer.boardCoins[coinId] = handCoin;
            player.boardCoins[coinId] = {};
            player.handCoins[tempSelectedId] = null;
        } else {
            if ((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && ctx.currentPlayer === `0`) {
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

/**
 * <h3>Выбор монеты для улучшения.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const ClickCoinToUpgradeMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.upgradeCoin, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndWarriorOrExplorerDistinctionIfCoinUpgraded(G);
    UpgradeCoinActions(G, ctx, coinId, type);
};

/**
 * <h3>Выбор конкретной монеты для улучшения.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по конкретной монете.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @returns
 */
export const ClickConcreteCoinToUpgradeMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypeNames): CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.pickConcreteCoinToUpgrade, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinActions(G, ctx, coinId, type);
};

/**
 * <h3>Выбор монеты в руке для выкладки монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете в руке.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandCoinMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
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
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandCoinUlineMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoin: CanBeUndefType<PublicPlayerCoinType>;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoin = privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
        }
        if (IsCoin(handCoin) && !handCoin.isOpened) {
            ChangeIsOpenedCoinStatus(handCoin, true);
        }
        privatePlayer.boardCoins[G.currentTavern + 1] = handCoin;
    } else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinId}'.`);
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
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @returns
 */
export const ClickHandTradingCoinUlineMove: Move<IMyGameState, Ctx> = (G: IMyGameState, ctx: Ctx, coinId: number):
    CanBeVoidType<InvalidMoveType> => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.placeTradingCoinsUline, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndefType<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoin: CanBeUndefType<PublicPlayerCoinType>;
    if (G.mode === GameModeNames.Multiplayer) {
        handCoin = privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
        }
    } else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${coinId}'.`);
        }
        if (handCoin !== null && !IsCoin(handCoin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${coinId}'.`);
        }
    }
    if (IsCoin(handCoin) && !handCoin.isOpened) {
        ChangeIsOpenedCoinStatus(handCoin, true);
    }
    const firstTradingBoardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[G.tavernsNum];
    if (firstTradingBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует нужная монета с id '${G.tavernsNum}'.`);
    }
    if (firstTradingBoardCoin === null) {
        if (G.mode === GameModeNames.Multiplayer) {
            if (handCoin === null) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            privatePlayer.boardCoins[G.tavernsNum] = handCoin;
        }
        player.boardCoins[G.tavernsNum] = handCoin;
    } else {
        if (G.mode === GameModeNames.Multiplayer) {
            if (handCoin === null) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
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
