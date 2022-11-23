import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillEmptyCampCards } from "../helpers/CampHelpers";
import { MixUpCoinsInPlayerHands, ReturnCoinsToPlayerHands } from "../helpers/CoinHelpers";
import { CheckPlayersBasicOrder } from "../Player";
import { RefillTaverns } from "../Tavern";
import { ErrorNames, GameModeNames, HeroBuffNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монетой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndBidsPhase = ({ G, ctx, ...rest }) => {
    if (G.publicPlayersOrder.length && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]) {
        const isEveryPlayersHandCoinsEmpty = Object.values(G.publicPlayers).map((player) => player).every((player, playerIndex) => {
            if ((G.mode === GameModeNames.Solo && playerIndex === 1)
                || (G.mode === GameModeNames.SoloAndvari && playerIndex === 1)
                || (G.mode === GameModeNames.Multiplayer
                    && !CheckPlayerHasBuff({ G, ctx, playerID: String(playerIndex), ...rest }, HeroBuffNames.EveryTurn))) {
                const privatePlayer = G.players[playerIndex];
                if (privatePlayer === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerIndex);
                }
                return privatePlayer.handCoins.every((coin) => coin === null);
            }
            else if ((G.mode === GameModeNames.Solo && playerIndex === 0)
                || (G.mode === GameModeNames.SoloAndvari && playerIndex === 0)
                || (G.mode === GameModeNames.Basic
                    && !CheckPlayerHasBuff({ G, ctx, playerID: String(playerIndex), ...rest }, HeroBuffNames.EveryTurn))) {
                return player.handCoins.every((coin, coinIndex) => {
                    if (coin !== null && !IsCoin(coin)) {
                        throw new Error(`В массиве монет игрока с id '${playerIndex}' в руке не может быть закрыта монета с id '${coinIndex}'.`);
                    }
                    return coin === null;
                });
            }
            return true;
        });
        return isEveryPlayersHandCoinsEmpty;
    }
};
/**
 * <h3>Проверяет необходимость завершения хода в фазе 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndBidsTurn = ({ G, ctx, ...rest }) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    let handCoins;
    if ((G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`)
        || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)
        || G.mode === GameModeNames.Multiplayer) {
        handCoins = privatePlayer.handCoins;
    }
    else {
        handCoins = player.handCoins;
    }
    const isEveryCoinsInHandsNull = handCoins.every((coin, index) => {
        if (coin !== null && !IsCoin(coin)) {
            throw new Error(`В массиве монет игрока с id '${ctx.currentPlayer}' в руке не может быть закрыта монета с id '${index}'.`);
        }
        return coin === null;
    });
    if (isEveryCoinsInHandsNull) {
        return true;
    }
};
/**
 * <h3>Действия при завершении фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const EndBidsActions = ({ G }) => {
    G.publicPlayersOrder = [];
};
/**
 * <h3>Действия при начале фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const PreparationPhaseActions = ({ G, ctx, random, ...rest }) => {
    G.round++;
    G.currentTavern = 0;
    if (G.round !== 0) {
        ReturnCoinsToPlayerHands({ G, ctx, random, ...rest });
    }
    if (G.expansions.Thingvellir.active) {
        RefillEmptyCampCards({ G, ctx, random, ...rest });
    }
    RefillTaverns({ G, ctx, random, ...rest });
    MixUpCoinsInPlayerHands({ G, ctx, random, ...rest });
    CheckPlayersBasicOrder({ G, ctx, random, ...rest });
};
//# sourceMappingURL=BidsHooks.js.map