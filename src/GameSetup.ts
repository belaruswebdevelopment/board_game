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
import { GetSuitIndexByName } from "./helpers/SuitHelpers";

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
    log: boolean,
    debug: boolean,
    winner: number[],
    drawProfit: string,
    suitsNum: number,
    tierToEnd: number,
    campNum: number,
    actionsNum: number,
    tavernsNum: number,
    currentTavern: number,
    drawSize: number,
    suitIdForMjollnir: null | number,
    expansions: IExpansion,
    totalScore: number[],
    logData: ILogData[],
    decks: DeckCardTypes[][],
    discardCardsDeck: DeckCardTypes[],
    discardCampCardsDeck: CampDeckCardTypes[],
    heroes: IHero[],
    campDecks: CampDeckCardTypes[][],
    campPicked: boolean,
    camp: CampCardTypes[],
    distinctions: DistinctionTypes[],
    taverns: TavernCardTypes[][],
    players: IPlayers,
    publicPlayers: IPublicPlayer[],
    publicPlayersOrder: number[],
    exchangeOrder: (number | undefined)[],
    marketCoins: ICoin[],
    marketCoinsUnique: ICoin[],
    averageCards: ICard[],
    botData: IBotData,
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
        distinctions: null[] = Array(suitsNum).fill(null);
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
    const heroesConfigArray: string[] = ["base"];
    for (const expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigArray.push(expansion);
        }
    }
    const heroes: IHero[] = BuildHeroes(heroesConfigArray),
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
        publicPlayers[i] = BuildPublicPlayer(ctx.numPlayers, suitsNum, "Dan" + i, priority);
    }
    const marketCoinsUnique: ICoin[] = [],
        marketCoins: ICoin[] = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
            isInitial: false,
            isTriggerTrading: false,
        });
    const averageCards: ICard[] = [],
        initHandCoinsId: number[] = Array(players[0].boardCoins.length).fill(undefined)
            .map((item: undefined, index: number): number => index),
        initCoinsOrder: number[][] = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder: number[][] = [];
    for (const suit in suitsConfig) {
        averageCards[GetSuitIndexByName(suit)] = GetAverageSuitCard(suitsConfig[suit], {
            players: ctx.numPlayers,
            tier: 0,
        } as IAverageSuitCardData);
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
        log,
        debug,
        winner,
        drawProfit,
        suitsNum,
        tierToEnd,
        campNum,
        actionsNum,
        tavernsNum,
        currentTavern,
        drawSize,
        suitIdForMjollnir,
        expansions,
        totalScore,
        logData,
        decks,
        discardCardsDeck,
        discardCampCardsDeck,
        heroes,
        campDecks,
        campPicked,
        camp,
        distinctions,
        taverns,
        players,
        publicPlayers,
        publicPlayersOrder,
        exchangeOrder,
        marketCoins,
        marketCoinsUnique,
        averageCards,
        botData,
    };
};
