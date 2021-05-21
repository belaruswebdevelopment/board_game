import {BuildPlayer} from "./Player";
import {BuildCards, GetAverageSuitCard} from "./Card";
import {suitsConfigArray} from "./data/SuitData";
import {marketCoinsConfig} from "./data/CoinData";
import {BuildCoins} from "./Coin";
import {Permute, k_combinations, GetAllPicks} from "./BotConfig";

export const SetupGame = (ctx) => {
    const suitsNum = 5,
        tierToEnd = 2,
        campNum = 5,
        debug = false,
        expansions = {
            thingvellir: {
                active: true,
            },
        },
        decks = [],
        heroes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        // todo fix it
        campDeck = [{points: 0},{points: 1},{points: 2},{points: 3},{points: 4}],
        camp = [{points: 0}, {points: 1}, {points: 2}, {points: 3}, {points: 4}];
    for (let i = 0; i < tierToEnd; i++) {
        decks[i] = BuildCards(suitsConfigArray, {players: ctx.numPlayers, tier: i});
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    // todo move taverns in separate config data file + images for it
    const taverns = [],
        tavernsNum = 3,
        drawSize = ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players = [],
        playersOrder = [],
        exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = BuildPlayer(i);
    }
    const marketCoinsUnique = [],
        marketCoins = BuildCoins(marketCoinsConfig, {
            count: marketCoinsUnique,
            players: ctx.numPlayers,
            isInitial: false,
            isTriggerTrading: false,
        });
    const botData = {},
        averageCards = [],
        initHandCoinsId = Array(players[0].boardCoins.length).fill(undefined).map((item, index) => index),
        initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder = [];
    for (let i = 0; i < suitsNum; i++) {
        averageCards[i] = GetAverageSuitCard(suitsConfigArray[i], {players: ctx.numPlayers, tier: 0});
    }
    for (let i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    botData.allCoinsOrder = allCoinsOrder;
    botData.allPicks = GetAllPicks({tavernsNum, playersNum: ctx.numPlayers});
    botData.maxIter = 1000;
    botData.deckLength = decks[0].length;
    return {
        debug,
        suitsNum,
        tierToEnd,
        campNum,
        tavernsNum,
        drawSize,
        expansions,
        decks,
        heroes,
        campDeck,
        camp,
        taverns,
        players,
        playersOrder,
        exchangeOrder,
        marketCoins,
        marketCoinsUnique,
        botData,
        averageCards,
    };
};
