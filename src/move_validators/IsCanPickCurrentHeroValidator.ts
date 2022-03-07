import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import type { IConditions, IHeroCard, IMyGameState, IPublicPlayer, IValidatorsConfig, PlayerCardsType, SuitTypes } from "../typescript/interfaces";

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
    const hero: IHeroCard | undefined = G.heroes[id];
    if (hero !== undefined) {
        const validators: IValidatorsConfig | undefined = hero.validators,
            cardsToDiscard: PlayerCardsType[] = [];
        let isValidMove = false;
        if (validators?.discardCard !== undefined) {
            let suit: SuitTypes;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    if (validators.discardCard.suit !== suit) {
                        const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
                        if (player !== undefined) {
                            const last: number = player.cards[suit].length - 1,
                                card: PlayerCardsType | undefined = player.cards[suit][last];
                            if (card !== undefined) {
                                if (last >= 0 && !IsHeroCard(card)) {
                                    cardsToDiscard.push(card);
                                }
                            } else {
                                throw new Error(`В массиве карт фракции ${suit} отсутствует последняя карта ${last}.`);
                            }
                        } else {
                            throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                        }
                    }
                }
            }
            isValidMove = cardsToDiscard.length >= (validators.discardCard.number ?? 1);
        }
        return isValidMove;
    } else {
        throw new Error(`Не существует карта героя ${id}.`);
    }
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
    const hero: IHeroCard | undefined = G.heroes[id];
    if (hero !== undefined) {
        const conditions: IConditions | undefined = hero.validators?.conditions;
        let isValidMove = false;
        for (const condition in conditions) {
            if (Object.prototype.hasOwnProperty.call(conditions, condition)) {
                if (condition === `suitCountMin`) {
                    let ranks = 0;
                    for (const key in conditions[condition]) {
                        if (Object.prototype.hasOwnProperty.call(conditions[condition], key)) {
                            if (key === `suit`) {
                                const player: IPublicPlayer | undefined =
                                    G.publicPlayers[Number(ctx.currentPlayer)];
                                if (player !== undefined) {
                                    ranks = player.cards[conditions[condition][key]].reduce(TotalRank,
                                        0);
                                } else {
                                    throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                                }
                            } else if (key === `value`) {
                                isValidMove = ranks >= conditions[condition][key];
                            }
                        }
                    }
                }
            }
        }
        return isValidMove;
    } else {
        throw new Error(`Не существует карта героя ${id}.`);
    }
};
