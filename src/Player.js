import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./CoinData";

const CreatePlayer = () => ({cards: [], heroes: [], handCoins: [], boardCoins: [], selectedCoin: undefined,  priority: null, isPriorityExchangeable: true});

export const BuildPlayer = (suitsNum, player, id) => {
    player[id] = CreatePlayer();
    player[id].priority = id + 1;
    player[id].handCoins = BuildCoins(initialPlayerCoinsConfig, {isInitial: true, isTriggerTrading: false});
    player[id].boardCoins = Array(initialPlayerCoinsConfig.length).fill(null);
    for (let j = 0; j < suitsNum; j++) {
        player[id].cards[j] = [];
    }
};

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
};