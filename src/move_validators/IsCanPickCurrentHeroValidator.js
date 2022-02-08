import { suitsConfig } from "../data/SuitData";
import { TotalRank } from "../helpers/ScoreHelpers";
import { RusCardTypes } from "../typescript/enums";
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
export const IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator = (G, ctx, id) => {
    var _a;
    const validators = G.heroes[id].validators, cardsToDiscard = [];
    let isValidMove = false;
    if (validators !== undefined) {
        if (validators.discardCard !== undefined) {
            for (const suit in suitsConfig) {
                if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                    if (validators.discardCard.suit !== suit) {
                        const last = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                        if (last >= 0
                            && G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !==
                                RusCardTypes.HERO) {
                            cardsToDiscard.push(G.publicPlayers[Number(ctx.currentPlayer)]
                                .cards[suit][last]);
                        }
                    }
                }
            }
            isValidMove = cardsToDiscard.length >= ((_a = validators.discardCard.number) !== null && _a !== void 0 ? _a : 1);
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
export const IsCanPickHeroWithConditionsValidator = (G, ctx, id) => {
    const validators = G.heroes[id].validators;
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
                                    .cards[validators.conditions[condition][key]].reduce(TotalRank, 0);
                            }
                            else if (key === `value`) {
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
//# sourceMappingURL=IsCanPickCurrentHeroValidator.js.map