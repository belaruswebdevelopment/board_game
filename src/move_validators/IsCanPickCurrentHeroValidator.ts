import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { IsHeroPlayerCard } from "../Hero";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { ErrorNames, PickHeroCardValidatorNames, RusCardTypeNames } from "../typescript/enums";
import type { CanBeUndef, ConditionsTypes, ConditionTypes, IConditions, IHeroCard, IMyGameState, IPickValidatorsConfig, IPublicPlayer, PlayerCardTypes, SuitTypes } from "../typescript/interfaces";

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
    const validators: CanBeUndef<IPickValidatorsConfig> = hero.pickValidators,
        cardsToDiscard: PlayerCardTypes[] = [];
    let isValidMove = false;
    if (validators?.discardCard !== undefined) {
        let suit: SuitTypes;
        for (suit in suitsConfig) {
            if (validators.discardCard.suit !== suit) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                        ctx.currentPlayer);
                }
                const last: number = player.cards[suit].length - 1;
                if (last >= 0) {
                    const card: CanBeUndef<PlayerCardTypes> = player.cards[suit][last];
                    if (card === undefined) {
                        throw new Error(`В массиве карт фракции '${suit}' отсутствует последняя карта с id '${last}'.`);
                    }
                    if (!IsHeroPlayerCard(card)) {
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
    const conditions: CanBeUndef<IConditions> = hero.pickValidators?.conditions;
    if (conditions === undefined) {
        throw new Error(`У карты ${RusCardTypeNames.Hero_Card} с id '${id}' отсутствует у валидатора свойство '${PickHeroCardValidatorNames.Conditions}'.`);
    }
    let isValidMove = false,
        condition: ConditionsTypes;
    for (condition in conditions) {
        if (condition === `suitCountMin`) {
            let ranks = 0,
                key: ConditionTypes;
            for (key in conditions[condition]) {
                if (key === `suit`) {
                    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
                    if (player === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined,
                            ctx.currentPlayer);
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
