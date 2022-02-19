import { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { isHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { IMyGameState, IPublicPlayer, IValidatorsConfig, PlayerCardsType, SuitTypes } from "../typescript/interfaces";

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
    const validators: IValidatorsConfig | undefined = G.heroes[id].validators,
        cardsToDiscard: PlayerCardsType[] = [];
    let isValidMove = false;
    if (validators !== undefined) {
        if (validators.discardCard !== undefined) {
            let suit: SuitTypes;
            for (suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    if (validators.discardCard.suit !== suit) {
                        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
                            last: number = player.cards[suit].length - 1;
                        if (last >= 0 && !isHeroCard(player.cards[suit][last])) {
                            cardsToDiscard.push(player.cards[suit][last]);
                        }
                    }
                }
            }
            isValidMove = cardsToDiscard.length >= (validators.discardCard.number ?? 1);
        }
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
    const validators: IValidatorsConfig | undefined = G.heroes[id].validators;
    let isValidMove = false;
    if (validators !== undefined) {
        for (const condition in validators.conditions) {
            if (Object.prototype.hasOwnProperty.call(validators.conditions, condition)) {
                if (condition === `suitCountMin`) {
                    let ranks = 0;
                    for (const key in validators.conditions[condition]) {
                        if (Object.prototype.hasOwnProperty.call(validators.conditions[condition], key)) {
                            if (key === `suit`) {
                                ranks = G.publicPlayers[Number(ctx.currentPlayer)]
                                    .cards[validators.conditions[condition][key]]
                                    .reduce(TotalRank, 0);
                            } else if (key === `value`) {
                                isValidMove = ranks >= validators.conditions[condition][key];
                            }
                        }
                    }
                }
            }
        }
    }
    return isValidMove;
};
