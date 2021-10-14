import {BuildPlayer, BuildPublicPlayer} from "./Player";
import {BuildCards, GetAverageSuitCard} from "./Card";
import {suitsConfig} from "./data/SuitData";
import {marketCoinsConfig} from "./data/CoinData";
import {BuildCoins} from "./Coin";
import {Permute, k_combinations, GetAllPicks} from "./BotConfig";
import {BuildPriorities} from "./Priority";
import {actionCardsConfigArray} from "./data/ActionCardData";
import {BuildHeroes} from "./Hero";
import {BuildCampCards} from "./Camp";
import {artefactsConfig, mercenariesConfig} from "./data/CampData";

/**
 * <h3>Сетап игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Данные используются в игре.</li>
 * </ol>
 *
 * @param ctx
 * @returns {{log: boolean, suitsNum: number, campNum: number, campPicked: boolean, tavernsNum: number, discardCampCardsDeck: *[], tierToEnd: number, currentTavern: null, marketCoins: *[], drawSize: (number|*), heroes: *[], suitIdForMjollnir: null, discardCardsDeck: *[], drawProfit: null, logData: *[], distinctions: any[], decks: *[], expansions: {thingvellir: {active: boolean}}, taverns: *[], exchangeOrder: *[], averageCards: *[], botData: {allCoinsOrder: *[], allPicks: FlatArray<*[], 1>, maxIter: number, deckLength}, debug: boolean, players: {}, actionsNum: null, totalScore: *[], camp: *[], winner: null, campDecks: *[], playersOrder: *[], publicPlayers: {}, marketCoinsUnique: *[]}}
 * @constructor
 */
export const SetupGame = (ctx) => {
    const suitsNum = 5,
        tierToEnd = 2,
        campNum = 5,
        actionsNum = null,
        log = true,
        debug = false,
        drawProfit = null,
        suitIdForMjollnir = null,
        expansions = {
            thingvellir: {
                active: true,
            },
        },
        totalScore = [],
        logData = [],
        decks = [],
        discardCardsDeck = [],
        campDecks = [],
        distinctions = Array(suitsNum).fill(null);
    let winner = null,
        campPicked = false,
        camp = [],
        discardCampCardsDeck = [];
    if (expansions.thingvellir.active) {
        for (let i = 0; i < tierToEnd; i++) {
            // todo Camp cards must be hidden from users?
            campDecks[i] = BuildCampCards(i, artefactsConfig, mercenariesConfig);
            campDecks[i] = ctx.random.Shuffle(campDecks[i]);
        }
        camp = campDecks[0].splice(0, campNum);
    }
    for (let i = 0; i < tierToEnd; i++) {
        // todo Deck cards must be hidden from users?
        decks[i] = BuildCards({suits: suitsConfig, actions: actionCardsConfigArray}, {
            players: ctx.numPlayers,
            tier: i
        });
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    const heroesConfigArray = ["base"];
    for (const expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigArray.push(expansion);
        }
    }
    const heroes = BuildHeroes(heroesConfigArray),
        taverns = [],
        tavernsNum = 3,
        currentTavern = null,
        drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        // todo Taverns cards must be hidden from users?
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players = {},
        publicPlayers = [],
        playersOrder = [],
        exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = BuildPlayer();
        publicPlayers[i] = BuildPublicPlayer(ctx.numPlayers, suitsNum, "Dan" + i);
    }
    BuildPriorities(ctx.numPlayers, publicPlayers);
    const marketCoinsUnique = [],
        marketCoins = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
            isInitial: false,
            isTriggerTrading: false,
        });
    const averageCards = [],
        initHandCoinsId = Array(players[0].boardCoins.length).fill(undefined)
            .map((item, index) => index),
        initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder = [];
    for (const suit in suitsConfig) {
        averageCards[suit] = GetAverageSuitCard(suitsConfig[suit], {players: ctx.numPlayers, tier: 0});
    }
    for (let i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    const botData = {
        allCoinsOrder,
        allPicks: GetAllPicks({tavernsNum, playersNum: ctx.numPlayers}),
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
        playersOrder,
        exchangeOrder,
        marketCoins,
        marketCoinsUnique,
        averageCards,
        botData,
    };
};
