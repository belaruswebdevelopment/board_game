import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { UpgradeCoinActions } from "../helpers/ActionHelpers";
import { IsMultiplayer } from "../helpers/MultiplayerHelpers";
import { IsValidMove } from "../MoveValidator";
import { CoinTypes, Stages, SuitNames } from "../typescript/enums";
import type { CoinType, IMyGameState, IPlayer, IPublicPlayer, PublicPlayerBoardCoinTypes } from "../typescript/interfaces";

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
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default2, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const publicBoardCoin: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[coinId];
    if (publicBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${coinId}.`);
    }
    let handCoins: CoinType[];
    let privateBoardCoin: CoinType | undefined;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoins = privatePlayer.handCoins;
        privateBoardCoin = privatePlayer.boardCoins[coinId];
        if (privateBoardCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока на столе отсутствует монета ${coinId}.`);
        }
    } else {
        handCoins = player.handCoins;
    }
    if ((multiplayer && !IsCoin(publicBoardCoin) && publicBoardCoin !== null && IsCoin(privateBoardCoin))
        || (!multiplayer && IsCoin(publicBoardCoin))) {
        const tempId: number = handCoins.indexOf(null);
        if (IsCoin(publicBoardCoin)) {
            handCoins[tempId] = publicBoardCoin;
        } else {
            if (IsCoin(privateBoardCoin)) {
                handCoins[tempId] = privateBoardCoin;
            }
        }
        player.boardCoins[coinId] = null;
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins[coinId] = null;
        }
    } else if (player.selectedCoin !== null) {
        const tempSelectedId: number = player.selectedCoin,
            handCoin: CoinType | undefined = handCoins[tempSelectedId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует нужная монета ${tempSelectedId}.`);
        }
        if (multiplayer && privatePlayer !== undefined) {
            player.boardCoins[coinId] = {};
            privatePlayer.boardCoins[coinId] = handCoin;
        } else {
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
 * @param isInitial Является ли базовой.
 * @returns
 */
export const ClickCoinToUpgradeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number, type: CoinTypes,
    isInitial: boolean): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.UpgradeCoin, {
            coinId,
            type,
            isInitial,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    // todo Move to distinction phase hook?
    if (Object.values(G.distinctions).length) {
        // TODO Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionWarrior: boolean = G.distinctions[SuitNames.WARRIOR] !== undefined;
        if (isDistinctionWarrior) {
            G.distinctions[SuitNames.WARRIOR] = undefined;
        } else if (!isDistinctionWarrior && G.distinctions[SuitNames.EXPLORER] !== undefined) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
        }
    }
    UpgradeCoinActions(G, ctx, coinId, type, isInitial);
};

export const ClickConcreteCoinToUpgradeMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, coinId: number,
    type: CoinTypes, isInitial: boolean): string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.PickConcreteCoinToUpgrade, {
            coinId,
            type,
            isInitial,
        });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    UpgradeCoinActions(G, ctx, coinId, type, isInitial);
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
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
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
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default1, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoin: CoinType | undefined;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoin = privatePlayer?.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока в руке отсутствует монета ${coinId}.`);
        }
    } else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
        }
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.boardCoins[G.currentTavern + 1] = handCoin;
    }
    player.boardCoins[G.currentTavern + 1] = handCoin;
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.handCoins[coinId] = null;
    } else {
        player.handCoins[coinId] = null;
    }
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
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.PlaceTradingCoinsUline, coinId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const multiplayer = IsMultiplayer(G),
        player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)],
        privatePlayer: IPlayer | undefined = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    let handCoin: CoinType | undefined;
    if (multiplayer) {
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок.`);
        }
        handCoin = privatePlayer.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет приватного игрока в руке отсутствует монета ${coinId}.`);
        }
    } else {
        handCoin = player.handCoins[coinId];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет игрока в руке отсутствует монета ${coinId}.`);
        }
    }
    const firstTradingBoardCoin: PublicPlayerBoardCoinTypes | undefined = player.boardCoins[G.tavernsNum];
    if (firstTradingBoardCoin === undefined) {
        throw new Error(`В массиве монет игрока на поле отсутствует нужная монета ${G.tavernsNum}.`);
    }
    if (firstTradingBoardCoin === null) {
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins[G.tavernsNum] = handCoin;
        }
        player.boardCoins[G.tavernsNum] = handCoin;
    } else {
        if (multiplayer && privatePlayer !== undefined) {
            privatePlayer.boardCoins[G.tavernsNum + 1] = handCoin;
        }
        player.boardCoins[G.tavernsNum + 1] = handCoin;
    }
    if (multiplayer && privatePlayer !== undefined) {
        privatePlayer.handCoins[coinId] = null;
    } else {
        player.handCoins[coinId] = null;
    }
};
