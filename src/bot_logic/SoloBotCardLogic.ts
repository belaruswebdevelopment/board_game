import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff, GetBuffValue } from "../helpers/BuffHelpers";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, RusCardTypeNames, SuitNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, DeckCardTypes, IHeroCard, IMoveArgumentsStage, IMyGameState, IPublicPlayer, PlayerCardType, SuitKeyofType } from "../typescript/interfaces";

export const CheckSoloBotCanPickHero = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): CanBeUndefType<SuitKeyofType> => {
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
        const suits: SuitKeyofType[] = Object.keys(player.cards) as SuitKeyofType[],
            suit: CanBeUndefType<SuitKeyofType> = suits[suitIndex];
        if (suit === undefined) {
            throw new Error(`В массиве фракций отсутствует фракция с id '${suitIndex}'.`);
        }
        return suitsConfig[suit].suit;
    }
    return undefined;
};

export const CheckSuitsLeastPresentOnPlayerBoard = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer):
    [SuitKeyofType[], number] => {
    const playerCards: PlayerCardType[][] = Object.values(player.cards),
        playerCardsCount: number[] = playerCards.map((item: PlayerCardType[]): number =>
            item.reduce(TotalRank, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number =
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        availableSuitArguments: SuitKeyofType[] = [];
    for (let i = 0; i < playerCardsCount.length; i++) {
        if (playerCardsCount[i] === minLength) {
            const suits: SuitKeyofType[] = Object.keys(player.cards) as SuitKeyofType[],
                suit: CanBeUndefType<SuitKeyofType> = suits[i];
            if (suit === undefined) {
                throw new Error(`В массиве фракций отсутствует фракция с id '${i}'.`);
            }
            const suitName: SuitKeyofType = suitsConfig[suit].suit;
            availableSuitArguments.push(suitName);
        }
    }
    return [availableSuitArguments, minLengthCount];
};

export const CheckSoloBotMustTakeCardToPickHero = (G: IMyGameState, ctx: Ctx,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): CanBeUndefType<number> => {
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
    }
    let thrudSuit: CanBeNullType<SuitKeyofType> = null;
    if (CheckPlayerHasBuff(soloBotPublicPlayer, BuffNames.MoveThrud)) {
        thrudSuit = GetBuffValue(G, ctx, BuffNames.MoveThrud) as SuitKeyofType;
    }
    const suit: CanBeUndefType<SuitKeyofType> = CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer),
        availableMoveArguments: IMoveArgumentsStage<number[]>[`args`] = [],
        availableThrudArguments: IMoveArgumentsStage<number[]>[`args`] = [];
    if (suit !== undefined) {
        const currentTavern: CanBeUndefType<CanBeNullType<DeckCardTypes>[]> =
            G.taverns[G.currentTavern] as CanBeUndefType<CanBeNullType<DeckCardTypes>[]>;
        if (currentTavern === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
        }
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument: CanBeUndefType<number> = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard: CanBeUndefType<CanBeNullType<DeckCardTypes>> =
                currentTavern[moveArgument] as CanBeUndefType<CanBeNullType<DeckCardTypes>>;
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

export const CheckSoloBotMustTakeCardWithHighestValue = (G: IMyGameState, ctx: Ctx,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): number => {
    const currentTavern: CanBeUndefType<CanBeNullType<DeckCardTypes>[]> =
        G.taverns[G.currentTavern] as CanBeUndefType<CanBeNullType<DeckCardTypes>[]>;
    if (currentTavern === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
    }
    let maxValue = 0,
        index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DeckCardTypes>> = currentTavern[moveArgument];
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
            return SoloBotMustTakeRandomCard(G, moveArguments);
        } else if (tavernCard.points !== null) {
            if (tavernCard.points > maxValue) {
                maxValue = tavernCard.points;
                index = i;
            }
        }
    }
    const finalMoveArgument: CanBeUndefType<number> = moveArguments[index];
    if (finalMoveArgument === undefined) {
        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карта обмена монет с id '${index}'.`);
    }
    return finalMoveArgument;
};

export const CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard = (G: IMyGameState, ctx: Ctx,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): CanBeUndefType<number> => {
    // TODO Least present only if arguments < suit count => < 5(1,2,3,4) or all 5 too (if all suit cards equal count)!?
    const soloBotPublicPlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
    }
    const [availableSuitArguments, minLengthCount]: [SuitKeyofType[], number] =
        CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
    if (availableSuitArguments.length !== minLengthCount) {
        throw new Error(`Недопустимое количество фракций с минимальным количеством карт.`);
    }
    const currentTavern: CanBeUndefType<CanBeNullType<DeckCardTypes>[]> =
        G.taverns[G.currentTavern] as CanBeUndefType<CanBeNullType<DeckCardTypes>[]>;
    if (currentTavern === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
    }
    const leastPresentArguments: IMoveArgumentsStage<number[]>[`args`] = [];
    let isNoPoints = false;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndefType<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndefType<CanBeNullType<DeckCardTypes>> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (tavernCard.type === RusCardTypeNames.Royal_Offering_Card) {
            continue;
        }
        if (availableSuitArguments.includes(tavernCard.suit)) {
            if (tavernCard.type === RusCardTypeNames.Dwarf_Card) {
                leastPresentArguments.push(i);
                if (tavernCard.points === null || tavernCard.suit === SuitNames.Miner) {
                    isNoPoints = true;
                }
            }
        }
    }
    if (leastPresentArguments.length === 0) {
        return undefined;
    } else if (availableSuitArguments.length === 1 || !isNoPoints) {
        return CheckSoloBotMustTakeCardWithHighestValue(G, ctx, leastPresentArguments);
    }
    return SoloBotMustTakeRandomCard(G, leastPresentArguments);
};

export const SoloBotMustTakeRandomCard = (G: IMyGameState,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): number => {
    // TODO Delete random cards with same suit but less points from random!
    const moveArgument: CanBeUndefType<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
    }
    return moveArgument;
};
