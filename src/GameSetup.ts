import { BuildPlayer, BuildPublicPlayer, IPlayer, IPublicPlayer } from "./Player";
import { BuildCards, GetAverageSuitCard, IActionCard, IAverageSuitCardData, ICard, IDeckConfig } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { marketCoinsConfig } from "./data/CoinData";
import { BuildCoins, ICoin } from "./Coin";
import { GetAllPicks, k_combinations, Permute } from "./BotConfig";
import { GeneratePrioritiesForPlayerNumbers, IPriority } from "./Priority";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { BuildHeroes, IHero } from "./Hero";
import { BuildCampCards, IArtefactCampCard, IMercenaryCampCard } from "./Camp";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { Ctx } from "boardgame.io";
import { ILogData } from "./Logging";
import { heroesConfig } from "./data/HeroData";
import { IDistinctions } from "./Distinction";

/**
 * <h3>Интерфейс для дополнений к игре.</h3>
 */
interface IExpansion {
    [name: string]: {
        active: boolean,
    },
}

/**
 * <h3>Интерфейс для объекта, хранящего скрытые (secret) данные всех игроков.</h3>
 */
interface IPlayers {
    [index: number]: IPlayer,
}

/**
 * <h3>Интерфейс для данных бота.</h3>
 */
interface IBotData {
    allCoinsOrder: number[][],
    allPicks: any,
    maxIter: number,
    deckLength: number,
}

interface IAverageCard {
    [index: string]: ICard,
}

/**
 * <h3>Типы данных для дек карт.</h3>
 */
export type DeckCardTypes = ICard | IActionCard;

/**
 * <h3>Типы данных для дек карт кэмпа.</h3>
 */
export type CampDeckCardTypes = IArtefactCampCard | IMercenaryCampCard;

/**
 * <h3>Типы данных для кэмпа.</h3>
 */
export type CampCardTypes = null | CampDeckCardTypes;

/**
 * <h3>Типы данных для карт таверн.</h3>
 */
export type TavernCardTypes = null | DeckCardTypes;

/**
 * <h3>Типы данных для преимуществ.</h3>
 */
export type DistinctionTypes = null | undefined | number;

/**
 * <h3>Интерфейс для игровых пользовательских данных G.</h3>
 */
export interface MyGameState {
    actionsNum: number,
    averageCards: IAverageCard,
    botData: IBotData,
    camp: CampCardTypes[],
    campDecks: CampDeckCardTypes[][],
    campNum: number,
    campPicked: boolean,
    currentTavern: number,
    debug: boolean,
    decks: DeckCardTypes[][],
    discardCampCardsDeck: CampDeckCardTypes[],
    discardCardsDeck: DeckCardTypes[],
    distinctions: IDistinctions,
    drawProfit: string,
    drawSize: number,
    exchangeOrder: (number | undefined)[],
    expansions: IExpansion,
    heroes: IHero[],
    log: boolean,
    logData: ILogData[],
    marketCoins: ICoin[],
    marketCoinsUnique: ICoin[],
    suitIdForMjollnir: null | string,
    suitsNum: number,
    taverns: TavernCardTypes[][],
    tavernsNum: number,
    tierToEnd: number,
    totalScore: number[],
    players: IPlayers,
    publicPlayers: IPublicPlayer[],
    publicPlayersOrder: number[],
    winner: number[],
}

/**
 * <h3>Сетап игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param ctx
 * @returns Данные игры.
 */
export const SetupGame = (ctx: Ctx): MyGameState => {
    const suitsNum: number = 5,
        tierToEnd: number = 2,
        campNum: number = 5,
        actionsNum: number = 0,
        log: boolean = true,
        debug: boolean = false,
        drawProfit: string = ``,
        suitIdForMjollnir: null = null,
        expansions: IExpansion = {
            thingvellir: {
                active: true,
            },
        },
        totalScore: number[] = [],
        logData: ILogData[] = [],
        decks: DeckCardTypes[][] = [],
        discardCardsDeck: DeckCardTypes[] = [],
        campDecks: CampDeckCardTypes[][] = [],
        distinctions: IDistinctions = {};
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            distinctions[suit] = null;
        }
    }
    let winner: number[] = [],
        campPicked: boolean = false,
        camp: CampDeckCardTypes[] = [],
        discardCampCardsDeck: CampDeckCardTypes[] = [];
    if (expansions.thingvellir.active) {
        for (let i: number = 0; i < tierToEnd; i++) {
            // todo Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            campDecks[i] = ctx.random!.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (let i: number = 0; i < tierToEnd; i++) {
        // todo Deck cards must be hidden from users?
        decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
        } as IDeckConfig, {
            players: ctx.numPlayers,
            tier: i,
        } as IAverageSuitCardData);
        decks[i] = ctx.random!.Shuffle(decks[i]);
    }
    const heroesConfigOptions: string[] = ["base"];
    for (const expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigOptions.push(expansion);
        }
    }
    const heroes: IHero[] = BuildHeroes(heroesConfigOptions, heroesConfig),
        taverns: DeckCardTypes[][] = [],
        tavernsNum: number = 3,
        currentTavern: number = -1,
        drawSize: number = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i: number = 0; i < tavernsNum; i++) {
        // todo Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players: IPlayers = {},
        publicPlayers: IPublicPlayer[] = [],
        publicPlayersOrder: number[] = [],
        exchangeOrder: number[] = [];
    let priorities: IPriority[] = GeneratePrioritiesForPlayerNumbers(ctx.numPlayers);
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        const randomPriorityIndex: number = Math.floor(Math.random() * priorities.length),
            priority: IPriority = priorities.splice(randomPriorityIndex, 1)[0];
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer("Dan" + i, priority);
    }
    const marketCoinsUnique: ICoin[] = [],
        marketCoins: ICoin[] = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
            isInitial: false,
            isTriggerTrading: false,
        });
    const averageCards: IAverageCard = {},
        initHandCoinsId: number[] = Array(players[0].boardCoins.length).fill(undefined)
            .map((item: undefined, index: number): number => index),
        initCoinsOrder: number[][] = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder: number[][] = [];
    for (const suit in suitsConfig) {
        if (suitsConfig.hasOwnProperty(suit)) {
            averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {
                players: ctx.numPlayers,
                tier: 0,
            } as IAverageSuitCardData);
        }
    }
    for (let i: number = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    const botData: IBotData = {
        allCoinsOrder,
        allPicks: GetAllPicks({ tavernsNum, playersNum: ctx.numPlayers }),
        maxIter: 1000,
        deckLength: decks[0].length,
    };
    return {
        actionsNum,
        averageCards,
        botData,
        camp,
        campDecks,
        campNum,
        campPicked,
        currentTavern,
        debug,
        decks,
        discardCampCardsDeck,
        discardCardsDeck,
        distinctions,
        drawProfit,
        drawSize,
        exchangeOrder,
        expansions,
        heroes,
        log,
        logData,
        marketCoins,
        marketCoinsUnique,
        suitIdForMjollnir,
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
