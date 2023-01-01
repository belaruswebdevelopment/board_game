import { suitsConfig } from "./data/SuitData";
import { ThrowMyError } from "./Error";
import { GetCardsFromSecretDwarfDeck } from "./helpers/DecksHelpers";
import { DiscardCurrentCard } from "./helpers/DiscardCardHelpers";
import { CheckValkyryRequirement } from "./helpers/MythologicalCreatureHelpers";
import { AddDataToLog } from "./Logging";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { ErrorNames, LogTypeNames, SuitNames, ValkyryBuffNames } from "./typescript/enums";
import type { CanBeUndefType, Distinctions, DwarfDeckCardType, FnContext, IPublicPlayer, PlayerRanksAndMaxRanksForDistinctionsType } from "./typescript/interfaces";

/**
 * <h3>Высчитывает наличие единственного игрока с преимуществом по количеству шевронов в конкретной фракции в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При подсчёте преимуществ по количеству шевронов фракций в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param context
 * @param suit Фракция.
 * @returns Индекс единственного игрока с преимуществом по количеству шевронов фракции, если имеется.
 */
const CheckCurrentSuitDistinction = ({ G, ctx, ...rest }: FnContext, suit: SuitNames): Distinctions => {
    const [playersRanks, max]: PlayerRanksAndMaxRanksForDistinctionsType =
        CountPlayerRanksAndMaxRanksForCurrentDistinction({ G, ctx, ...rest }, suit),
        maxPlayers: number[] = playersRanks.filter((count: number): boolean => count === max);
    if (maxPlayers.length === 1) {
        const maxPlayerIndex: CanBeUndefType<number> = maxPlayers[0];
        if (maxPlayerIndex === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentSuitDistinctionPlayerIndexIsUndefined,
                suit);
        }
        const playerDistinctionIndex: number = playersRanks.indexOf(maxPlayerIndex);
        if (playerDistinctionIndex === -1) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount, max, suit);
        }
        const playerDist: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerDistinctionIndex];
        if (playerDist === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                playerDistinctionIndex);
        }
        if (G.expansions.Idavoll.active) {
            CheckValkyryRequirement({ G, ctx, myPlayerID: String(playerDistinctionIndex), ...rest },
                ValkyryBuffNames.CountDistinctionAmount);
        }
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Преимущество по фракции '${suitsConfig[suit].suitName}' получил игрок: '${playerDist.nickname}'.`);
        return String(playerDistinctionIndex);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Преимущество по фракции '${suitsConfig[suit].suitName}' никто не получил.`);
    return undefined;
};

/**
 * <h3>Высчитывает наличие игроков с преимуществом по количеству шевронов конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При подсчёте преимуществ по количеству шевронов фракции в конце игры (фракция воинов).</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns Индексы игроков с преимуществом по количеству шевронов конкретной фракции.
 */
export const CheckCurrentSuitDistinctionPlayers = ({ G, ctx, ...rest }: FnContext, suit: SuitNames): number[] => {
    const [playersRanks, max]: PlayerRanksAndMaxRanksForDistinctionsType =
        CountPlayerRanksAndMaxRanksForCurrentDistinction({ G, ctx, ...rest }, suit),
        maxPlayers: number[] = [];
    playersRanks.forEach((value: number, index: number): void => {
        if (value === max) {
            maxPlayers.push(index);
            const playerIndex: CanBeUndefType<IPublicPlayer> = G.publicPlayers[index];
            if (playerIndex === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    index);
            }
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Преимущество по фракции '${suitsConfig[suit].suitName}' получил игрок: '${playerIndex.nickname}'.`);
        }
    });
    if (!maxPlayers.length) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.SuitDistinctionMustBePresent,
            suitsConfig[suit].suitName);
    }
    return maxPlayers;
};

/**
 * <h3>Подсчёт преимуществ по количеству шевронов фракций в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрабатывает в начале фазы получения преимуществ по количеству шевронов каждой фракции в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const CheckAllSuitsDistinctions = ({ G, ctx, ...rest }: FnContext): void => {
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Преимущество по фракциям в конце эпохи:`);
    let suit: SuitNames;
    for (suit in suitsConfig) {
        const result: Distinctions = CheckCurrentSuitDistinction({ G, ctx, ...rest }, suit);
        G.distinctions[suit] = result;
        RemoveOneCardFromTierTwoDeckIfNoExplorerDistinction({ G, ctx, ...rest }, suit, result);
    }
};

/**
 * <h3>Подсчёт количество шевронов каждого игрока конкретной фракции и максимальное количество шевронов конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При получении преимуществ по количеству шевронов каждой фракции в фазе 'Смотр войск'.</li>
 * <li>При получении преимущества по количеству шевронов фракции 'Воины' в конце игры.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @returns [Количество шевронов каждого игрока конкретной фракции, Максимальное количество шевронов конкретной фракции].
 */
const CountPlayerRanksAndMaxRanksForCurrentDistinction = ({ G, ctx, ...rest }: FnContext, suit: SuitNames):
    PlayerRanksAndMaxRanksForDistinctionsType => {
    const playersRanks: number[] = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const playerI: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
        if (playerI === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                i);
        }
        playersRanks.push(playerI.cards[suit].reduce(TotalRank, 0));
    }
    const max: number = Math.max(...playersRanks);
    if (max === 0) {
        return ThrowMyError({ G, ctx, ...rest },
            ErrorNames.PlayersCurrentSuitCardsMustHaveCardsForDistinction,
            suitsConfig[suit].suitName);
    }
    return [playersRanks, max];
};

/**
 * <h3>Удаляет одну карту из колоды карт второй эпохи, если никто из игроков не получил преимущество по фракции 'Разведчики' в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При получении преимуществ по количеству шевронов фракции 'Разведчики' в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param context
 * @param suit Название фракции дворфов.
 * @param result Id игрока, получившего преимущество (если имеется).
 * @returns
 */
const RemoveOneCardFromTierTwoDeckIfNoExplorerDistinction = ({ G, ctx, ...rest }: FnContext, suit: SuitNames,
    result: Distinctions): void => {
    // TODO if (suit === SuitNames.explorer) here or in CheckAllSuitsDistinctions?
    if (suit === SuitNames.explorer && result === undefined) {
        const discardedCard: CanBeUndefType<DwarfDeckCardType> =
            GetCardsFromSecretDwarfDeck({ G, ctx, ...rest }, 1, 0, 1)[0];
        if (discardedCard === undefined) {
            return ThrowMyError({ G, ctx, ...rest },
                ErrorNames.NoCardsToDiscardWhenNoWinnerInExplorerDistinction);
        }
        DiscardCurrentCard({ G, ctx, ...rest }, discardedCard);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Из-за отсутствия преимущества по фракции разведчиков сброшена карта: '${discardedCard.name}'.`);
    }
};
