import {BuildPlayer} from "./Player";
import {BuildCards} from "./Card";
import {suitsConfigArray} from "./SuitData";
import {marketCoinsConfig} from "./CoinData";
import {BuildCoins} from "./Coin";

function Permute(permutation) {
    let length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
    } else {
            c[i] = 0;
            ++i;
    }
    }
    return result;
}

function k_combinations(set, k) {
	let i, j, combs, head, tailcombs;
	if (k > set.length || k <= 0) {
		return [];
	}
	if (k === set.length) {
		return [set];
	}
	if (k === 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		// head is a list that includes only our current element.
		head = set.slice(i, i + 1);
		// We take smaller combinations from the subsequent elements
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		// For each (k-1)-combination we join it with the current
		// and store it to the set of k-combinations.
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}


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
