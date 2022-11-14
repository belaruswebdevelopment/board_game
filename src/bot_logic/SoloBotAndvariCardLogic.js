import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { ErrorNames, RusCardTypeNames, SoloGameAndvariStrategyNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Проверяет возможность получения нового героя при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Фракция дворфов для выбора карты, чтобы получить нового героя.
 */
const CheckSoloBotAndvariCanPickHero = ({ G, ctx, playerID, ...rest }) => {
    const soloBotPublicPlayer = G.publicPlayers[Number(playerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    const playerCards = Object.values(soloBotPublicPlayer.cards), heroesLength = soloBotPublicPlayer.heroes.length -
        ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroEasyStrategy
            || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroHardStrategy) ? 0 : 5), playerCardsCount = playerCards.map((item) => item.reduce(TotalRank, 0)), minLength = Math.min(...playerCardsCount), minLengthCount = playerCardsCount.filter((length) => length === minLength).length, isCanPickHero = minLength === heroesLength && minLengthCount === 1;
    if (isCanPickHero) {
        const suitIndex = playerCardsCount.indexOf(minLength);
        if (suitIndex === -1) {
            throw new Error(`В массиве фракций отсутствует фракция с минимальным количеством карт '${minLength}' для выкладки карты соло ботом Андвари.`);
        }
        const suits = Object.keys(soloBotPublicPlayer.cards), suit = suits[suitIndex];
        if (suit === undefined) {
            throw new Error(`В массиве фракций отсутствует фракция с id '${suitIndex}'.`);
        }
        return suitsConfig[suit].suit;
    }
    return undefined;
};
/**
 * <h3>Проверяет возможность получения нового героя при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты из таверны, при выборе которой можно получить нового героя.
 */
export const CheckSoloBotAndvariMustTakeCardToPickHero = ({ G, ctx, playerID, ...rest }, moveArguments) => {
    const suit = CheckSoloBotAndvariCanPickHero({ G, ctx, playerID, ...rest }), availableMoveArguments = [];
    if (suit !== undefined) {
        const currentTavern = G.taverns[G.currentTavern];
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard = currentTavern[moveArgument];
            if (tavernCard === undefined) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
            }
            if (tavernCard === null) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${moveArgument}'.`);
            }
            if (tavernCard.type === RusCardTypeNames.Royal_Offering_Card) {
                continue;
            }
            if (tavernCard.suit === suit) {
                availableMoveArguments.push(moveArgument);
            }
        }
    }
    if (availableMoveArguments.length === 1) {
        return availableMoveArguments[0];
    }
    else if (availableMoveArguments.length > 1) {
        return CheckSoloBotAndvariMustTakeCardWithHighestValue({ G, ctx, playerID, ...rest }, availableMoveArguments);
    }
    return undefined;
};
/**
 * <h3>Проверяет наибольшее значение для получения карты при выборе карты из таверны соло ботом Andvari.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Andvari.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Andvari.
 * @returns Id карты из таверны, при выборе которой можно получить карту с наибольшим значением.
 */
const CheckSoloBotAndvariMustTakeCardWithHighestValue = ({ G, ctx }, moveArguments) => {
    const currentTavern = G.taverns[G.currentTavern];
    let maxValue = 0, index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (tavernCard.type === RusCardTypeNames.Royal_Offering_Card) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карта обмена монет с id '${moveArgument}'.`);
        }
        if (tavernCard.points === null) {
            return SoloBotAndvariMustTakeRandomCard(G, ctx, moveArguments);
        }
        else if (tavernCard.points !== null) {
            if (tavernCard.points > maxValue) {
                maxValue = tavernCard.points;
                index = i;
            }
        }
    }
    const finalMoveArgument = moveArguments[index];
    if (finalMoveArgument === undefined) {
        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карты с id '${index}'.`);
    }
    return finalMoveArgument;
};
/**
 * <h3>Проверяет возможность получения карты по указанной стратегии при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @param suit Название фракции дворфов.
 * @returns Id карты из таверны, при выборе которой можно получить карту по указанной стратегии соло бота Андвари.
 */
