import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./data/CoinData";
import {suitsConfig} from "./data/SuitData";
import {CurrentScoring} from "./Score";
import {CheckAndMoveThrud, StartThrudMoving} from "./Moves";
import {CheckEndHeroActions} from "./Actions";

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
                          pickedCard,
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
        return false;
    }
    const suitIndex = Object.keys(suitsConfig).findIndex(suit => suit === card.suit);
    G.players[ctx.currentPlayer].cards[suitIndex].push(card);
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
};

/**
 * Добавляет героя в массив карт игрока.
 * Применения:
 * 1) Происходит когда добавляется герой на планшет игрока.
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerCards = (G, ctx, config, hero) => {
    if (hero.suit) {
        hero.active = false;
        const suitId = Object.keys(suitsConfig).findIndex(suit => suit === hero.suit);
        const isMoveThrud = CheckAndMoveThrud(G, ctx, hero);
        G.players[ctx.currentPlayer].cards[suitId].push(hero);
        if (isMoveThrud) {
            StartThrudMoving(G, ctx, hero);
        } else {
            CheckEndHeroActions(G, ctx, config);
        }
    }
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
    const suitIndex = Object.keys(suitsConfig).findIndex(suit => suit === card.suit);
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
 * @todo Саше: Добавить описание для функции и параметров. && replace currentPlayerId - ctx.currentPlayer?
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
        top2PlayerId = G.players.findIndex((player, index) => CurrentScoring(player) === temp);
    } else {
        top2PlayerId = G.players.findIndex((player, index) => index !== top1PlayerId && IsTopPlayer(G, index));
    }
    if (G.playersOrder.indexOf(top1PlayerId) > G.playersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};
