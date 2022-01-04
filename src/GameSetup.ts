import { Ctx } from "boardgame.io";
import { GetAverageSuitCard } from "./bot_logic/BotCardLogic";
import { k_combinations, Permute, GetAllPicks } from "./bot_logic/BotConfig";
import { BuildCampCards } from "./Camp";
import { BuildCards } from "./Card";
import { BuildCoins } from "./Coin";
import { actionCardsConfigArray } from "./data/ActionCardData";
import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { marketCoinsConfig } from "./data/CoinData";
import { heroesConfig } from "./data/HeroData";
import { suitsConfig } from "./data/SuitData";
import { BuildHeroes } from "./Hero";
import { BuildPlayer, BuildPublicPlayer } from "./Player";
import { GeneratePrioritiesForPlayerNumbers } from "./Priority";
import { DeckCardTypes, CampDeckCardTypes } from "./typescript/card_types";
import { ICoin } from "./typescript/coin_interfaces";
import { IHero } from "./typescript/hero_card_interfaces";
import { MyGameState, IExpansion, ILogData, IDistinctions, IDeckConfig, IAverageSuitCardData, IAverageCard, IBotData } from "./typescript/interfaces";
import { IPlayers, IPublicPlayer } from "./typescript/player_interfaces";
import { IPriority } from "./typescript/priority_interfaces";

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
    const suitsNum = 5,
        tierToEnd = 2,
        campNum = 5,
        actionsNum = 0,
        log = true,
        debug = false,
        drawProfit = ``,
        suitIdForMjollnir = null,
        expansions: IExpansion = {
            thingvellir: {
                active: true,
            },
        },
        totalScore: number[] = [],
        logData: ILogData[] = [],
        decks: DeckCardTypes[][] = [],
        // todo Discard cards must be hidden from users?
        discardCardsDeck: DeckCardTypes[] = [],
        campDecks: CampDeckCardTypes[][] = [],
        distinctions: IDistinctions = {};
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            distinctions[suit] = null;
        }
    }
    const winner: number[] = [],
        campPicked = false,
        discardCampCardsDeck: CampDeckCardTypes[] = [];
    let camp: CampDeckCardTypes[] = [];
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            // todo Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            campDecks[i] = ctx.random!.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (let i = 0; i < tierToEnd; i++) {
        // todo Deck cards must be hidden from users?
        decks[i] = BuildCards({
            suits: suitsConfig,
            actions: actionCardsConfigArray
        } as IDeckConfig, {
            players: ctx.numPlayers,
            tier: i,
        } as IAverageSuitCardData);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        decks[i] = ctx.random!.Shuffle(decks[i]);
    }
    const heroesConfigOptions: string[] = [`base`];
    for (const expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigOptions.push(expansion);
        }
    }
    const heroes: IHero[] = BuildHeroes(heroesConfigOptions, heroesConfig),
        taverns: DeckCardTypes[][] = [],
        tavernsNum = 3,
        currentTavern = -1,
        drawSize: number = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        // todo Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players: IPlayers = {},
        publicPlayers: IPublicPlayer[] = [],
        publicPlayersOrder: number[] = [],
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
    const averageCards: IAverageCard = {},
        initHandCoinsId: number[] = Array(players[0].boardCoins.length).fill(undefined)
            .map((item: undefined, index: number): number => index),
        initCoinsOrder: number[][] = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder: number[][] = [];
    for (const suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {
                players: ctx.numPlayers,
                tier: 0,
            } as IAverageSuitCardData);
        }
    }
    for (let i = 0; i < initCoinsOrder.length; i++) {
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
