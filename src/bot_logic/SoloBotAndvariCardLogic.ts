import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { CardTypeRusNames, ErrorNames, SoloGameAndvariStrategyNames, SuitNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, DwarfDeckCardType, MoveArgumentsType, MyFnContextWithMyPlayerID, PlayerBoardCardType, PublicPlayer, ZeroOrOneOrTwoType } from "../typescript/interfaces";

/**
 * <h3>Проверяет возможность получения нового героя при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @returns Фракция дворфов для выбора карты, чтобы получить нового героя.
 */
const CheckSoloBotAndvariCanPickHero = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    CanBeUndefType<SuitNames> => {
    const soloBotPublicPlayer: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const playerCards: PlayerBoardCardType[][] = Object.values(soloBotPublicPlayer.cards),
        heroesLength: number = soloBotPublicPlayer.heroes.length -
            ((G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroEasyStrategy
                || G.soloGameAndvariStrategyLevel === SoloGameAndvariStrategyNames.NoHeroHardStrategy) ? 0 : 5),
        playerCardsCount: number[] = playerCards.map((item: PlayerBoardCardType[]): number =>
            item.reduce(TotalRank, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number =
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        isCanPickHero: boolean = minLength === heroesLength && minLengthCount === 1;
    if (isCanPickHero) {
        const suitIndex: number = playerCardsCount.indexOf(minLength);
        if (suitIndex === -1) {
            throw new Error(`В массиве фракций отсутствует фракция с минимальным количеством карт '${minLength}' для выкладки карты соло ботом Андвари.`);
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
 * <h3>Проверяет возможность получения нового героя при выборе карты из таверны соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора карты из таверны соло ботом Андвари.</li>
 * </ol>
 *
 * @param context
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты из таверны, при выборе которой можно получить нового героя.
 */
export const CheckSoloBotAndvariMustTakeCardToPickHero = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    const suit: CanBeUndefType<SuitNames> = CheckSoloBotAndvariCanPickHero({ G, ctx, myPlayerID, ...rest }),
        availableMoveArguments: MoveArgumentsType<number[]> = [];
    if (suit !== undefined) {
        const currentTavern: CanBeNullType<DwarfDeckCardType>[] =
            G.taverns[G.currentTavern] as CanBeNullType<DwarfDeckCardType>[];
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument: CanBeUndefType<number> = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard: CanBeUndefType<CanBeNullType<DwarfDeckCardType>> =
                currentTavern[moveArgument] as CanBeUndefType<CanBeNullType<DwarfDeckCardType>>;
            if (tavernCard === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined,
                    moveArgument);
            }
            if (tavernCard === null) {
                return ThrowMyError({ G, ctx, ...rest },
                    ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
            }
            if (tavernCard.type === CardTypeRusNames.RoyalOfferingCard) {
                continue;
            }
            if (tavernCard.playerSuit === suit) {
                availableMoveArguments.push(moveArgument);
            }
        }
    }
    if (availableMoveArguments.length === 1) {
        return availableMoveArguments[0];
    } else if (availableMoveArguments.length > 1) {
        return CheckSoloBotAndvariMustTakeCardWithHighestValue({ G, ctx, myPlayerID, ...rest },
            availableMoveArguments);
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
 * @param context
 * @param moveArguments Аргументы действия соло бота Andvari.
 * @returns Id карты из таверны, при выборе которой можно получить карту с наибольшим значением.
 */
const CheckSoloBotAndvariMustTakeCardWithHighestValue = ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<number[]>): number => {
    const currentTavern: CanBeNullType<DwarfDeckCardType>[] = G.taverns[G.currentTavern] as CanBeNullType<DwarfDeckCardType>[];
    let maxValue = 0,
        index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DwarfDeckCardType>> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
        }
        if (tavernCard === null) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
        }
        if (tavernCard.type === CardTypeRusNames.RoyalOfferingCard) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdCanNotBeRoyalOfferingCard, moveArgument);
        }
        if (tavernCard.points === null) {
            return SoloBotAndvariMustTakeRandomCard(moveArguments);
        } else if (tavernCard.points !== null) {
            if (tavernCard.points > maxValue) {
                maxValue = tavernCard.points;
                index = i;
            }
        }
    }
    const finalMoveArgument: CanBeUndefType<number> = moveArguments[index];
    if (finalMoveArgument === undefined) {
        return ThrowMyError({ G, ctx, ...rest },
            ErrorNames.CurrentTavernCardWithCurrentIdIsNull, index);
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
 * @param context
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @param suit Название фракции дворфов.
 * @returns Id карты из таверны, при выборе которой можно получить карту по указанной стратегии соло бота Андвари.
 */
const CheckSoloBotAndvariMustTakeCardFromCurrentStrategy = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<number[]>, suit: SuitNames): MoveArgumentsType<number[]> => {
    // TODO Move same code here and for reserve strategy to one helper function
    // TODO Check myPlayerID === `1`?
    const soloBotPublicPlayer: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const currentTavern: CanBeNullType<DwarfDeckCardType>[] =
        G.taverns[G.currentTavern] as CanBeNullType<DwarfDeckCardType>[],
        strategyArguments: MoveArgumentsType<number[]> = [];
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DwarfDeckCardType>> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
        }
        if (tavernCard === null) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
        }
        if (tavernCard.type === CardTypeRusNames.RoyalOfferingCard) {
            continue;
        }
        if (suit === tavernCard.playerSuit) {
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
 * @param context
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты из таверны, при выборе которой можно получить карту по главной стратегии соло бота Андвари.
 */
export const CheckSoloBotAndvariMustTakeCardFromGeneralStrategy = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID, moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    for (let i = 0; i < G.soloGameAndvariStrategyVariantLevel; i++) {
        const suit: CanBeUndefType<SuitNames> =
            G.strategyForSoloBotAndvari.general[i as ZeroOrOneOrTwoType];
        if (suit === undefined) {
            throw new Error(`В массиве главных стратегий отсутствует фракция с id '${i}'.`);
        }
        const strategyArguments: MoveArgumentsType<number[]> =
            CheckSoloBotAndvariMustTakeCardFromCurrentStrategy({ G, ctx, myPlayerID, ...rest }, moveArguments, suit);
        if (strategyArguments.length === 1) {
            return strategyArguments[0];
        } else if (strategyArguments.length > 1) {
            return CheckSoloBotAndvariMustTakeCardWithHighestValue({ G, ctx, myPlayerID, ...rest },
                strategyArguments);
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
 * @param context
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты из таверны, при выборе которой можно получить карту по резервной стратегии соло бота Андвари.
 */
export const SoloBotMustTakeCardFromReserveStrategy = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<number[]>): number => {
    if (G.soloGameAndvariStrategyVariantLevel === null) {
        throw new Error(`Не задан вариант уровня сложности для стратегий соло бота Андвари в соло игре.`);
    }
    for (let i = G.soloGameAndvariStrategyVariantLevel; i < 5; i++) {
        const suit: CanBeUndefType<SuitNames> = G.strategyForSoloBotAndvari.reserve[i];
        if (suit === undefined) {
            throw new Error(`В массиве резервных стратегий отсутствует фракция с id '${i}'.`);
        }
        const strategyArguments: MoveArgumentsType<number[]> =
            CheckSoloBotAndvariMustTakeCardFromCurrentStrategy({ G, ctx, myPlayerID, ...rest }, moveArguments, suit);
        if (strategyArguments.length === 1) {
            const moveArgument: CanBeUndefType<number> = strategyArguments[0];
            if (moveArgument === undefined) {
                throw new Error(`В массиве резервных стратегий с id '${i}' отсутствует необходимое значение.`);
            }
            return moveArgument;
        } else if (strategyArguments.length > 1) {
            return CheckSoloBotAndvariMustTakeCardWithHighestValue({ G, ctx, myPlayerID, ...rest },
                strategyArguments);
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
 * @param context
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id карты Королевской награды из таверны.
 */
export const CheckSoloBotAndvariMustTakeRoyalOfferingCard = ({ G, ctx, ...rest }: MyFnContextWithMyPlayerID,
    moveArguments: MoveArgumentsType<number[]>): CanBeUndefType<number> => {
    // TODO Move code here and for solo bot royal to one helper function
    const currentTavern: CanBeNullType<DwarfDeckCardType>[] =
        G.taverns[G.currentTavern] as CanBeNullType<DwarfDeckCardType>[];
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DwarfDeckCardType>> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdIsUndefined, moveArgument);
        }
        if (tavernCard === null) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.CurrentTavernCardWithCurrentIdIsNull, moveArgument);
        }
        if (tavernCard.type === CardTypeRusNames.RoyalOfferingCard) {
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
 * @param moveArguments Аргументы действия соло бота Андвари.
 * @returns Id случайной карты из таверны.
 */
const SoloBotAndvariMustTakeRandomCard = (moveArguments: MoveArgumentsType<number[]>): number => {
    // TODO Move code here and for solo bot and for move validators to one helper function
    const moveArgument: CanBeUndefType<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
    }
    return moveArgument;
};
