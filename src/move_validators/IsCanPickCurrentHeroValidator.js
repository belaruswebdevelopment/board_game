import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { CardTypeRusNames, ErrorNames, PickHeroCardValidatorNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с возможностью сброса карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность сброса карт с планшета игрока.</li>
 * </ol>
 *
 * @param context
 * @param id Id героя.
 * @returns Можно ли пикнуть конкретного героя.
 */
export const IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator = ({ G, ctx, myPlayerID, ...rest }, id) => {
    var _a;
    const hero = G.heroes[id];
    if (hero === undefined) {
        throw new Error(`Не существует карта героя с id '${id}'.`);
    }
    const validators = hero.pickValidators, cardsToDiscard = [];
    let isValidMove = false;
    if ((validators === null || validators === void 0 ? void 0 : validators.discardCard) !== undefined) {
        let suit;
        for (suit in suitsConfig) {
            if (validators.discardCard.suit !== suit) {
                const player = G.publicPlayers[Number(myPlayerID)];
                if (player === undefined) {
                    return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
                }
                const last = player.cards[suit].length - 1;
                if (last >= 0) {
                    const card = player.cards[suit][last];
                    if (card === undefined) {
                        throw new Error(`В массиве карт фракции '${suit}' отсутствует последняя карта с id '${last}'.`);
                    }
                    if (card.type !== CardTypeRusNames.HeroPlayerCard) {
                        cardsToDiscard.push(card);
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
 * @param context
 * @param id Id героя.
 * @returns Можно ли пикнуть конкретного героя.
 */
export const IsCanPickHeroWithConditionsValidator = ({ G, ctx, myPlayerID, ...rest }, id) => {
    var _a;
    const hero = G.heroes[id];
    if (hero === undefined) {
        throw new Error(`Не существует карта героя с id '${id}'.`);
    }
    const conditions = (_a = hero.pickValidators) === null || _a === void 0 ? void 0 : _a.conditions;
    if (conditions === undefined) {
        throw new Error(`У карты ${CardTypeRusNames.HeroCard} с id '${id}' отсутствует у валидатора свойство '${PickHeroCardValidatorNames.conditions}'.`);
    }
    let isValidMove = false, condition;
    for (condition in conditions) {
        if (condition === `suitCountMin`) {
            let ranks = 0, key;
            for (key in conditions[condition]) {
                if (key === `suit`) {
                    const player = G.publicPlayers[Number(myPlayerID)];
                    if (player === undefined) {
                        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
                    }
                    ranks = player.cards[conditions[condition][key]].reduce(TotalRank, 0);
                }
                else if (key === `count`) {
                    isValidMove = ranks >= conditions[condition][key];
                }
            }
        }
    }
    return isValidMove;
};
//# sourceMappingURL=IsCanPickCurrentHeroValidator.js.map