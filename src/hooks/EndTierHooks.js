import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { BuffNames, HeroNames } from "../typescript/enums";
// TODO Check `Ylud the Unpredictable Will be positioned at the end of Age 1, before the Troop; Evaluation, in the order of priority determined in point 4 of the game round.She will remain in this position until the end of the game.`
/**
 * <h3>Проверяет необходимость завершения фазы 'placeCoins'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'placeCoins'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndEndTierPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (!player.stack.length && !player.actionsNum) {
            const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
            if (G.tierToEnd !== 0 && yludIndex === -1) {
                throw new Error(`У игрока отсутствует обязательная карта героя '${HeroNames.Ylud}'.`);
            }
            let nextPhase = true;
            if (yludIndex !== -1) {
                const yludPlayer = G.publicPlayers[yludIndex];
                if (yludPlayer === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок с картой героя '${HeroNames.Ylud}'.`);
                }
                const index = Object.values(yludPlayer.cards).flat()
                    .findIndex((card) => card.name === HeroNames.Ylud);
                if (index === -1) {
                    nextPhase = false;
                }
            }
            if (nextPhase) {
                return true;
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
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.EndTier}'.`);
    }
    const player = G.publicPlayers[yludIndex];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${yludIndex}' с обязательным бафом '${BuffNames.EndTier}'.`);
    }
    const yludHeroCard = player.heroes.find((hero) => hero.name === HeroNames.Ylud);
    if (yludHeroCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}'.`);
    }
    player.pickedCard = yludHeroCard;
    if (G.tierToEnd === 0) {
        const cards = Object.values(player.cards).flat(), index = cards.findIndex((card) => card.name === HeroNames.Ylud);
        if (index !== -1) {
            const yludCard = cards[index];
            if (yludCard === undefined) {
                throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}' с id '${index}'.`);
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
/**
 * <h3>Проверяет необходимость завершения хода в фазе 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndEndTierTurn = (G, ctx) => EndTurnActions(G, ctx);
/**
 * <h3>Действия при завершении фазы 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const EndEndTierActions = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = null;
    if (G.tierToEnd === 0) {
        RemoveThrudFromPlayerBoardAfterGameEnd(G);
    }
    G.publicPlayersOrder = [];
};
/**
 * <h3>Действия при завершении мува в фазе 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnEndTierMove = (G, ctx) => {
    StartOrEndActions(G, ctx);
};
/**
 * <h3>Действия при начале хода в фазе 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnEndTierTurnBegin = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.placeYludHero()]);
    DrawCurrentProfit(G, ctx);
};
/**
 * <h3>Действия при завершении хода в фазе 'endTier'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'endTier'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnEndTierTurnEnd = (G, ctx) => {
    ClearPlayerPickedCard(G, ctx);
};
//# sourceMappingURL=EndTierHooks.js.map