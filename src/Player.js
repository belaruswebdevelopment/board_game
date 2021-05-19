import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./CoinData";
import {suitsConfigArray} from "./SuitData";

const CreatePlayer = ({
                          cards = [],
                          heroes = [],
                          handCoins = [],
                          boardCoins = [],
                          selectedCoin = undefined,
                          priority = 0,
                          isPriorityExchangeable = true
                      } = {}) => {
    return {
        cards,
        heroes,
        handCoins,
        boardCoins,
        selectedCoin,
        priority,
        isPriorityExchangeable,
    };
};

export const BuildPlayer = (id) => {
    return CreatePlayer({
        cards: Array(suitsConfigArray.length).fill(Array(0)),
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            {isInitial: true, isTriggerTrading: false}),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
        priority: id,
    });
};

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
};

export const AddCardToCards = (cards, card) => {
    cards[card.suit].push(card);
};
