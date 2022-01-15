import { CheckEndGameLastActions } from "../helpers/GameHooksHelpers";
import { AddEndTierActionsToStack } from "../helpers/HeroHelpers";
import { DrawNames, HeroNames } from "../typescript/enums";
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
    const yludIndex = G.publicPlayers.findIndex((player) => player.buffs.endTier === DrawNames.Ylud);
    G.publicPlayersOrder.push(String(yludIndex));
};
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
    if (G.publicPlayersOrder.length) {
        const yludIndex = G.publicPlayers.findIndex((player) => player.buffs.endTier === DrawNames.Ylud);
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
export const EndEndTierActions = (G) => {
    G.publicPlayersOrder = [];
};
export const OnEndTierPhaseTurnBegin = (G, ctx) => AddEndTierActionsToStack(G, ctx);
//# sourceMappingURL=EndTierHooks.js.map