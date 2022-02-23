import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddEndTierActionsToStack } from "../helpers/HeroHelpers";
import { BuffNames, HeroNames } from "../typescript/enums";
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
        const yludIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.endTier !== undefined)));
        if (yludIndex !== -1 || (G.tierToEnd === 0 && yludIndex === -1)) {
            let nextPhase = true;
            if (yludIndex !== -1) {
                const index = Object.values(G.publicPlayers[yludIndex].cards).flat()
                    .findIndex((card) => card.name === HeroNames.Ylud);
                if (index === -1) {
                    nextPhase = false;
                }
            }
            if (nextPhase) {
                return CheckEndGameLastActions(G);
            }
        }
        else {
            throw new Error(`У игрока отсутствует обязательная карта героя ${HeroNames.Ylud}.`);
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
    const yludIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.endTier !== undefined)));
    if (yludIndex !== -1) {
        if (G.tierToEnd === 0) {
            const player = G.publicPlayers[yludIndex], cards = Object.values(player.cards).flat(), index = cards.findIndex((card) => card.name === HeroNames.Ylud);
            if (index !== -1) {
                const suit = cards[index].suit;
                if (suit !== null) {
                    const yludCardIndex = player.cards[suit].findIndex((card) => card.name === HeroNames.Ylud);
                    player.cards[suit].splice(yludCardIndex, 1);
                }
            }
        }
        G.publicPlayersOrder.push(String(yludIndex));
    }
    else {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.EndTier}.`);
    }
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