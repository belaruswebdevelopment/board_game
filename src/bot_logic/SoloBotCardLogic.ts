import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff, GetBuffValue } from "../helpers/BuffHelpers";
import { TotalRank, TotalRankWithoutThrud } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, Ctx, DeckCardType, IHeroCard, IMyGameState, IPublicPlayer, MoveArgumentsType, PlayerCardType, SuitNamesKeyofTypeofType } from "../typescript/interfaces";

/**
 * <h3>Проверяет возможность получения нового героя при выборе карты конкретной фракции из таверны соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param player Игрок.
 * @returns Фракция дворфов для выбора карты, чтобы получить нового героя.
 */
export const CheckSoloBotCanPickHero = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer):
    CanBeUndefType<SuitNamesKeyofTypeofType> => {
    const playerCards: PlayerCardType[][] = Object.values(player.cards),
        heroesLength: number = player.heroes.filter((hero: IHeroCard): boolean =>
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
        const suits: SuitNamesKeyofTypeofType[] = Object.keys(player.cards) as SuitNamesKeyofTypeofType[],
            suit: CanBeUndefType<SuitNamesKeyofTypeofType> = suits[suitIndex];
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
export const CheckSuitsLeastPresentOnPlayerBoard = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer):
    [SuitNamesKeyofTypeofType[], number] => {
    const playerCards: PlayerCardType[][] = Object.values(player.cards),
        playerCardsCount: number[] = playerCards.map((item: PlayerCardType[]): number =>
            item.reduce(TotalRankWithoutThrud, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number = minLength === 0 ? 0 :
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        availableSuitArguments: SuitNamesKeyofTypeofType[] = [];
    for (let i = 0; i < playerCardsCount.length; i++) {
        if (playerCardsCount[i] === minLength) {
            const suits: SuitNamesKeyofTypeofType[] = Object.keys(player.cards) as SuitNamesKeyofTypeofType[],
                suit: CanBeUndefType<SuitNamesKeyofTypeofType> = suits[i];
            if (suit === undefined) {
                throw new Error(`В массиве фракций отсутствует фракция с id '${i}'.`);
            }
            const suitName: SuitNamesKeyofTypeofType = suitsConfig[suit].suit;
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
export const CheckSoloBotMustTakeCardToPickHero = (G: IMyGameState, ctx: Ctx,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
    }
    let thrudSuit: CanBeUndefType<SuitNamesKeyofTypeofType>;
    if (CheckPlayerHasBuff(soloBotPublicPlayer, BuffNames.MoveThrud)) {
        thrudSuit = GetBuffValue(G, ctx, BuffNames.MoveThrud) as SuitNamesKeyofTypeofType;
    }
    const suit: CanBeUndefType<SuitNamesKeyofTypeofType> = CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer),
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
        return CheckSoloBotMustTakeCardWithHighestValue(G, ctx, availableMoveArguments);
    } else if (availableMoveArguments.length === 0 && availableThrudArguments.length) {
        if (availableThrudArguments.length === 1) {
            const thrudMoveArgument: CanBeUndefType<number> = availableThrudArguments[0];
            if (thrudMoveArgument === undefined) {
                throw new Error(`В массиве аргументов мува Труд отсутствует аргумент с id '0'.`);
            }
            return thrudMoveArgument;
        } else {
            return CheckSoloBotMustTakeCardWithHighestValue(G, ctx, availableThrudArguments);
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
export const CheckSoloBotMustTakeCardWithHighestValue = (G: IMyGameState, ctx: Ctx,
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
            return SoloBotMustTakeRandomCard(G, ctx, moveArguments);
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
export const CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard = (G: IMyGameState, ctx: Ctx,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
    }
    const [availableSuitArguments, minLengthCount]: [SuitNamesKeyofTypeofType[], number] =
        CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
    if (availableSuitArguments.length !== minLengthCount) {
        throw new Error(`Недопустимое количество фракций с минимальным количеством карт.`);
    }
    if (!minLengthCount || minLengthCount !== ctx.numPlayers) {
        const currentTavern: CanBeNullType<DeckCardType>[] =
            G.taverns[G.currentTavern] as CanBeNullType<DeckCardType>[],
            soloBotHasThrud: boolean = CheckPlayerHasBuff(soloBotPublicPlayer, BuffNames.MoveThrud);
        let thrudSuit: CanBeUndefType<SuitNamesKeyofTypeofType>;
        if (soloBotHasThrud) {
            thrudSuit = GetBuffValue(G, ctx, BuffNames.MoveThrud) as SuitNamesKeyofTypeofType;
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
            const cardSuit: SuitNamesKeyofTypeofType =
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
            return CheckSoloBotMustTakeCardWithHighestValue(G, ctx, leastPresentArguments);
        }
        return SoloBotMustTakeRandomCard(G, ctx, leastPresentArguments);
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
export const CheckSoloBotMustTakeRoyalOfferingCard = (G: IMyGameState, ctx: Ctx,
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
export const SoloBotMustTakeRandomCard = (G: IMyGameState, ctx: Ctx, moveArguments: MoveArgumentsType<number[]>):
    number => {
    // TODO Delete random cards with same suit but less points from random!
    const moveArgument: CanBeUndefType<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
    }
    return moveArgument;
};
