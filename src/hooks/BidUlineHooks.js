import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { OpenCurrentTavernClosedCoinsOnPlayerBoard } from "../helpers/CoinHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { BuffNames, ErrorNames, GameModeNames, HeroNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки Улина'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждой выкладке монеты на стол игрока в фазе 'Ставки Улина'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndBidUlinePhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        const ulinePlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EveryTurn));
        if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && ulinePlayerIndex !== -1) {
            const ulinePlayer = G.publicPlayers[ulinePlayerIndex];
            if (ulinePlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, ulinePlayerIndex);
            }
            if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
                const boardCoin = ulinePlayer.boardCoins[G.currentTavern + 1];
                if (boardCoin === undefined) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе отсутствует монета с id '${G.currentTavern + 1}' для выкладки при наличии героя '${HeroNames.Uline}'.`);
                }
                if (boardCoin !== null && !IsCoin(boardCoin)) {
                    throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' на столе не может быть закрыта монета с id '${G.currentTavern + 1}'.`);
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
 * @param G
 * @param ctx
 * @returns
 */
export const CheckBidUlineOrder = (G, ctx) => {
    OpenCurrentTavernClosedCoinsOnPlayerBoard(G, ctx);
    CheckPlayersBasicOrder(G, ctx);
};
/**
 * <h3>Действия при завершении фазы 'Ставки Улина'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Ставки Улина'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const EndBidUlineActions = (G) => {
    G.publicPlayersOrder = [];
};
//# sourceMappingURL=BidUlineHooks.js.map