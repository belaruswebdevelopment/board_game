import {BuildPlayer} from "./Player";
import {BuildCards, GetAverageSuitCard} from "./Card";
import {suitsConfigArray} from "./data/SuitData";
import {marketCoinsConfig} from "./data/CoinData";
import {BuildCoins} from "./Coin";
import {Permute, k_combinations, GetAllPicks} from "./BotConfig";
import {BuildPriorities} from "./Priority";
import {actionCardsConfigArray} from "./data/ActionCardData";
import {BuildHeroes} from "./Hero";

export const SetupGame = (ctx) => {
    const suitsNum = 5,
        tierToEnd = 2,
        campNum = 5,
        debug = false,
        drawProfit = null,
        expansions = {
            thingvellir: {
                active: true,
            },
        },
        decks = [],
        // todo add camp logic
        campDecks = [
            [{points: 0},{points: 1},{points: 2},{points: 3},{points: 4}],
            [{points: 0},{points: 1},{points: 2},{points: 3},{points: 4}]
        ],
        camp = [{points: 0}, {points: 1}, {points: 2}, {points: 3}, {points: 4}],
        distinctions = Array(suitsNum).fill(null)
    let winner = null;
    for (let i = 0; i < tierToEnd; i++) {
        decks[i] = BuildCards({suits: suitsConfigArray, actions: actionCardsConfigArray}, {players: ctx.numPlayers, tier: i});
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    const heroesConfigArray = ["base"];
    for (const expansion in expansions) {
        if (expansions[expansion].active) {
            heroesConfigArray.push(expansion);
        }
    }
    // todo add heroes logic!
    const heroes = BuildHeroes(heroesConfigArray);
    const taverns = [],
        tavernsNum = 3,
        currentTavern = null,
        drawSize = ctx.numPlayers === 2 ? 3 : ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = decks[0].splice(0, drawSize);
    }
    const players = [],
        playersOrder = [],
        exchangeOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = BuildPlayer(ctx.numPlayers, suitsNum, "Vasya" + i);
    }
    BuildPriorities(players);
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
    for (const suit in suitsConfigArray) {
        averageCards[suit] = GetAverageSuitCard(suitsConfigArray[suit], {players: ctx.numPlayers, tier: 0});
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
        winner,
        drawProfit,
        suitsNum,
        tierToEnd,
        campNum,
        tavernsNum,
        currentTavern,
        drawSize,
        expansions,
        decks,
        heroes,
        campDecks,
        camp,
        distinctions,
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
