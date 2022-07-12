import type { Ctx } from "boardgame.io";
import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildCoins } from "./Coin";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { initialPlayerCoinsConfig, marketCoinsConfig } from "./data/CoinData";
import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { suitsConfig } from "./data/SuitData";
import { BuildDwarfCards } from "./Dwarf";
import { BuildHeroes } from "./Hero";
import { BuildMultiSuitCards } from "./MultiSuitCard";
import { BuildMythologicalCreatureCards } from "./MythologicalCreature";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { BuildRoyalOfferingCards } from "./RoyalOffering";
import { BuildSpecialCards } from "./SpecialCard";
import { GameNames } from "./typescript/enums";
import type { CampDeckCardTypes, CanBeUndef, DeckCardTypes, DistinctionTypes, ExpansionTypes, IBotData, ICoin, IDwarfCard, IExpansions, IHeroCard, ILogData, IMultiSuitCard, IMultiSuitPlayerCard, IMyGameState, IPlayers, IPlayersNumberTierCardData, IPriority, IPublicPlayers, IRoyalOfferingCard, ISecret, ISpecialCard, MythologicalCreatureDeckCardTypes, SuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

/**
 * <h3>Инициализация игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param ctx
 * @returns Данные игры.
 */
export const SetupGame = (ctx: Ctx): IMyGameState => {
    const suitsNum = 5,
        tierToEnd = 2,
        campNum = 5,
        round = -1,
        soloGameDifficultyLevel = null,
        explorerDistinctionCardId = null,
        multiplayer = false,
        // TODO Rework it!
        solo = ctx.numPlayers === 2,
        odroerirTheMythicCauldron = false,
        log = true,
        debug = false,
        tavernCardDiscarded2Players = false,
        drawProfit = ``,
        expansions: IExpansions = {
            thingvellir: {
                active: solo ? false : true,
            },
            // TODO Fix me to "true" after expansion finished
            idavoll: {
                active: solo ? false : false,
            },
        },
        totalScore: number[] = [],
        logData: ILogData[] = [],
        odroerirTheMythicCauldronCoins: ICoin[] = [],
        specialCardsDeck: ISpecialCard[] = BuildSpecialCards(),
        configOptions: GameNames[] = [GameNames.Basic],
        multiCardsDeck: IMultiSuitCard[] = BuildMultiSuitCards(configOptions),
        discardCardsDeck: DeckCardTypes[] = [],
        explorerDistinctionCards: DeckCardTypes[] = [],
        distinctions: SuitPropertyTypes<DistinctionTypes> = {} as SuitPropertyTypes<DistinctionTypes>,
        secret: ISecret = {
            campDecks: [],
            decks: [],
            // TODO Add Idavoll deck length info on main page?
            mythologicalCreatureDecks: [],
        };
    if (solo && multiplayer) {
        throw new Error(`Не может быть одновременно режим мультиплеера и соло игры.`);
    }
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner: number[] = [],
        campPicked = false,
        mustDiscardTavernCardJarnglofi = null,
        discardCampCardsDeck: CampDeckCardTypes[] = [],
        discardMythologicalCreaturesCards: MythologicalCreatureDeckCardTypes[] = [],
        discardMultiCards: IMultiSuitPlayerCard[] = [],
        discardSpecialCards: ISpecialCard[] = [],
        campDeckLength: [number, number] = [0, 0],
        camp: CampDeckCardTypes[] = Array(campNum).fill(null);
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            secret.campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            let campDeck: CanBeUndef<CampDeckCardTypes[]> = secret.campDecks[i];
            if (campDeck === undefined) {
                throw new Error(`Колода карт лагеря ${i} эпохи не может отсутствовать.`);
            }
            campDeck = ctx.random!.Shuffle(campDeck);
            secret.campDecks[i] = campDeck;
            campDeckLength[i] = campDeck.length;
        }
        const campDeck0: CanBeUndef<CampDeckCardTypes[]> = secret.campDecks[0];
        if (campDeck0 === undefined) {
            throw new Error(`Колода карт лагеря 1 эпохи не может отсутствовать.`);
        }
        campDeckLength[0] = campDeck0.length;
    }
    const deckLength: [number, number] = [0, 0];
    for (let i = 0; i < tierToEnd; i++) {
        secret.decks[i] = [];
        const data: IPlayersNumberTierCardData = {
            players: ctx.numPlayers,
            tier: i,
        },
            dwarfDeck: IDwarfCard[] = BuildDwarfCards(data),
            royalOfferingDeck: IRoyalOfferingCard[] = BuildRoyalOfferingCards(data);
        let deck: CanBeUndef<DeckCardTypes[]> = secret.decks[i];
        if (deck === undefined) {
            throw new Error(`Колода карт ${i} эпохи не может отсутствовать.`);
        }
        deck = deck.concat(dwarfDeck, royalOfferingDeck);
        deckLength[i] = deck.length;
        secret.decks[i] = ctx.random!.Shuffle(deck);
    }
    let expansion: ExpansionTypes;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            configOptions.push(expansion as GameNames);
        }
    }
    const [heroes, heroesForSoloBot, heroesForSoloGameDifficultyLevel]: [IHeroCard[], IHeroCard[], IHeroCard[]] =
        BuildHeroes(configOptions, solo),
        taverns: (DeckCardTypes[] | MythologicalCreatureDeckCardTypes[])[] = [],
        tavernsNum = 3,
        currentTavern = -1,
        drawSize: number = ctx.numPlayers === 2 ? 3 : ctx.numPlayers,
        deck0: CanBeUndef<DeckCardTypes[]> = secret.decks[0];
    if (deck0 === undefined) {
        throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
    }
    let mythologicalCreatureDeckLength = 0;
    if (expansions.idavoll.active) {
        secret.mythologicalCreatureDecks =
            BuildMythologicalCreatureCards(giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig);
        secret.mythologicalCreatureDecks = ctx.random!.Shuffle(secret.mythologicalCreatureDecks);
        mythologicalCreatureDeckLength = secret.mythologicalCreatureDecks.length;
    }
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = [];
        deckLength[0] = deck0.length;
    }
    const players: IPlayers = {},
        publicPlayers: IPublicPlayers = {},
        publicPlayersOrder: string[] = [],
        exchangeOrder: number[] = [],
        priorities: IPriority[] = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers, solo);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex: number = solo ? 0 : Math.floor(Math.random() * priorities.length),
            priority: CanBeUndef<IPriority> = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        const soloBot: boolean = solo && i === 1;
        publicPlayers[i] =
            BuildPublicPlayer(soloBot ? `SoloBot` : `Dan` + i, priority, multiplayer);
    }
    const marketCoinsUnique: ICoin[] = [],
        marketCoins: ICoin[] = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
        }),
        averageCards: SuitPropertyTypes<IDwarfCard> = {} as SuitPropertyTypes<IDwarfCard>;
    for (suit in suitsConfig) {
        averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0,
        });
    }
    const initHandCoinsId: number[] = Array(initialPlayerCoinsConfig.length).fill(undefined)
        .map((item: undefined, index: number): number => index),
        initCoinsOrder: number[][] = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder: number[][] = [];
    for (let i = 0; i < initCoinsOrder.length; i++) {
        const coinsOrder: CanBeUndef<number[]> = initCoinsOrder[i];
        if (coinsOrder === undefined) {
            throw new Error(`Отсутствует порядок выкладки монет ${i}.`);
        }
        allCoinsOrder = allCoinsOrder.concat(Permute(coinsOrder));
    }
    const cardDeck0: CanBeUndef<DeckCardTypes[]> = secret.decks[0];
    if (cardDeck0 === undefined) {
        throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
    }
    const botData: IBotData = {
        allCoinsOrder,
        allPicks: GetAllPicks(tavernsNum, ctx.numPlayers),
        maxIter: 1000,
        deckLength: cardDeck0.length,
    };
    return {
        multiplayer,
        solo,
        soloGameDifficultyLevel,
        odroerirTheMythicCauldron,
        tavernCardDiscarded2Players,
        averageCards,
        botData,
        odroerirTheMythicCauldronCoins,
        camp,
        explorerDistinctionCards,
        explorerDistinctionCardId,
        deckLength,
        campDeckLength,
        mythologicalCreatureDeckLength,
        secret,
        campNum,
        campPicked,
        mustDiscardTavernCardJarnglofi,
        currentTavern,
        debug,
        multiCardsDeck,
        specialCardsDeck,
        discardCampCardsDeck,
        discardCardsDeck,
        discardMythologicalCreaturesCards,
        discardMultiCards,
        discardSpecialCards,
        distinctions,
        drawProfit,
        drawSize,
        exchangeOrder,
        expansions,
        heroes,
        heroesForSoloBot,
        heroesForSoloGameDifficultyLevel,
        log,
        logData,
        marketCoins,
        marketCoinsUnique,
        round,
        suitsNum,
        taverns,
        tavernsNum,
        tierToEnd,
        totalScore,
        players,
        publicPlayers,
        publicPlayersOrder,
        winner,
    };
};
