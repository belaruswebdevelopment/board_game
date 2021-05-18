import {BuildPlayer} from "./Player";
import {BuildCards} from "./Card";
import {suitsConfigArray} from "./SuitData";
import {marketCoinsConfig} from "./CoinData";
import {BuildCoins} from "./Coin";
import {Permute, k_combinations} from "./BotConfig";




export const SetupGame = (ctx) => {
    const decks = [];
    const tierToEnd = 2;
    for (let i = 0; i < tierToEnd; i++) {
        decks[i] = BuildCards(suitsConfigArray, {players: ctx.numPlayers, tier: i});
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    const taverns = [];
    const tavernsNum = 3;
    const drawSize = ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = decks[0].splice(0, drawSize);
    }
    let players = [];
    const suitsNum = 5;
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = BuildPlayer(i);
    }
    const marketCoinsUnique = [];
    const marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false
    });
    const playersOrder = [];
    const exchangeOrder = [];

    const botData = {};
    let allCoinsOrder = [];
    let initHandCoinsId = Array(players[0].boardCoins.length).fill().map((item, index) => index);
    let initCoinsOrder = k_combinations(initHandCoinsId, tavernsNum);
    for (var i = 0; i < initCoinsOrder.length; i++) {
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
