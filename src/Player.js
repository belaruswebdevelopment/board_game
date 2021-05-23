import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./data/CoinData";
import {suitsConfigArray} from "./data/SuitData";
import {AddPriorityToPlayer} from "./Priority";

const CreatePlayer = ({
                          nickname = undefined,
                          cards = [],
                          heroes = [],
                          campCards = [],
                          handCoins = [],
                          boardCoins = [],
                          selectedCoin = undefined,
                          priority = undefined,
                      } = {}) => {
    return {
        nickname,
        cards,
        campCards,
        heroes,
        handCoins,
        boardCoins,
        selectedCoin,
        priority,
    };
};

export const BuildPlayer = (numPlayers, nickname) => {
    return CreatePlayer({
        nickname,
        cards: Array(suitsConfigArray.length).fill(Array(0)),
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            {isInitial: true, isTriggerTrading: false}),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
        priority: AddPriorityToPlayer(numPlayers),
    });
};

export const AddCardToPlayer = (player, card) => {
    player.cards[card.suit].push(card);
};

export const AddCampCardToPlayer = (player, card) => {
    player.campCards.push(card);
};

export const AddCardToCards = (cards, card) => {
    cards[card.suit].push(card);
};
