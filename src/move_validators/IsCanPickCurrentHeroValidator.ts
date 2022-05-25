import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import type { CanBeUndef, IConditions, IHeroCard, IMyGameState, IPublicPlayer, IValidatorsConfig, PlayerCardTypes, SuitTypes } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с возможностью сброса карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность сброса карт с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param id Id героя.
 * @returns Можно ли пикнуть конкретного героя.
 */
export const IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator = (G: IMyGameState, ctx: Ctx, id: number):
    boolean => {
    const hero: CanBeUndef<IHeroCard> = G.heroes[id];
    if (hero === undefined) {
        throw new Error(`Не существует карта героя с id '${id}'.`);
    }
    const validators: CanBeUndef<IValidatorsConfig> = hero.validators,
        cardsToDiscard: PlayerCardTypes[] = [];
    let isValidMove = false;
    if (validators?.discardCard !== undefined) {
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (validators.discardCard.suit !== suit) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
                }
                const last: number = player.cards[suit].length - 1;
                if (last >= 0) {
                    const card: CanBeUndef<PlayerCardTypes> = player.cards[suit][last];
                    if (card === undefined) {
                        throw new Error(`В массиве карт фракции '${suit}' отсутствует последняя карта с id '${last}'.`);
                    }
                    if (!IsHeroCard(card)) {
                        cardsToDiscard.push(card);
                    }
                }
            }
        }
        isValidMove = cardsToDiscard.length >= (validators.discardCard.number ?? 1);
    }
    return isValidMove;
};

/**
 * <h3>Действия, связанные с выбором героев по определённым условиям.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, получаемых по определённым условиям.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param id Id героя.
 * @returns Можно ли пикнуть конкретного героя.
 */
export const IsCanPickHeroWithConditionsValidator = (G: IMyGameState, ctx: Ctx, id: number): boolean => {
    const hero: CanBeUndef<IHeroCard> = G.heroes[id];
    if (hero === undefined) {
        throw new Error(`Не существует карта героя с id '${id}'.`);
    }
    const conditions: CanBeUndef<IConditions> = hero.validators?.conditions;
    let isValidMove = false;
    for (const condition in conditions) {
        if (condition === `suitCountMin`) {
            let ranks = 0;
            for (const key in conditions[condition]) {
                if (key === `suit`) {
                    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
                    }
                    ranks = player.cards[conditions[condition][key]].reduce(TotalRank, 0);
                } else if (key === `value`) {
                    isValidMove = ranks >= conditions[condition][key];
                }
            }
        }
    }
    return isValidMove;
};