const CheckSoloBotAndvariMustTakeCardFromCurrentStrategy = ({ G, ctx, playerID, ...rest }, moveArguments, suit) => {
    // TODO Move same code here and for reserve strategy to one helper function
    // TODO Check playerID === `1`?
    const soloBotPublicPlayer = G.publicPlayers[Number(playerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    const currentTavern = G.taverns[G.currentTavern], strategyArguments = [];
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (tavernCard.type === RusCardTypeNames.Royal_Offering_Card) {
            continue;
        }
        if (suit === tavernCard.suit) {
            strategyArguments.push(moveArgument);
        }
    }
    return strategyArguments;
};
/**
 * <h3>Проверяет возможность получения карты по главной стратегии при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты из таверны, при выборе которой можно получить карту по главной стратегии соло бота Андвари.
 */
export const CheckSoloBotAndvariMustTakeCardFromGeneralStrategy = ({ G, ctx, playerID, ...rest }, moveArguments) => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    for (let i = 0; i < G.soloGameAndvariStrategyVariantLevel; i++) {
        const suit = G.strategyForSoloBotAndvari.general[i];
        if (suit === undefined) {
            throw new Error(`В массиве главных стратегий отсутствует фракция с id '${i}'.`);
        }
        const strategyArguments = CheckSoloBotAndvariMustTakeCardFromCurrentStrategy({ G, ctx, playerID, ...rest }, moveArguments, suit);
        if (strategyArguments.length === 1) {
            return strategyArguments[0];
        }
        else if (strategyArguments.length > 1) {
            return CheckSoloBotAndvariMustTakeCardWithHighestValue({ G, ctx, playerID, ...rest }, strategyArguments);
        }
    }
    return undefined;
};
/**
 * <h3>Проверяет возможность получения карты по резервной стратегии при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты из таверны, при выборе которой можно получить карту по резервной стратегии соло бота Андвари.
 */
export const SoloBotMustTakeCardFromReserveStrategy = ({ G, ctx, playerID, ...rest }, moveArguments) => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    for (let i = G.soloGameAndvariStrategyVariantLevel; i < 5; i++) {
        const suit = G.strategyForSoloBotAndvari.reserve[i];
        if (suit === undefined) {
            throw new Error(`В массиве резервных стратегий отсутствует фракция с id '${i}'.`);
        }
        const strategyArguments = CheckSoloBotAndvariMustTakeCardFromCurrentStrategy({ G, ctx, playerID, ...rest }, moveArguments, suit);
        if (strategyArguments.length === 1) {
            const moveArgument = strategyArguments[0];
            if (moveArgument === undefined) {
                throw new Error(`В массиве резервных стратегий с id '${i}' отсутствует необходимое значение.`);
            }
            return moveArgument;
        }
        else if (strategyArguments.length > 1) {
            return CheckSoloBotAndvariMustTakeCardWithHighestValue({ G, ctx, playerID, ...rest }, strategyArguments);
        }
    }
    throw new Error(`В массиве резервных стратегий отсутствует необходимое значение.`);
};
/**
 * <h3>Проверяет получение карты Королевской награды при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты Королевской награды из таверны.
 */
export const CheckSoloBotAndvariMustTakeRoyalOfferingCard = ({ G }, moveArguments) => {
    // TODO Move code here and for solo bot royal to one helper function
    const currentTavern = G.taverns[G.currentTavern];
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (tavernCard.type === RusCardTypeNames.Royal_Offering_Card) {
            return moveArgument;
        }
    }
    return undefined;
};
/**
 * <h3>Проверяет получение случайной карты при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id случайной карты из таверны.
 */
export const SoloBotAndvariMustTakeRandomCard = (G, ctx, moveArguments) => {
    // TODO Move code here and for solo bot and for move validators to one helper function
    const moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
    }
    return moveArgument;
};
//# sourceMappingURL=SoloBotAndvariCardLogic.js.map