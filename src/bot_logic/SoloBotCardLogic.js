import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff, GetBuffValue } from "../helpers/BuffHelpers";
import { TotalRank, TotalRankWithoutThrud } from "../score_helpers/ScoreHelpers";
import { CardTypeRusNames, ErrorNames, HeroBuffNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Проверяет возможность получения нового героя при выборе карты конкретной фракции из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @returns Фракция дворфов для выбора карты, чтобы получить нового героя.
 */
export const CheckSoloBotCanPickHero = ({ G, ctx, myPlayerID, ...rest }) => {
    const soloBotPublicPlayer = G.publicPlayers[Number(myPlayerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const playerCards = Object.values(soloBotPublicPlayer.cards), heroesLength = soloBotPublicPlayer.heroes.filter((hero) => hero.name.startsWith(`Dwerg`)).length, playerCardsCount = playerCards.map((item) => item.reduce(TotalRank, 0)), minLength = Math.min(...playerCardsCount), minLengthCount = playerCardsCount.filter((length) => length === minLength).length, isCanPickHero = minLength === heroesLength && minLengthCount === 1;
    if (isCanPickHero) {
        const suitIndex = playerCardsCount.indexOf(minLength);
        if (suitIndex === -1) {
            throw new Error(`В массиве фракций отсутствует фракция с минимальным количеством карт '${minLength}' для выкладки карты соло ботом.`);
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
 * <h3>Проверяет наименее представленные фракции в армии соло бота при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @returns Фракции дворфов с наименьшим количеством карт для выбора карты/минимальное количество карт в наименьших фракциях.
 */
export const CheckSuitsLeastPresentOnPlayerBoard = ({ G, ctx, myPlayerID, ...rest }) => {
    const soloBotPublicPlayer = G.publicPlayers[Number(myPlayerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const playerCards = Object.values(soloBotPublicPlayer.cards), playerCardsCount = playerCards.map((item) => item.reduce(TotalRankWithoutThrud, 0)), minLength = Math.min(...playerCardsCount), minLengthCount = minLength === 0 ? 0 :
        playerCardsCount.filter((length) => length === minLength).length, availableSuitArguments = [];
    for (let i = 0; i < playerCardsCount.length; i++) {
        if (playerCardsCount[i] === minLength) {
            const suits = Object.keys(soloBotPublicPlayer.cards), suit = suits[i];
            if (suit === undefined) {
                throw new Error(`В массиве фракций отсутствует фракция с id '${i}'.`);
            }
            const suitName = suitsConfig[suit].suit;
            availableSuitArguments.push(suitName);
        }
    }
    return [availableSuitArguments, minLengthCount];
};
/**
 * <h3>Проверяет возможность получения нового героя при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты из таверны, при выборе которой можно получить нового героя.
 */
export const CheckSoloBotMustTakeCardToPickHero = ({ G, ctx, myPlayerID, ...rest }, moveArguments) => {
    let thrudSuit;
    if (CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud)) {
        thrudSuit = GetBuffValue({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud);
    }
    const suit = CheckSoloBotCanPickHero({ G, ctx, myPlayerID, ...rest }), availableMoveArguments = [], availableThrudArguments = [];
    if (suit !== undefined) {
        const currentTavern = G.taverns[G.currentTavern];
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard = currentTavern[moveArgument];
            if (tavernCard === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
            }
            if (tavernCard === null) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
            }
            if (tavernCard.type === CardTypeRusNames.Royal_Offering_Card) {
                continue;
            }
            if (tavernCard.suit === suit) {
                availableMoveArguments.push(moveArgument);
            }
            else if (tavernCard.suit === thrudSuit) {
                availableThrudArguments.push(moveArgument);
            }
        }
    }
    if (availableMoveArguments.length === 1) {
        return availableMoveArguments[0];
    }
    else if (availableMoveArguments.length > 1) {
        return CheckSoloBotMustTakeCardWithHighestValue({ G, ctx, myPlayerID, ...rest }, availableMoveArguments);
    }
    else if (availableMoveArguments.length === 0 && availableThrudArguments.length) {
        if (availableThrudArguments.length === 1) {
            const thrudMoveArgument = availableThrudArguments[0];
            if (thrudMoveArgument === undefined) {
                throw new Error(`В массиве аргументов мува Труд отсутствует аргумент с id '0'.`);
            }
            return thrudMoveArgument;
        }
        else {
            return CheckSoloBotMustTakeCardWithHighestValue({ G, ctx, myPlayerID, ...rest }, availableThrudArguments);
        }
    }
    return undefined;
};
/**
 * <h3>Проверяет наибольшее значение для получения карты при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты из таверны, при выборе которой можно получить карту с наибольшим значением.
 */
export const CheckSoloBotMustTakeCardWithHighestValue = ({ G, ctx, myPlayerID, ...rest }, moveArguments) => {
    const currentTavern = G.taverns[G.currentTavern];
    let maxValue = 0, index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
        }
        if (tavernCard === null) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
        }
        if (tavernCard.type === CardTypeRusNames.Royal_Offering_Card) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdCanNotBeRoyalOfferingCard, moveArgument);
        }
        if (tavernCard.points === null) {
            return SoloBotMustTakeRandomCard({ G, ctx, myPlayerID, ...rest }, moveArguments);
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
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, index);
    }
    return finalMoveArgument;
};
/**
 * <h3>Проверяет возможность получения карты наименее представленной в армии соло бота при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты из таверны, при выборе которой можно получить карту с наибольшим значением.
 */
export const CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard = ({ G, ctx, myPlayerID, ...rest }, moveArguments) => {
    const [availableSuitArguments, minLengthCount] = CheckSuitsLeastPresentOnPlayerBoard({ G, ctx, myPlayerID, ...rest });
    if (availableSuitArguments.length !== minLengthCount) {
        throw new Error(`Недопустимое количество фракций с минимальным количеством карт.`);
    }
    if (!minLengthCount || minLengthCount !== ctx.numPlayers) {
        const currentTavern = G.taverns[G.currentTavern], soloBotHasThrud = CheckPlayerHasBuff({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud);
        let thrudSuit;
        if (soloBotHasThrud) {
            thrudSuit = GetBuffValue({ G, ctx, myPlayerID, ...rest }, HeroBuffNames.MoveThrud);
        }
        const leastPresentArguments = [];
        let isNoPoints = false;
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard = currentTavern[moveArgument];
            if (tavernCard === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
            }
            if (tavernCard === null) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
            }
            if (tavernCard.type === CardTypeRusNames.Royal_Offering_Card) {
                continue;
            }
            const cardSuit = thrudSuit && minLengthCount === 1 && thrudSuit === tavernCard.suit ? thrudSuit : tavernCard.suit;
            if (availableSuitArguments.includes(cardSuit) && cardSuit === tavernCard.suit) {
                leastPresentArguments.push(moveArgument);
                if (tavernCard.points === null || tavernCard.suit === SuitNames.miner) {
                    isNoPoints = true;
                }
            }
        }
        if (leastPresentArguments.length === 0) {
            return undefined;
        }
        else if (availableSuitArguments.length === 1 || !isNoPoints) {
            return CheckSoloBotMustTakeCardWithHighestValue({ G, ctx, myPlayerID, ...rest }, leastPresentArguments);
        }
        return SoloBotMustTakeRandomCard({ G, ctx, myPlayerID, ...rest }, leastPresentArguments);
    }
    else {
        return undefined;
    }
};
/**
 * <h3>Проверяет получение карты Королевской награды при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты Королевской награды из таверны.
 */
export const CheckSoloBotMustTakeRoyalOfferingCard = ({ G, ctx, ...rest }, moveArguments) => {
    const currentTavern = G.taverns[G.currentTavern];
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
        }
        if (tavernCard === null) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
        }
        if (tavernCard.type === CardTypeRusNames.Royal_Offering_Card) {
            return moveArgument;
        }
    }
    return undefined;
};
/**
 * <h3>Проверяет получение случайной карты при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id случайной карты из таверны.
 */
export const SoloBotMustTakeRandomCard = ({ G, ctx, ...rest }, moveArguments) => {
    // TODO Delete random cards with same suit but less points from random!
    const moveArgument = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
    }
    return moveArgument;
};
//# sourceMappingURL=SoloBotCardLogic.js.map