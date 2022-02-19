import { Ctx } from "boardgame.io";
import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { GetAllPicks, k_combinations, Permute } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildAdditionalCards, BuildCards } from "./Card";
import { BuildCoins } from "./Coin";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { marketCoinsConfig } from "./data/CoinData";
import { heroesConfig } from "./data/HeroData";
import { suitsConfig } from "./data/SuitData";
import { BuildHeroes } from "./Hero";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { CampDeckCardTypes, DeckCardTypes, DistinctionTypes, IBotData, ICard, ICoin, IExpansions, IHeroCard, ILogData, IMyGameState, IPlayers, IPriority, IPublicPlayer, OptionalSuitPropertyTypes, RequiredSuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

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
        log = true,
        debug = false,
        drawProfit = ``,
        expansions: IExpansions = {
            thingvellir: {
                active: true,
            },
        },
        totalScore: number[] = [],
        logData: ILogData[] = [],
        decks: DeckCardTypes[][] = [],
        additionalCardsDeck: ICard[] = BuildAdditionalCards(),
        // TODO Discard cards must be hidden from users?
        discardCardsDeck: DeckCardTypes[] = [],
        campDecks: CampDeckCardTypes[][] = [],
        distinctions: OptionalSuitPropertyTypes<DistinctionTypes> = {};
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            distinctions[suit as SuitTypes] = null;
        }
    }
    const winner: number[] = [],
        campPicked = false,
        discardCampCardsDeck: CampDeckCardTypes[] = [];
    let camp: CampDeckCardTypes[] = [];
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            // TODO Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            campDecks[i] = ctx.random!.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (let i = 0; i < tierToEnd; i++) {
        // TODO Deck cards must be hidden from users?
        decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
        }, {
            players: ctx.numPlayers,
            tier: i,
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        decks[i] = ctx.random!.Shuffle(decks[i]);
    }
    const heroesConfigOptions: string[] = [`base`];
    for (const expansion in expansions) {
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
        // TODO Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players: IPlayers = {},
        publicPlayers: IPublicPlayer[] = [],
        publicPlayersOrder: string[] = [],
        exchangeOrder: number[] = [],
        priorities: IPriority[] = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex: number = Math.floor(Math.random() * priorities.length),
            priority: IPriority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer(`Dan` + i, priority);
    }
    const marketCoinsUnique: ICoin[] = [],
        marketCoins: ICoin[] = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
            isInitial: false,
            isTriggerTrading: false,
        });
    const averageCards: OptionalSuitPropertyTypes<ICard> = {},
        initHandCoinsId: number[] = Array(players[0].boardCoins.length).fill(undefined)
            .map((item: undefined, index: number): number => index),
        initCoinsOrder: number[][] = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder: number[][] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            averageCards[suit as SuitTypes] = GetAverageSuitCard(suitsConfig[suit as SuitTypes], {
                players: ctx.numPlayers,
                tier: 0,
            });
        }
    }
    for (let i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    const botData: IBotData = {
        allCoinsOrder,
        allPicks: GetAllPicks(tavernsNum, ctx.numPlayers),
        maxIter: 1000,
        deckLength: decks[0].length,
    };
    return {
        averageCards: averageCards as RequiredSuitPropertyTypes<ICard>,
        botData,
        camp,
        campDecks,
        campNum,
        campPicked,
        currentTavern,
        debug,
        decks,
        additionalCardsDeck,
        discardCampCardsDeck,
        discardCardsDeck,
        distinctions: distinctions as RequiredSuitPropertyTypes<DistinctionTypes>,
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
