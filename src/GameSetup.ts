import type { Ctx } from "boardgame.io";
import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildAdditionalCards, BuildCards } from "./Card";
import { BuildCoins } from "./Coin";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { initialPlayerCoinsConfig, marketCoinsConfig } from "./data/CoinData";
import { heroesConfig } from "./data/HeroData";
import { suitsConfig } from "./data/SuitData";
import { BuildHeroes } from "./Hero";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { GameNames } from "./typescript/enums";
import type { CampDeckCardTypes, DeckCardTypes, DistinctionTypes, ExpansionTypes, IBotData, ICard, ICoin, IExpansions, IHeroCard, ILogData, IMyGameState, IPlayers, IPriority, IPublicPlayers, ISecret, SuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

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
        explorerDistinctionCardId = null,
        multiplayer = false,
        odroerirTheMythicCauldron = false,
        log = true,
        debug = false,
        tavernCardDiscarded2Players = false,
        drawProfit = ``,
        expansions: IExpansions = {
            thingvellir: {
                active: true,
            },
        },
        totalScore: number[] = [],
        logData: ILogData[] = [],
        odroerirTheMythicCauldronCoins: ICoin[] = [],
        additionalCardsDeck: ICard[] = BuildAdditionalCards(),
        discardCardsDeck: DeckCardTypes[] = [],
        explorerDistinctionCards: DeckCardTypes[] = [],
        distinctions: Partial<SuitPropertyTypes<DistinctionTypes>> = {},
        secret: ISecret = {
            campDecks: [],
            decks: [],
        };
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        distinctions[suit] = null;
    }
    const winner: number[] = [],
        campPicked = false,
        mustDiscardTavernCardJarnglofi = null,
        discardCampCardsDeck: CampDeckCardTypes[] = [],
        campDeckLength: [number, number] = [0, 0];
    let camp: CampDeckCardTypes[] = [];
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            secret.campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            let campDeck: CampDeckCardTypes[] | undefined = secret.campDecks[i];
            if (campDeck === undefined) {
                throw new Error(`Колода карт лагеря ${i} эпохи не может отсутствовать.`);
            }
            campDeck = ctx.random!.Shuffle(campDeck);
            secret.campDecks[i] = campDeck;
            campDeckLength[i] = campDeck.length;
        }
        const campDeck0: CampDeckCardTypes[] | undefined = secret.campDecks[0];
        if (campDeck0 === undefined) {
            throw new Error(`Колода карт лагеря 1 эпохи не может отсутствовать.`);
        }
        camp = campDeck0.splice(0, campNum);
        campDeckLength[0] = campDeck0.length;
    }
    const deckLength: [number, number] = [0, 0];
    for (let i = 0; i < tierToEnd; i++) {
        secret.decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
        }, {
            players: ctx.numPlayers,
            tier: i,
        });
        const deck: DeckCardTypes[] | undefined = secret.decks[i];
        if (deck === undefined) {
            throw new Error(`Колода карт ${i} эпохи не может отсутствовать.`);
        }
        deckLength[i] = deck.length;
        secret.decks[i] = ctx.random!.Shuffle(deck);
    }
    const heroesConfigOptions: string[] = [GameNames.Basic];
    let expansion: ExpansionTypes;
    for (expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigOptions.push(expansion);
        }
    }
    const heroes: IHeroCard[] = BuildHeroes(heroesConfigOptions, heroesConfig),
        taverns: DeckCardTypes[][] = [],
        tavernsNum = 3,
        currentTavern = -1,
        drawSize: number = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        const deck0: DeckCardTypes[] | undefined = secret.decks[0];
        if (deck0 === undefined) {
            throw new Error(`Колода карт 1 эпохи не может отсутствовать.`);
        }
        taverns[i] = deck0.splice(0, drawSize);
        deckLength[0] = deck0.length;
    }
    const players: IPlayers = {},
        publicPlayers: IPublicPlayers = {},
        publicPlayersOrder: string[] = [],
        exchangeOrder: number[] = [],
        priorities: IPriority[] = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex: number = Math.floor(Math.random() * priorities.length),
            priority: IPriority | undefined = priorities.splice(randomPriorityIndex, 1)[0];
        if (priority === undefined) {
            throw new Error(`Отсутствует приоритет ${i}.`);
        }
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer(`Dan` + i, priority, multiplayer);
    }
    const marketCoinsUnique: ICoin[] = [],
        marketCoins: ICoin[] = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
        }),
        averageCards: Partial<SuitPropertyTypes<ICard>> = {};
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
        const coinsOrder: number[] | undefined = initCoinsOrder[i];
        if (coinsOrder === undefined) {
            throw new Error(`Отсутствует порядок выкладки монет ${i}.`);
        }
        allCoinsOrder = allCoinsOrder.concat(Permute(coinsOrder));
    }
    const cardDeck0: DeckCardTypes[] | undefined = secret.decks[0];
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
        odroerirTheMythicCauldron,
        tavernCardDiscarded2Players,
        averageCards: averageCards as SuitPropertyTypes<ICard>,
        botData,
        odroerirTheMythicCauldronCoins,
        camp,
        explorerDistinctionCards,
        explorerDistinctionCardId,
        deckLength,
        campDeckLength,
        secret,
        campNum,
        campPicked,
        mustDiscardTavernCardJarnglofi,
        currentTavern,
        debug,
        additionalCardsDeck,
        discardCampCardsDeck,
        discardCardsDeck,
        distinctions: distinctions as SuitPropertyTypes<DistinctionTypes>,
        drawProfit,
        drawSize,
        exchangeOrder,
        expansions,
        heroes,
        log,
        logData,
        marketCoins,
        marketCoinsUnique,
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
