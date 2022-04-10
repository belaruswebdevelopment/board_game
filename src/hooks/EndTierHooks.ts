import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CheckEndGameLastActions, ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { BuffNames, HeroNames } from "../typescript/enums";
import type { IHeroCard, IMyGameState, INext, IPublicPlayer, PlayerCardsType, SuitTypes } from "../typescript/interfaces";

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
export const CheckEndEndTierPhase = (G: IMyGameState, ctx: Ctx): boolean | INext | void => {
    if (G.publicPlayersOrder.length) {
        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        if (!player.stack.length && !player.actionsNum) {
            const yludIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.EndTier));
            if (G.tierToEnd !== 0 && yludIndex === -1) {
                throw new Error(`У игрока отсутствует обязательная карта героя '${HeroNames.Ylud}'.`);
            }
            let nextPhase = true;
            if (yludIndex !== -1) {
                const yludPlayer: IPublicPlayer | undefined = G.publicPlayers[yludIndex];
                if (yludPlayer === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок с картой героя '${HeroNames.Ylud}'.`);
                }
                const index: number = Object.values(yludPlayer.cards).flat()
                    .findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Ylud);
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
export const CheckEndTierOrder = (G: IMyGameState): void => {
    G.publicPlayersOrder = [];
    const yludIndex: number = Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.EndTier}'.`);
    }
    const player: IPublicPlayer | undefined = G.publicPlayers[yludIndex];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${yludIndex}' с обязательным бафом '${BuffNames.EndTier}'.`);
    }
    const yludHeroCard: IHeroCard | undefined =
        player.heroes.find((hero: IHeroCard): boolean => hero.name === HeroNames.Ylud);
    if (yludHeroCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}'.`);
    }
    player.pickedCard = yludHeroCard;
    if (G.tierToEnd === 0) {
        const cards: PlayerCardsType[] = Object.values(player.cards).flat(),
            index: number =
                cards.findIndex((card: PlayerCardsType): boolean => card.name === HeroNames.Ylud);
        if (index !== -1) {
            const yludCard: PlayerCardsType | undefined = cards[index];
            if (yludCard === undefined) {
                throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}' с id '${index}'.`);
            }
            const suit: SuitTypes | null = yludCard.suit;
            if (suit !== null) {
                const yludCardIndex: number =
                    player.cards[suit].findIndex((card: PlayerCardsType): boolean =>
                        card.name === HeroNames.Ylud);
                player.cards[suit].splice(yludCardIndex, 1);
            }
        }
    }
    G.publicPlayersOrder.push(String(yludIndex));
};

export const CheckEndEndTierTurn = (G: IMyGameState, ctx: Ctx): boolean | void => {
    return EndTurnActions(G, ctx);
};

export const EndEndTierActions = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = null;
    if (G.tierToEnd === 0) {
        RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
    }
    G.publicPlayersOrder = [];
};

export const OnEndTierMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
};
export const OnEndTierTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
};

export const OnEndTierTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.placeYludHero()]);
    DrawCurrentProfit(G, ctx);
};
