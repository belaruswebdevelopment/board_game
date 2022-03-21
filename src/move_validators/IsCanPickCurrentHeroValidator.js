import { suitsConfig } from "../data/SuitData";
import { IsHeroCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
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
    const hero = G.heroes[id];
    if (hero === undefined) {
        throw new Error(`Не существует карта героя ${id}.`);
    }
    const validators = hero.validators, cardsToDiscard = [];
    let isValidMove = false;
    if ((validators === null || validators === void 0 ? void 0 : validators.discardCard) !== undefined) {
        let suit;
        for (suit in suitsConfig) {
            if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                if (validators.discardCard.suit !== suit) {
                    const player = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                    }
                    const last = player.cards[suit].length - 1;
                    if (last >= 0) {
                        const card = player.cards[suit][last];
                        if (card === undefined) {
                            throw new Error(`В массиве карт фракции ${suit} отсутствует последняя карта ${last}.`);
                        }
                        if (!IsHeroCard(card)) {
                            cardsToDiscard.push(card);
                        }
                    }
                }
            }
        }
        isValidMove = cardsToDiscard.length >= ((_a = validators.discardCard.number) !== null && _a !== void 0 ? _a : 1);
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
    var _a;
    const hero = G.heroes[id];
    if (hero === undefined) {
        throw new Error(`Не существует карта героя ${id}.`);
    }
    const conditions = (_a = hero.validators) === null || _a === void 0 ? void 0 : _a.conditions;
    let isValidMove = false;
    for (const condition in conditions) {
        if (Object.prototype.hasOwnProperty.call(conditions, condition)) {
            if (condition === `suitCountMin`) {
                let ranks = 0;
                for (const key in conditions[condition]) {
                    if (Object.prototype.hasOwnProperty.call(conditions[condition], key)) {
                        if (key === `suit`) {
                            const player = G.publicPlayers[Number(ctx.currentPlayer)];
                            if (player === undefined) {
                                throw new Error(`В массиве игроков отсутствует текущий игрок.`);
                            }
                            ranks = player.cards[conditions[condition][key]].reduce(TotalRank, 0);
                        }
                        else if (key === `value`) {
                            isValidMove = ranks >= conditions[condition][key];
                        }
                    }
                }
            }
        }
    }
    return isValidMove;
};
//# sourceMappingURL=IsCanPickCurrentHeroValidator.js.map