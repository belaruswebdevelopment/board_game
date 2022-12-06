import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { ErrorNames, GameModeNames, HeroBuffNames, HeroNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndPlaceYludPhase = ({ G, ctx, ...rest }) => {
    if (G.publicPlayersOrder.length) {
        if (G.mode === GameModeNames.Solo && G.tierToEnd === 0) {
            // TODO Check it!
            return true;
        }
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (!player.stack.length) {
            const yludIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, HeroBuffNames.EndTier));
            if (G.tierToEnd !== 0 && yludIndex === -1) {
                throw new Error(`У игрока отсутствует обязательная карта героя '${HeroNames.Ylud}'.`);
            }
            let nextPhase = true;
            if (yludIndex !== -1) {
                const yludPlayer = G.publicPlayers[yludIndex];
                if (yludPlayer === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, yludIndex);
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
 * <h3>Проверяет порядок хода при начале фазы 'Поместить Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Поместить Труд'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckPlaceYludOrder = ({ G, ctx, ...rest }) => {
    G.publicPlayersOrder = [];
    const yludIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, HeroBuffNames.EndTier));
    if (yludIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф '${HeroBuffNames.EndTier}'.`);
    }
    const player = G.publicPlayers[yludIndex];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, yludIndex);
    }
    const yludHeroCard = player.heroes.find((hero) => hero.name === HeroNames.Ylud);
    if (yludHeroCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}'.`);
    }
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
 * <h3>Проверяет необходимость завершения хода в фазе 'Поместить Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии в фазе 'Поместить Труд'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndPlaceYludTurn = ({ G, ctx, ...rest }) => EndTurnActions({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
/**
 * <h3>Действия при завершении фазы 'Поместить Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Поместить Труд'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const EndPlaceYludActions = ({ G, ctx, ...rest }) => {
    if (G.tierToEnd === 0) {
        RemoveThrudFromPlayerBoardAfterGameEnd({ G, ctx, ...rest });
    }
    G.publicPlayersOrder = [];
};
/**
 * <h3>Действия при завершении мува в фазе 'Поместить Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'Поместить Труд'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnPlaceYludMove = ({ G, ctx, ...rest }) => {
    StartOrEndActions({ G, ctx, myPlayerID: ctx.currentPlayer, ...rest });
};
/**
 * <h3>Действия при начале хода в фазе 'Поместить Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'Поместить Труд'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnPlaceYludTurnBegin = ({ G, ctx, events, ...rest }) => {
    if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, [StackData.placeYludHeroSoloBot()]);
    }
    else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, [StackData.placeYludHeroSoloBotAndvari()]);
    }
    else {
        AddActionsToStack({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest }, [StackData.placeYludHero()]);
    }
    DrawCurrentProfit({ G, ctx, myPlayerID: ctx.currentPlayer, events, ...rest });
};
//# sourceMappingURL=PlaceYludHooks.js.map