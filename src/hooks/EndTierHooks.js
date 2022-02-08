import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddEndTierActionsToStack } from "../helpers/HeroHelpers";
import { HeroNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndEndTierPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length && !G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
        const yludIndex = G.publicPlayers.findIndex((player) => player.buffs.endTier === HeroNames.Ylud);
        if (yludIndex !== -1) {
            const index = Object.values(G.publicPlayers[yludIndex].cards).flat()
                .findIndex((card) => card.name === HeroNames.Ylud);
            if (index !== -1) {
                return CheckEndGameLastActions(G, ctx);
            }
        }
        else {
            // TODO Error logging buff Ylud must be
        }
    }
};
/**
 * <h3>Проверяет порядок хода при начале фазы 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'endTier'.</li>
 * </ol>
 *
 * @param G
 */
export const CheckEndTierOrder = (G) => {
    G.publicPlayersOrder = [];
    const yludIndex = G.publicPlayers.findIndex((player) => player.buffs.endTier === HeroNames.Ylud);
    if (G.tierToEnd === 0) {
        const cards = Object.values(G.publicPlayers[yludIndex].cards).flat(), index = cards.findIndex((card) => card.name === HeroNames.Ylud);
        if (index !== -1) {
            const suit = cards[index].suit;
            if (suit !== null) {
                const yludCardIndex = G.publicPlayers[yludIndex].cards[suit]
                    .findIndex((card) => card.name === HeroNames.Ylud);
                G.publicPlayers[yludIndex].cards[suit].splice(yludCardIndex, 1);
            }
        }
    }
    G.publicPlayersOrder.push(String(yludIndex));
};
export const CheckEndEndTierTurn = (G, ctx) => {
    return EndTurnActions(G, ctx);
};
export const EndEndTierActions = (G, ctx) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
    if (G.tierToEnd === 0) {
        RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
    }
    G.publicPlayersOrder = [];
};
export const OnEndTierMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
export const OnEndTierTurnEnd = (G, ctx) => {
    ClearPlayerPickedCard(G, ctx);
};
export const OnEndTierTurnBegin = (G, ctx) => {
    AddEndTierActionsToStack(G, ctx);
    DrawCurrentProfit(G, ctx);
};
//# sourceMappingURL=EndTierHooks.js.map