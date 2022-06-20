import { suitsConfig } from "../data/SuitData";
import { IsDwarfCard } from "../Dwarf";
import { IsRoyalOfferingCard } from "../RoyalOffering";
import { TotalRank } from "../score_helpers/ScoreHelpers";
import { SuitNames } from "../typescript/enums";
import type { CanBeUndef, IHeroCard, IMoveArgumentsStage, IMyGameState, IPublicPlayer, PlayerCardTypes, SuitTypes, TavernCardTypes } from "../typescript/interfaces";

export const CheckIfSoloBotMustTakeCardToPickHero = (G: IMyGameState,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): number | undefined => {
    const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    }
    const playerCards: PlayerCardTypes[][] = Object.values(soloBotPublicPlayer.cards),
        heroesLength: number = soloBotPublicPlayer.heroes.filter((hero: IHeroCard): boolean =>
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
        const suits: SuitTypes[] = Object.keys(soloBotPublicPlayer.cards) as SuitTypes[],
            suit: CanBeUndef<SuitTypes> = suits[suitIndex];
        if (suit === undefined) {
            throw new Error(`В массиве фракций отсутствует фракция с id '${suitIndex}'.`);
        }
        const suitName: SuitTypes = suitsConfig[suit].suit,
            currentTavern: CanBeUndef<TavernCardTypes[]> = G.taverns[G.currentTavern];
        if (currentTavern === undefined) {
            throw new Error(`В массиве таверн отсутствует текущая таверна с id '${G.currentTavern}'.`);
        }
        const availableMoveArguments: IMoveArgumentsStage<number[]>[`args`] = [];
        for (let i = 0; i < moveArguments.length; i++) {
            const moveArgument: CanBeUndef<number> = moveArguments[i];
            if (moveArgument === undefined) {
                throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
            }
            const tavernCard: CanBeUndef<TavernCardTypes> = currentTavern[moveArgument];
            if (tavernCard === undefined) {
                throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
            }
            if (tavernCard === null) {
                // TODO Add Error that NULL can't be moveArguments value
                continue;
            }
            if (IsRoyalOfferingCard(tavernCard)) {
                continue;
            }
            // TODO Fix it
            if (`suit` in tavernCard && tavernCard.suit === suitName) {
                availableMoveArguments.push(i);
            }
        }
        if (availableMoveArguments.length === 1) {
            return availableMoveArguments[0];
        } else if (availableMoveArguments.length > 1) {
            return CheckIfSoloBotMustTakeCardWithHighestValue(G, availableMoveArguments);
        }
    }
    return undefined;
};

export const CheckIfSoloBotMustTakeCardWithHighestValue = (G: IMyGameState,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): number => {
    const currentTavern: CanBeUndef<TavernCardTypes[]> = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`В массиве таверн отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    let maxValue = 0,
        index = 0;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndef<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndef<TavernCardTypes> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (IsRoyalOfferingCard(tavernCard)) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карта обмена монет с id '${moveArgument}'.`);
        }
        // TODO Fix it
        if (`points` in tavernCard && tavernCard.points === null) {
            return moveArgument;
        } else if (`points` in tavernCard && tavernCard.points !== null) {
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

export const CheckIfSoloBotMustTakeCardWithSuitsLeastPresentOnPlayerBoard = (G: IMyGameState,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): number | undefined => {
    const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1];
    if (soloBotPublicPlayer === undefined) {
        throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
    }
    const playerCards: PlayerCardTypes[][] = Object.values(soloBotPublicPlayer.cards),
        playerCardsCount: number[] = playerCards.map((item: PlayerCardTypes[]): number =>
            item.reduce(TotalRank, 0)),
        minLength: number = Math.min(...playerCardsCount),
        minLengthCount: number =
            playerCardsCount.filter((length: number): boolean => length === minLength).length,
        availableSuitArguments: SuitTypes[] = [];
    for (let i = 0; i < playerCardsCount.length; i++) {
        if (playerCardsCount[i] === minLength) {
            const suits: SuitTypes[] = Object.keys(soloBotPublicPlayer.cards) as SuitTypes[],
                suit: CanBeUndef<SuitTypes> = suits[i];
            if (suit === undefined) {
                throw new Error(`В массиве фракций отсутствует фракция с id '${i}'.`);
            }
            const suitName: SuitTypes = suitsConfig[suit].suit;
            availableSuitArguments.push(suitName);
        }
    }
    if (availableSuitArguments.length !== minLengthCount) {
        throw new Error(`Недопустимое количество фракций с минимальным количеством карт.`);
    }
    if (availableSuitArguments.length === 1) {
        return CheckIfSoloBotMustTakeCardWithHighestValue(G, moveArguments);
    }
    const currentTavern: CanBeUndef<TavernCardTypes[]> = G.taverns[G.currentTavern];
    if (currentTavern === undefined) {
        throw new Error(`В массиве таверн отсутствует текущая таверна с id '${G.currentTavern}'.`);
    }
    const leastPresentArguments: IMoveArgumentsStage<number[]>[`args`] = [];
    let isNoPoints = false;
    for (let i = 0; i < moveArguments.length; i++) {
        const moveArgument: CanBeUndef<number> = moveArguments[i];
        if (moveArgument === undefined) {
            throw new Error(`В массиве аргументов мува отсутствует аргумент с id '${i}'.`);
        }
        const tavernCard: CanBeUndef<TavernCardTypes> = currentTavern[moveArgument];
        if (tavernCard === undefined) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' отсутствует карта с id '${moveArgument}'.`);
        }
        if (tavernCard === null) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может не быть карта с id '${moveArgument}'.`);
        }
        if (IsRoyalOfferingCard(tavernCard)) {
            throw new Error(`В массиве карт текущей таверны с id '${G.currentTavern}' не может быть карта обмена монет с id '${moveArgument}'.`);
        }
        // TODO Fix it
        if (`suit` in tavernCard && tavernCard.suit !== null
            && availableSuitArguments.includes(tavernCard.suit)) {
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
    }
    if (!isNoPoints) {
        return CheckIfSoloBotMustTakeCardWithHighestValue(G, moveArguments);
    }
    return SoloBotMustTakeRandomCard(G, moveArguments);
};

export const SoloBotMustTakeRandomCard = (G: IMyGameState,
    moveArguments: IMoveArgumentsStage<number[]>[`args`]): number => {
    const moveArgument: CanBeUndef<number> = moveArguments[Math.floor(Math.random() * moveArguments.length)];
    if (moveArgument === undefined) {
        throw new Error(`Отсутствует необходимый аргумент мува для бота.`);
    }
    return moveArgument;
};
