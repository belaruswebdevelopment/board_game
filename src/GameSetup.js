import {CreatePlayer} from "./Player";
import {BuildCards} from "./Card";
import {suitsConfigArray} from "./SuitData";
import {initialPlayerCoinsConfig, marketCoinsConfig} from "./CoinData";
import {BuildCoins} from "./Coin";

export const SetupGame = (ctx) => {
    const colors = [
        {background: "Violet"},
        {background: "MediumSeaGreen"},
        {background: "Khaki"},
        {background: "Tomato"},
        {background: "DodgerBlue"},
    ];
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
        players[i] = CreatePlayer();
        for (let j = 0; j < suitsNum; j++) {
            players[i].cards[j] = [];
        }
    }
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i].handCoins = BuildCoins(initialPlayerCoinsConfig, {isInitial: true, isTriggerTrading: false});
    }
    const marketCoinsUnique = [];
    const marketCoins = BuildCoins(marketCoinsConfig, {
        count: marketCoinsUnique,
        players: ctx.numPlayers,
        isInitial: false,
        isTriggerTrading: false
    });
    return {
        tierToEnd,
        tavernsNum,
        suitsNum,
        drawSize,
        colors,
        decks,
        marketCoins,
        marketCoinsUnique,
        taverns,
        players,
    };
}