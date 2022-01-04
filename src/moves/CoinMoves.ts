import { Move, Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { CheckAndStartUlineActionsOrContinue } from "../helpers/HeroHelpers";
import { AfterBasicPickCardActions } from "../helpers/MovesHelpers";
import { EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { IsValidMove, CoinUpgradeValidation } from "../MoveValidator";
import { IConfig } from "../typescript/action_interfaces";
import { CoinType } from "../typescript/coin_types";
import { Phases, Stages, HeroNames, SuitNames } from "../typescript/enums";
import { MyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

// todo Add logging
// todo Add Place coins async
/**
 * <h3>Выбор монеты для выкладки монет в кошель при наличии героя Улина по артефакту Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При клике по монете.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinId: number): void => {
    EndActionFromStackAndAddNew(G, ctx, [], coinId);
};

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
export const ClickBoardCoinMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinId: number): string | void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        isValidMove: boolean = IsValidMove({ objId: coinId, range: [0, player.boardCoins.length] });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (player.boardCoins[coinId] !== null) {
        const tempId: number = player.handCoins.indexOf(null);
        player.handCoins[tempId] = player.boardCoins[coinId];
        player.boardCoins[coinId] = null;
    } else if (player.selectedCoin !== undefined) {
        const tempId: number = player.selectedCoin;
        player.boardCoins[coinId] = player.handCoins[tempId];
        player.handCoins[tempId] = null;
        player.selectedCoin = undefined;
        if (ctx.phase === Phases.PlaceCoinsUline) {
            ctx.events?.setPhase(Phases.PickCards);
        } else if ((ctx.activePlayers?.[ctx.currentPlayer]) === Stages.PlaceTradingCoinsUline) {
            G.actionsNum--;
            AfterBasicPickCardActions(G, ctx, false);
        } else {
            const isEveryPlayersHandCoinsEmpty: boolean = G.publicPlayers
                .filter((player: IPublicPlayer): boolean => player.buffs.everyTurn !== HeroNames.Uline)
                .every((player: IPublicPlayer): boolean => player.handCoins
                    .every((coin: CoinType): boolean => coin === null));
            if (isEveryPlayersHandCoinsEmpty) {
                if (CheckAndStartUlineActionsOrContinue(G, ctx) === Phases.PlaceCoinsUline) {
                    ctx.events?.setPhase(Phases.PlaceCoinsUline);
                } else {
                    ctx.events?.setPhase(Phases.PickCards);
                }
            } else {
                if (player.handCoins.every((coin: CoinType): boolean => coin === null)) {
                    ctx.events?.endTurn();
                }
            }
        }
    } else {
        return INVALID_MOVE;
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
export const ClickCoinToUpgradeMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinId: number, type: string,
    isInitial: boolean): string | void => {
    const isValidMove: boolean = CoinUpgradeValidation(G, ctx, coinId, type);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    if (Object.values(G.distinctions).length) {
        // todo Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionExplorer: boolean = G.distinctions[SuitNames.EXPLORER] !== undefined;
        if (isDistinctionExplorer) {
            G.distinctions[SuitNames.EXPLORER] = undefined;
        } else if (!isDistinctionExplorer && G.distinctions[SuitNames.WARRIOR] !== undefined) {
            G.distinctions[SuitNames.WARRIOR] = undefined;
        }
    }
    EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
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
export const ClickHandCoinMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinId: number): string | void => {
    const isValidMove: boolean = IsValidMove({
        obj: G.publicPlayers[Number(ctx.currentPlayer)].handCoins[coinId],
        objId: coinId,
        range: [0, G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length]
    });
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin = coinId;
};

/**
 * <h3>Выбор монеты для улучшения по артефакту Vidofnir Vedrfolnir.</h3>
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
export const UpgradeCoinVidofnirVedrfolnirMove: Move<MyGameState> = (G: MyGameState, ctx: Ctx, coinId: number,
    type: string, isInitial: boolean): string | void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    const isValidMove: boolean = CoinUpgradeValidation(G, ctx, coinId, type) && config?.coinId !== coinId;
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    EndActionFromStackAndAddNew(G, ctx, [], coinId, type, isInitial);
};
