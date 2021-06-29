import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./data/CoinData";
import {CurrentScoring} from "./Score";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog} from "./Logging";
import {suitsConfig} from "./data/SuitData";

/**
 * Создание игрока.
 * Применения:
 * 1) Происходит при создании всех игроков при инициализации игры.
 *
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт кэмпа.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @param pickedCard Выбранная карта.
 * @returns {{cards: *[], heroes: *[], handCoins: *[], boardCoins: *[], nickname, selectedCoin, buffs: {}, priority, pickedCard, campCards: *[]}} Игрок.
 * @constructor
 */
const CreatePlayer = ({
                          nickname,
                          cards = [],
                          heroes = [],
                          campCards = [],
                          handCoins = [],
                          boardCoins = [],
                          priority,
                          buffs = {},
                          selectedCoin,
                          pickedCard = {},
                      } = {}) => {
    return {
        nickname,
        cards,
        campCards,
        heroes,
        handCoins,
        boardCoins,
        priority,
        buffs,
        selectedCoin,
        pickedCard,
    };
};

/**
 * Создаёт всех игроков.
 * Применения:
 * 1) Происходит при инициализации игры.
 *
 * @param playersNum Количество игроков.
 * @param suitsNum Количество фракций.
 * @param nickname Никнейм.
 * @returns {{cards: *[], heroes: *[], handCoins: *[], boardCoins: *[], nickname, selectedCoin, buffs: {}, priority, pickedCard, campCards: *[]}} Игрок.
 * @constructor
 */
export const BuildPlayer = (playersNum, suitsNum, nickname) => {
    return CreatePlayer({
        nickname,
        cards: Array(suitsNum).fill(Array(0)),
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            {isInitial: true, isTriggerTrading: false}),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
    });
};

/**
 * Добавляет взятую карту в массив карт игрока.
 * Применения:
 * 1) Происходит при взятии карты из текущей таверны.
 * 2) Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.
 * 3) Происходит при взятии карты из сброса при активации героя.
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns {boolean} Добавлена ли карта в массив карт иначе она является картой улучшения монеты.
 * @constructor
 */
export const AddCardToPlayer = (G, ctx, card) => {
    G.players[ctx.currentPlayer].pickedCard = card;
    if (card.type === "улучшение монеты") {
        AddDataToLog(G, "public", `Игрок ${G.players[ctx.currentPlayer].nickname} выбрал карту '${card.name}'.`);
        return false;
    }
    const suitIndex = GetSuitIndexByName(card.suit);
    G.players[ctx.currentPlayer].cards[suitIndex].push(card);
    AddDataToLog(G, "public", `Игрок ${G.players[ctx.currentPlayer].nickname} выбрал карту '${card.name}'.`);
    return true;
};

/**
 * Добавляет взятую из кэмпа карту в массив карт кэмпа игрока.
 * Применения:
 * 1) Происходит при взятии карты кэмпа игроком.
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
export const AddCampCardToPlayer = (G, ctx, card) => {
    G.players[ctx.currentPlayer].campCards.push(card);
    AddDataToLog(G, "public", `Игрок ${G.players[ctx.currentPlayer].nickname} выбрал карту кэмпа ${card.name}.`);
};

/**
 * Добавляет карту кэмпа в конкретную фракцию игрока.
 * Применения:
 * 1) Происходит когда добавляется карта кэмпа в конкретную фракцию игрока.
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
export const AddCampCardToPlayerCards = (G, ctx, card) => {
    const suitId = GetSuitIndexByName(card.suit);
    G.players[ctx.currentPlayer].cards[suitId].push(card);
    AddDataToLog(G, "private", `Игрок ${G.players[ctx.currentPlayer].nickname} выбрал карту кэмпа '${card.name}' во фракцию 
        ${suitsConfig[card.suit].suitName}.`);
};

/**
 * Добавляет героя в массив героев игрока.
 * Применения:
 * 1) Происходит когда добавляется герой на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerHeroCards = (G, ctx, hero) => {
    G.players[ctx.currentPlayer].pickedCard = hero;
    hero.active = false;
    G.players[ctx.currentPlayer].heroes.push(hero);
    AddDataToLog(G, "public", `Игрок ${G.players[ctx.currentPlayer].nickname} выбрал героя ${hero.name}.`);
};

/**
 * Добавляет героя в массив карт игрока.
 * Применения:
 * 1) Происходит когда добавляется герой на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerCards = (G, ctx, hero) => {
    const suitId = GetSuitIndexByName(hero.suit);
    G.players[ctx.currentPlayer].cards[suitId].push(hero);
    AddDataToLog(G, "private", `Игрок ${G.players[ctx.currentPlayer].nickname} добавил героя ${hero.name} во фракцию 
    ${suitsConfig[hero.suit].suitName}.`);
};

/**
 * Добавляет карту в массив потенциальных карт для ботов.
 * Применения:
 * 1) Происходит при подсчёте потенциального скоринга для ботов.
 *
 * @param cards Массив потенциальных карт для ботов.
 * @param card Карта.
 * @constructor
 */
export const AddCardToCards = (cards, card) => {
    const suitIndex = GetSuitIndexByName(card.suit);
    cards[suitIndex].push(card);
};

/**
 * ОПИСАНИЕ.
 * Применения:
 * 1)
 * 2)
 * 3)
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param playerId
 * @returns {*}
 * @constructor
 */
export const IsTopPlayer = (G, playerId) => {
    const score = CurrentScoring(G.players[playerId]);
    return G.players.every(player => CurrentScoring(player) <= score);
};

/**
 * ОПИСАНИЕ.
 * Применения:
 * 1)
 *
 * @todo Саше: Добавить описание для функции и параметров
 * @param G
 * @param currentPlayerId
 * @returns {*}
 * @constructor
 */
export const GetTop1PlayerId = (G, currentPlayerId) => {
    let top1PlayerId = G.players.findIndex((player, index) => IsTopPlayer(G, index));
    if (G.playersOrder.indexOf(currentPlayerId) > G.playersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};

/**
 * ОПИСАНИЕ.
 * Применения:
 * 1)
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param top1PlayerId
 * @returns {number}
 * @constructor
 */
export const GetTop2PlayerId = (G, top1PlayerId) => {
    const playersScore = G.players.map(player => CurrentScoring(player)),
        maxScore = Math.max(...playersScore);
    let top2PlayerId, temp;
    if (playersScore.filter(score => score === maxScore).length === 1) {
        temp = playersScore.sort((a, b) => b - a)[1];
        top2PlayerId = G.players.findIndex(player => CurrentScoring(player) === temp);
    } else {
        top2PlayerId = G.players.findIndex((player, index) => index !== top1PlayerId && IsTopPlayer(G, index));
    }
    if (G.playersOrder.indexOf(top1PlayerId) > G.playersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};
