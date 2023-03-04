import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { OpenCurrentTavernClosedCoinsOnPlayerBoard } from "../helpers/CoinHelpers";
import { CheckPlayersBasicOrder } from "../helpers/PlayerHelpers";
import { AssertPlayerCoinId } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { ErrorNames, GameModeNames, HeroBuffNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, PublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки Улина'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждой выкладке монеты на стол игрока в фазе 'Ставки Улина'.</li>
 * </ol>
 *
 * @param context
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndBidUlinePhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<boolean> => {
    if (G.publicPlayersOrder.length) {
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                ctx.currentPlayer);
        }
        const ulinePlayerIndex: number =
            Object.values(G.publicPlayers).findIndex((player: PublicPlayer, index: number): boolean =>
                CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest },
                    HeroBuffNames.EveryTurn));
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && ulinePlayerIndex !== - 1) {
            const ulinePlayer: CanBeUndefType<PublicPlayer> = G.publicPlayers[ulinePlayerIndex];
            if (ulinePlayer === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    ulinePlayerIndex);
            }
            if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
                const coinId: number = G.currentTavern + 1;
                AssertPlayerCoinId(coinId);
                const boardCoin: PublicPlayerCoinType = ulinePlayer.boardCoins[coinId];
                if (boardCoin !== null && !IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может быть закрыта монета с id '${coinId}'.`);
                }
                return IsCoin(boardCoin);
            }
        }
    }
};

/**
 * <h3>Проверяет порядок хода при начале фазы 'Ставки Улина'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Ставки Улина'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const CheckBidUlineOrder = ({ G, ctx, ...rest }: FnContext): void => {
    OpenCurrentTavernClosedCoinsOnPlayerBoard({ G, ctx, ...rest });
    CheckPlayersBasicOrder({ G, ctx, ...rest });
};

/**
 * <h3>Действия при завершении фазы 'Ставки Улина'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Ставки Улина'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const EndBidUlineActions = ({ G }: FnContext): void => {
    G.publicPlayersOrder = [];
};
