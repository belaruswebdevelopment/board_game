import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { UpgradeCoinActions } from "../helpers/CoinActionHelpers";
import { IsValidMove } from "../MoveValidator";
import { CoinTypeNames, ErrorNames, StageNames, SuitNames } from "../typescript/enums";
import type { CanBeUndef, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

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
export const ClickBoardCoinMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number): string | void => {
    // TODO Add Place coins async
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default2, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const publicBoardCoin: CanBeUndef<PublicPlayerCoinTypes> = player.boardCoins[coinId];
    if (publicBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует нужная монета с id '${coinId}'.`);
    }
    let handCoins: PublicPlayerCoinTypes[],
        privateBoardCoin: CanBeUndef<PublicPlayerCoinTypes>;
    if (G.multiplayer) {
        handCoins = privatePlayer.handCoins;
        privateBoardCoin = privatePlayer.boardCoins[coinId];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${coinId}'.`);
        }
    } else {
        handCoins = player.handCoins;
    }
    if ((G.multiplayer && !IsCoin(publicBoardCoin) && publicBoardCoin !== null && privateBoardCoin !== undefined
        && IsCoin(privateBoardCoin)) || (!G.multiplayer && IsCoin(publicBoardCoin))) {
        const tempId: number = handCoins.indexOf(null);
        if (IsCoin(publicBoardCoin)) {
            if (G.solo) {
                ChangeIsOpenedCoinStatus(publicBoardCoin, false);
            }
            handCoins[tempId] = publicBoardCoin;
        } else {
            if (privateBoardCoin !== undefined && IsCoin(privateBoardCoin)) {
                handCoins[tempId] = privateBoardCoin;
            }
        }
        if (G.multiplayer) {
            player.handCoins[tempId] = {};
            privatePlayer.boardCoins[coinId] = null;
        }
        player.boardCoins[coinId] = null;
    } else if (player.selectedCoin !== null) {
        const tempSelectedId: number = player.selectedCoin,
            handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[tempSelectedId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке отсутствует нужная монета с id '${tempSelectedId}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
        }
        if (!IsCoin(handCoin)) {
            throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
        }
        if (G.multiplayer) {
            privatePlayer.boardCoins[coinId] = handCoin;
            player.boardCoins[coinId] = {};
            player.handCoins[tempSelectedId] = null;
        } else {
            if (G.solo) {
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
export const ClickCoinToUpgradeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypeNames): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.UpgradeCoin, {
            coinId,
            type,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // todo Move to distinction phase hook?
    if (Object.values(G.distinctions).length) {
        // TODO Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionWarrior: boolean = G.distinctions[SuitNames.Warrior] !== undefined;
        if (isDistinctionWarrior) {
            G.distinctions[SuitNames.Warrior] = undefined;
        } else if (!isDistinctionWarrior && G.distinctions[SuitNames.Explorer] !== undefined) {
            G.distinctions[SuitNames.Explorer] = undefined;
        }
    }
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
export const ClickConcreteCoinToUpgradeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypeNames): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PickConcreteCoinToUpgrade, {
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
export const ClickHandCoinMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
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
export const ClickHandCoinUlineMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number):
    string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoin: CanBeUndef<PublicPlayerCoinTypes>;
    if (G.multiplayer) {
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
    if (G.multiplayer) {
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
export const ClickHandTradingCoinUlineMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number):
    string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, StageNames.PlaceTradingCoinsUline, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    let handCoin: CanBeUndef<PublicPlayerCoinTypes>;
    if (G.multiplayer) {
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
    const firstTradingBoardCoin: CanBeUndef<PublicPlayerCoinTypes> = player.boardCoins[G.tavernsNum];
    if (firstTradingBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на поле отсутствует нужная монета с id '${G.tavernsNum}'.`);
    }
    if (firstTradingBoardCoin === null) {
        if (G.multiplayer) {
            if (handCoin === null) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            if (IsCoin(handCoin) && !handCoin.isOpened) {
                ChangeIsOpenedCoinStatus(handCoin, true);
            }
            privatePlayer.boardCoins[G.tavernsNum] = handCoin;
        }
        if (IsCoin(handCoin) && !handCoin.isOpened) {
            ChangeIsOpenedCoinStatus(handCoin, true);
        }
        player.boardCoins[G.tavernsNum] = handCoin;
    } else {
        if (G.multiplayer) {
            if (handCoin === null) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может отсутствовать монета с id '${coinId}'.`);
            }
            if (!IsCoin(handCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта для него монета с id '${coinId}'.`);
            }
            if (IsCoin(handCoin) && !handCoin.isOpened) {
                ChangeIsOpenedCoinStatus(handCoin, true);
            }
            privatePlayer.boardCoins[G.tavernsNum + 1] = handCoin;
        }
        if (IsCoin(handCoin) && !handCoin.isOpened) {
            ChangeIsOpenedCoinStatus(handCoin, true);
        }
        player.boardCoins[G.tavernsNum + 1] = handCoin;
    }
    if (G.multiplayer) {
        privatePlayer.handCoins[coinId] = null;
    }
    player.handCoins[coinId] = null;
};
