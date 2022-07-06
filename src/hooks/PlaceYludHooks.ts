import type { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { DrawCurrentProfit } from "../helpers/ActionHelpers";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { ClearPlayerPickedCard, EndTurnActions, RemoveThrudFromPlayerBoardAfterGameEnd, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { BuffNames, ErrorNames, HeroNames } from "../typescript/enums";
import type { CanBeUndef, IHeroCard, IMyGameState, IPublicPlayer, PlayerCardTypes, SuitTypes } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость завершения фазы 'Ставки'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с монеткой в фазе 'Ставки'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckEndPlaceYludPhase = (G: IMyGameState, ctx: Ctx): true | void => {
    if (G.publicPlayersOrder.length) {
        if (G.solo && G.tierToEnd === 0) {
            // TODO Check it!
            return true;
        }
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
        }
        if (!player.stack.length) {
            const yludIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
                    CheckPlayerHasBuff(player, BuffNames.EndTier));
            if (G.tierToEnd !== 0 && yludIndex === -1) {
                throw new Error(`У игрока отсутствует обязательная карта героя '${HeroNames.Ylud}'.`);
            }
            let nextPhase = true;
            if (yludIndex !== -1) {
                const yludPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[yludIndex];
                if (yludPlayer === undefined) {
                    throw new Error(`В массиве игроков отсутствует игрок с картой героя '${HeroNames.Ylud}'.`);
                }
                const index: number = Object.values(yludPlayer.cards).flat()
                    .findIndex((card: PlayerCardTypes): boolean => card.name === HeroNames.Ylud);
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
 */
export const CheckPlaceYludOrder = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayersOrder = [];
    const yludIndex: number = Object.values(G.publicPlayers).findIndex((player: IPublicPlayer): boolean =>
        CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex === -1) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.EndTier}'.`);
    }
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[yludIndex];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            yludIndex);
    }
    const yludHeroCard: CanBeUndef<IHeroCard> =
        player.heroes.find((hero: IHeroCard): boolean => hero.name === HeroNames.Ylud);
    if (yludHeroCard === undefined) {
        throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}'.`);
    }
    player.pickedCard = yludHeroCard;
    if (G.tierToEnd === 0) {
        const cards: PlayerCardTypes[] = Object.values(player.cards).flat(),
            index: number =
                cards.findIndex((card: PlayerCardTypes): boolean => card.name === HeroNames.Ylud);
        if (index !== -1) {
            const yludCard: CanBeUndef<PlayerCardTypes> = cards[index];
            if (yludCard === undefined) {
                throw new Error(`В массиве карт игрока с id '${yludIndex}' отсутствует карта героя '${HeroNames.Ylud}' с id '${index}'.`);
            }
            const suit: SuitTypes | null = yludCard.suit;
            if (suit !== null) {
                const yludCardIndex: number =
                    player.cards[suit].findIndex((card: PlayerCardTypes): boolean =>
                        card.name === HeroNames.Ylud);
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
 * @returns
 */
export const CheckEndPlaceYludTurn = (G: IMyGameState, ctx: Ctx): true | void => EndTurnActions(G, ctx);

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
export const EndPlaceYludActions = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    player.pickedCard = null;
    if (G.tierToEnd === 0) {
        RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
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
 */
export const OnPlaceYludMove = (G: IMyGameState, ctx: Ctx): void => {
    StartOrEndActions(G, ctx);
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
 */
export const OnPlaceYludTurnBegin = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStack(G, ctx, [StackData.placeYludHero()]);
    DrawCurrentProfit(G, ctx);
};

/**
 * <h3>Действия при завершении хода в фазе 'Поместить Труд'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'Поместить Труд'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const OnPlaceYludTurnEnd = (G: IMyGameState, ctx: Ctx): void => {
    ClearPlayerPickedCard(G, ctx);
};
