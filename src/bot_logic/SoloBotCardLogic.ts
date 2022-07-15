import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../data/SuitData";
import { IsDwarfCard } from "../Dwarf";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff, GetBuffValue } from "../helpers/BuffHelpers";
import { IsRoyalOfferingCard } from "../RoyalOffering";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { BuffNames, ErrorNames, SuitNames } from "../typescript/enums";
import type { CanBeNull, CanBeUndef, DeckCardTypes, IHeroCard, IMoveArgumentsStage, IMyGameState, IPublicPlayer, PlayerCardTypes, SuitTypes } from "../typescript/interfaces";

export const CheckSoloBotCanPickHero = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer): CanBeUndef<SuitTypes> => {
    const playerCards: PlayerCardTypes[][] = Object.values(player.cards),
        heroesLength: number = player.heroes.filter((hero: IHeroCard): boolean =>
            hero.name.startsWith(`Dwerg`)).length,
        playerCardsCount: number[] = playerCards.map((item: PlayerCardTypes[]): number =>
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
        const suits: SuitTypes[] = Object.keys(player.cards) as SuitTypes[],
            suit: CanBeUndef<SuitTypes> = suits[suitIndex];
        if (suit === undefined) {
            throw new Error(`В массиве фракций отсутствует фракция с id '${suitIndex}'.`);
        }
        return suitsConfig[suit].suit;
    }
    return undefined;
};

export const CheckSuitsLeastPresentOnPlayerBoard = (G: IMyGameState, ctx: Ctx, player: IPublicPlayer):
    [SuitTypes[], number] => {
    const playerCards: PlayerCardTypes[][] = Object.values(player.cards),
        playerCardsCount: number[] = playerCards.map((item: PlayerCardTypes[]): number =>
            item.reduce(TotalRank, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number =
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        availableSuitArguments: SuitTypes[] = [];
    for (let i = 0; i < playerCardsCount.length; i++) {
        if (playerCardsCount[i] === minLength) {
            const suits: SuitTypes[] = Object.keys(player.cards) as SuitTypes[],
                suit: CanBeUndef<SuitTypes> = suits[i];
            if (suit === undefined) {
                throw new Error(`В массиве фракций отсутствует фракция с id '${i}'.`);
            }
            const suitName: SuitTypes = suitsConfig[suit].suit;
            availableSuitArguments.push(suitName);
        }
    }
    return [availableSuitArguments, minLengthCount];
};

export const CheckSoloBotMustTakeCardToPickHero = (G: IMyGameState, ctx: Ctx,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): CanBeUndef<number> => {
    const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    }
    let thrudSuit: CanBeNull<SuitTypes> = null;
    if (CheckPlayerHasBuff(soloBotPublicPlayer, BuffNames.MoveThrud)) {
        thrudSuit = GetBuffValue(G, ctx, BuffNames.MoveThrud) as SuitTypes;
    }
    const suit: CanBeUndef<SuitTypes> = CheckSoloBotCanPickHero(G, ctx, soloBotPublicPlayer),
        availableMoveArguments: IMoveArgumentsStage<number[]>[`args`] = [],
        availableThrudArguments: IMoveArgumentsStage<number[]>[`args`] = [];
    if (suit !== undefined) {
        const currentTavern: CanBeUndef<CanBeNull<DeckCardTypes>[]> =
            G.taverns[G.currentTavern] as CanBeUndef<CanBeNull<DeckCardTypes>[]>;
        if (currentTavern === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
        }
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument: CanBeUndef<number> = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard: CanBeUndef<CanBeNull<DeckCardTypes>> =
                currentTavern[moveArgument] as CanBeUndef<CanBeNull<DeckCardTypes>>;
            if (tavernCard === undefined) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
            }
            if (tavernCard === null) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карты с id '${moveArgument}'.`);
            }
            if (IsRoyalOfferingCard(tavernCard)) {
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
            const thrudMoveArgument: CanBeUndef<number> = availableThrudArguments[0];
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
    const currentTavern: CanBeUndef<CanBeNull<DeckCardTypes>[]> =
        G.taverns[G.currentTavern] as CanBeUndef<CanBeNull<DeckCardTypes>[]>;
    if (currentTavern === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
    }
    let maxValue = 0,
        index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndef<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndef<CanBeNull<DeckCardTypes>> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (IsRoyalOfferingCard(tavernCard)) {
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
    const finalMoveArgument: CanBeUndef<number> = moveArguments[index];
    if (finalMoveArgument === undefined) {
        throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карта обмена монет с id '${index}'.`);
    }
    return finalMoveArgument;
};

export const CheckSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard = (G: IMyGameState, ctx: Ctx,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): CanBeUndef<number> => {
    // TODO Least present only if arguments < suit count => < 5(1,2,3,4) or all 5 too (if all suit cards equal count)!?
    const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    }
    const [availableSuitArguments, minLengthCount]: [SuitTypes[], number] =
        CheckSuitsLeastPresentOnPlayerBoard(G, ctx, soloBotPublicPlayer);
    if (availableSuitArguments.length !== minLengthCount) {
        throw new Error(`Недопустимое количество фракций с минимальным количеством карт.`);
    }
    const currentTavern: CanBeUndef<CanBeNull<DeckCardTypes>[]> =
        G.taverns[G.currentTavern] as CanBeUndef<CanBeNull<DeckCardTypes>[]>;
    if (currentTavern === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTavernIsUndefined, G.currentTavern);
    }
    const leastPresentArguments: IMoveArgumentsStage<number[]>[`args`] = [];
    let isNoPoints = false;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndef<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndef<CanBeNull<DeckCardTypes>> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (IsRoyalOfferingCard(tavernCard)) {
            continue;
        }
        if (availableSuitArguments.includes(tavernCard.suit)) {
            if (IsDwarfCard(tavernCard)) {
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
    const moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
    }
    return moveArgument;
};
