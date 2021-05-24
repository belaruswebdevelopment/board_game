import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./data/CoinData";
import {suitsConfigArray} from "./data/SuitData";
import {AddPriorityToPlayer} from "./Priority";
import {Scoring} from "./Game";

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

export const IsTopPlayer = (G, playerId) => {
    const score = Scoring(G.players[playerId]);
    return G.players.every(player => Scoring(player) <= score);
};

export const GetTop1PlayerId = (G, currentPlayerId) => {
    let top1PlayerId = G.players.findIndex((player, index) => IsTopPlayer(G, index));
    if (G.playersOrder.indexOf(currentPlayerId) > G.playersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};

export const GetTop2PlayerId = (G, top1PlayerId) => {
    const playersScore = G.players.map(player => Scoring(player)),
        maxScore = Math.max(...playersScore);
    let top2PlayerId, temp;
    if (playersScore.filter(score => score === maxScore).length === 1) {
        temp = playersScore.sort((a, b) => b - a)[1];
        top2PlayerId = G.players.findIndex((player, index) => Scoring(player) === temp);
    } else {
        top2PlayerId = G.players.findIndex((player, index) => index !== top1PlayerId && IsTopPlayer(G, index));
    }
    if (G.playersOrder.indexOf(top1PlayerId) > G.playersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};
