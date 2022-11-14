import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff, GetBuffValue } from "../helpers/BuffHelpers";
import { TotalRank, TotalRankWithoutThrud } from "../score_helpers/ScoreHelpers";
import { ErrorNames, HeroBuffNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, DeckCardType, IHeroCard, IPublicPlayer, MoveArgumentsType, MyFnContext, PlayerCardType } from "../typescript/interfaces";

/**
 * <h3>Проверяет возможность получения нового героя при выборе карты конкретной фракции из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Фракция дворфов для выбора карты, чтобы получить нового героя.
 */
export const CheckSoloBotCanPickHero = ({ G, ctx, playerID, ...rest }: MyFnContext): CanBeUndefType<SuitNames> => {
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    const playerCards: PlayerCardType[][] = Object.values(soloBotPublicPlayer.cards),
        heroesLength: number = soloBotPublicPlayer.heroes.filter((hero: IHeroCard): boolean =>
            hero.name.startsWith(`Dwerg`)).length,
        playerCardsCount: number[] = playerCards.map((item: PlayerCardType[]): number =>
            item.reduce(TotalRank, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number =
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        isCanPickHero: boolean = minLength === heroesLength && minLengthCount === 1;
    if (isCanPickHero) {
        const suitIndex: number = playerCardsCount.indexOf(minLength);
        if (suitIndex === -1) {
            throw new Error(`В массиве фракций отсутствует фракция с минимальным количеством карт '${minLength}' для выкладки карты соло ботом.`);
        }
        const suits: SuitNames[] = Object.keys(soloBotPublicPlayer.cards) as SuitNames[],
            suit: CanBeUndefType<SuitNames> = suits[suitIndex];
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
 * @param G
 * @param ctx
 * @param player Игрок.
 * @returns Фракции дворфов с наименьшим количеством карт для выбора карты/минимальное количество карт в наименьших фракциях.
 */
export const CheckSuitsLeastPresentOnPlayerBoard = ({ G, ctx, playerID, ...rest }: MyFnContext):
    [SuitNames[], number] => {
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    const playerCards: PlayerCardType[][] = Object.values(soloBotPublicPlayer.cards),
        playerCardsCount: number[] = playerCards.map((item: PlayerCardType[]): number =>
            item.reduce(TotalRankWithoutThrud, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number = minLength === 0 ? 0 :
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        availableSuitArguments: SuitNames[] = [];
    for (let i = 0; i < playerCardsCount.length; i++) {
        if (playerCardsCount[i] === minLength) {
            const suits: SuitNames[] = Object.keys(soloBotPublicPlayer.cards) as SuitNames[],
                suit: CanBeUndefType<SuitNames> = suits[i];
            if (suit === undefined) {
                throw new Error(`В массиве фракций отсутствует фракция с id '${i}'.`);
            }
            const suitName: SuitNames = suitsConfig[suit].suit;
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
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты из таверны, при выборе которой можно получить нового героя.
 */
export const CheckSoloBotMustTakeCardToPickHero = ({ G, ctx, playerID, ...rest }: MyFnContext,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    let thrudSuit: CanBeUndefType<SuitNames>;
    if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, HeroBuffNames.MoveThrud)) {
        thrudSuit = GetBuffValue({ G, ctx, playerID, ...rest }, HeroBuffNames.MoveThrud) as SuitNames;
    }
    const suit: CanBeUndefType<SuitNames> = CheckSoloBotCanPickHero({ G, ctx, playerID, ...rest }),
        availableMoveArguments: MoveArgumentsType<number[]> = [],
        availableThrudArguments: MoveArgumentsType<number[]> = [];
    if (suit !== undefined) {
        const currentTavern: CanBeNullType<DeckCardType>[] =
            G.taverns[G.currentTavern] as CanBeNullType<DeckCardType>[];
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument: CanBeUndefType<number> = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard: CanBeUndefType<CanBeNullType<DeckCardType>> =
                currentTavern[moveArgument] as CanBeUndefType<CanBeNullType<DeckCardType>>;
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
            } else if (tavernCard.suit === thrudSuit) {
                availableThrudArguments.push(moveArgument);
            }
        }
    }
    if (availableMoveArguments.length === 1) {
        return availableMoveArguments[0];
    } else if (availableMoveArguments.length > 1) {
        return CheckSoloBotMustTakeCardWithHighestValue({ G, ctx, playerID, ...rest },
            availableMoveArguments);
    } else if (availableMoveArguments.length === 0 && availableThrudArguments.length) {
        if (availableThrudArguments.length === 1) {
            const thrudMoveArgument: CanBeUndefType<number> = availableThrudArguments[0];
            if (thrudMoveArgument === undefined) {
                throw new Error(`В массиве аргументов мува Труд отсутствует аргумент с id '0'.`);
            }
            return thrudMoveArgument;
        } else {
            return CheckSoloBotMustTakeCardWithHighestValue({ G, ctx, playerID, ...rest },
                availableThrudArguments);
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
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты из таверны, при выборе которой можно получить карту с наибольшим значением.
 */
export const CheckSoloBotMustTakeCardWithHighestValue = ({ G, ctx, playerID, ...rest }: MyFnContext,
    moveArguments: MoveArgumentsType<number[]>): number => {
    const currentTavern: CanBeNullType<DeckCardType>[] = G.taverns[G.currentTavern] as CanBeNullType<DeckCardType>[];
    let maxValue = 0,
        index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DeckCardType>> = currentTavern[moveArgument];
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
            return SoloBotMustTakeRandomCard({ G, ctx, playerID, ...rest }, moveArguments);
        } else if (tavernCard.points !== null) {
            if (tavernCard.points > maxValue) {
                maxValue = tavernCard.points;
                index = i;
            }
        }
    }
    const finalMoveArgument: CanBeUndefType<number> = moveArguments[index];
    if (finalMoveArgument === undefined) {
        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карты с id '${index}'.`);
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
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты из таверны, при выборе которой можно получить карту с наибольшим значением.
 */
export const CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard = ({ G, ctx, playerID, ...rest }: MyFnContext,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    const [availableSuitArguments, minLengthCount]: [SuitNames[], number] =
        CheckSuitsLeastPresentOnPlayerBoard({ G, ctx, playerID, ...rest });
    if (availableSuitArguments.length !== minLengthCount) {
        throw new Error(`Недопустимое количество фракций с минимальным количеством карт.`);
    }
    if (!minLengthCount || minLengthCount !== ctx.numPlayers) {
        const currentTavern: CanBeNullType<DeckCardType>[] =
            G.taverns[G.currentTavern] as CanBeNullType<DeckCardType>[],
            soloBotHasThrud: boolean =
                CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, HeroBuffNames.MoveThrud);
        let thrudSuit: CanBeUndefType<SuitNames>;
        if (soloBotHasThrud) {
            thrudSuit = GetBuffValue({ G, ctx, playerID, ...rest }, HeroBuffNames.MoveThrud) as SuitNames;
        }
        const leastPresentArguments: MoveArgumentsType<number[]> = [];
        let isNoPoints = false;
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument: CanBeUndefType<number> = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard: CanBeUndefType<CanBeNullType<DeckCardType>> = currentTavern[moveArgument];
            if (tavernCard === undefined) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
            }
            if (tavernCard === null) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
            }
            if (tavernCard.type === RusCardTypeNames.Royal_Offering_Card) {
                continue;
            }
            const cardSuit: SuitNames =
                thrudSuit && minLengthCount === 1 && thrudSuit === tavernCard.suit ? thrudSuit : tavernCard.suit;
            if (availableSuitArguments.includes(cardSuit) && cardSuit === tavernCard.suit) {
                leastPresentArguments.push(moveArgument);
                if (tavernCard.points === null || tavernCard.suit === SuitNames.miner) {
                    isNoPoints = true;
                }
            }
        }
        if (leastPresentArguments.length === 0) {
            return undefined;
        } else if (availableSuitArguments.length === 1 || !isNoPoints) {
            return CheckSoloBotMustTakeCardWithHighestValue({ G, ctx, playerID, ...rest },
                leastPresentArguments);
        }
        return SoloBotMustTakeRandomCard({ G, ctx, playerID, ...rest }, leastPresentArguments);
    } else {
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
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id карты Королевской награды из таверны.
 */
export const CheckSoloBotMustTakeRoyalOfferingCard = ({ G }: MyFnContext,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    const currentTavern: CanBeNullType<DeckCardType>[] = G.taverns[G.currentTavern] as CanBeNullType<DeckCardType>[];
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DeckCardType>> = currentTavern[moveArgument];
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
 * <h3>Проверяет получение случайной карты при выборе карты из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param moveArguments Аргументы действия соло бота.
 * @returns Id случайной карты из таверны.
 */
export const SoloBotMustTakeRandomCard = ({ G, ctx, ...rest }: MyFnContext,
    moveArguments: MoveArgumentsType<number[]>): number => {
    // TODO Delete random cards with same suit but less points from random!
    const moveArgument: CanBeUndefType<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentMoveArgumentIsUndefined);
    }
    return moveArgument;
};
