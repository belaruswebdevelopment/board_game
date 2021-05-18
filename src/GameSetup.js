import {BuildPlayer} from "./Player";
import {BuildCards} from "./Card";
import {suitsConfigArray} from "./SuitData";
import {marketCoinsConfig} from "./CoinData";
import {BuildCoins} from "./Coin";
import {Permute, k_combinations} from "./BotConfig";

export const SetupGame = (ctx) => {
    const suitsNum = 5,
        tierToEnd = 2,
        exchangeOrder = [],
        playersOrder = [],
        decks = [];
    for (let i = 0; i < tierToEnd; i++) {
        decks[i] = BuildCards(suitsConfigArray, {players: ctx.numPlayers, tier: i});
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    const taverns = [],
        tavernsNum = 3,
        drawSize = ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = decks[0].splice(0, drawSize);
    }
    let players = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = BuildPlayer(i);
    }
    const marketCoinsUnique = [];
    const marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false,
    });
    const botData = {},
        initHandCoinsId = Array(players[0].boardCoins.length).fill().map((item, index) => index),
        initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    let allCoinsOrder = [];
    for (let i = 0; i < initCoinsOrder.length; i++) {
        allCoinsOrder = allCoinsOrder.concat(Permute(initCoinsOrder[i]));
    }
    botData.allCoinsOrder = allCoinsOrder;
    return {
        botData,
        playersOrder,
        exchangeOrder,
        tierToEnd,
        tavernsNum,
        suitsNum,
        drawSize,
        decks,
        marketCoins,
        marketCoinsUnique,
        taverns,
        players,
    };
}
