import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
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
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
        }
        if (!player.stack.length && !player.actionsNum) {
            const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
            if (G.tierToEnd !== 0 && yludIndex === -1) {
                throw new Error(`У игрока отсутствует обязательная карта героя ${HeroNames.Ylud}.`);
            }
            let nextPhase = true;
            if (yludIndex !== -1) {
                const yludPlayer = G.publicPlayers[yludIndex];
                if (yludPlayer === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок с картой героя ${HeroNames.Ylud}.`);
                }
                const index = Object.values(yludPlayer.cards).flat()
                    .findIndex((card) => card.name === HeroNames.Ylud);
                if (index === -1) {
                    nextPhase = false;
                }
            }
            if (nextPhase) {
                return CheckEndGameLastActions(G);
            }
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
    const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.EndTier}.`);
    }
    if (G.tierToEnd === 0) {
        const player = G.publicPlayers[yludIndex];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с картой героя ${HeroNames.Ylud}.`);
        }
        const cards = Object.values(player.cards).flat(), index = cards.findIndex((card) => card.name === HeroNames.Ylud);
        if (index !== -1) {
            const yludCard = cards[index];
            if (yludCard === undefined) {
                throw new Error(`В массиве карт игрока отсутствует карта героя ${HeroNames.Ylud}.`);
            }
            const suit = yludCard.suit;
            if (suit !== null) {
                const yludCardIndex = player.cards[suit].findIndex((card) => card.name === HeroNames.Ylud);
                player.cards[suit].splice(yludCardIndex, 1);
            }
        }
    }
    G.publicPlayersOrder.push(String(yludIndex));
};
export const CheckEndEndTierTurn = (G, ctx) => {
    return EndTurnActions(G, ctx);
};
export const EndEndTierActions = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    player.pickedCard = null;
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