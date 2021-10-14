import {BuildCoins} from "./Coin";
import {initialPlayerCoinsConfig} from "./data/CoinData";
import {CurrentScoring} from "./Score";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog} from "./Logging";
import {suitsConfig} from "./data/SuitData";

/**
 * <h3>Создание игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @returns {{handCoins: *[], boardCoins: *[]}} Игрок.
 * @constructor
 */
const CreatePlayer = ({
                          handCoins = [],
                          boardCoins = [],
                      } = {}) => {
    return {
        handCoins,
        boardCoins,
    };
};

/**
 * <h3>Создание игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт кэмпа.
 * @param nickname Никнейм.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стэк действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @param pickedCard Выбранная карта.
 * @returns {{nickname: *, handCoins: *[], boardCoins: *[], stack: *[], nickname: *, selectedCoin: *, buffs: {}, priority: *, pickedCard: {}}} Игрок.
 * @constructor
 */
const CreatePublicPlayer = ({
                                nickname,
                                cards = [],
                                heroes = [],
                                campCards = [],
                                handCoins = [],
                                boardCoins = [],
                                stack = [],
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
        stack,
        priority,
        buffs,
        selectedCoin,
        pickedCard,
    };
};

/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @returns {{handCoins: *[], boardCoins: *[], nickname: *}} Игрок.
 * @constructor
 */
export const BuildPlayer = () => {
    return CreatePlayer({
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            {isInitial: true, isTriggerTrading: false}),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
    });
};

/**
 * <h3>Создаёт всех игроков (публичные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param playersNum Количество игроков.
 * @param suitsNum Количество фракций.
 * @param nickname Никнейм.
 * @returns {{handCoins: *[], boardCoins: *[], nickname: *}} Игрок.
 * @constructor
 */
export const BuildPublicPlayer = (playersNum, suitsNum, nickname) => {
    return CreatePublicPlayer({
        nickname,
        cards: Array(suitsNum).fill(Array(0)),
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            {isInitial: true, isTriggerTrading: false}),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
    });
};

/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @returns {boolean} Добавлена ли карта в массив карт иначе она является картой улучшения монеты.
 * @constructor
 */
export const AddCardToPlayer = (G, ctx, card) => {
    G.publicPlayers[ctx.currentPlayer].pickedCard = card;
    if (card.type === "улучшение монеты") {
        AddDataToLog(G, "public", `Игрок ${G.publicPlayers[ctx.currentPlayer].nickname} выбрал карту '${card.name}'.`);
        return false;
    }
    const suitIndex = GetSuitIndexByName(card.suit);
    G.publicPlayers[ctx.currentPlayer].cards[suitIndex].push(card);
    AddDataToLog(G, "public", `Игрок ${G.publicPlayers[ctx.currentPlayer].nickname} выбрал карту '${card.name}'.`);
    return true;
};

/**
 * <h3>Добавляет взятую из кэмпа карту в массив карт кэмпа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты кэмпа игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
export const AddCampCardToPlayer = (G, ctx, card) => {
    G.publicPlayers[ctx.currentPlayer].campCards.push(card);
    AddDataToLog(G, "public", `Игрок ${G.publicPlayers[ctx.currentPlayer].nickname} выбрал карту кэмпа ${card.name}.`);
};

/**
 * <h3>Добавляет карту кэмпа в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты кэмпа в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
export const AddCampCardToPlayerCards = (G, ctx, card) => {
    const suitId = GetSuitIndexByName(card.suit);
    G.publicPlayers[ctx.currentPlayer].cards[suitId].push(card);
    AddDataToLog(G, "private", `Игрок ${G.publicPlayers[ctx.currentPlayer].nickname} выбрал карту кэмпа '${card.name}' 
    во фракцию ${suitsConfig[card.suit].suitName}.`);
};

/**
 * <h3>Добавляет героя в массив героев игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerHeroCards = (G, ctx, hero) => {
    G.publicPlayers[ctx.currentPlayer].pickedCard = hero;
    hero.active = false;
    G.publicPlayers[ctx.currentPlayer].heroes.push(hero);
    AddDataToLog(G, "public", `Игрок ${G.publicPlayers[ctx.currentPlayer].nickname} выбрал героя ${hero.name}.`);
};

/**
 * <h3>Добавляет героя в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerCards = (G, ctx, hero) => {
    const suitId = GetSuitIndexByName(hero.suit);
    G.publicPlayers[ctx.currentPlayer].cards[suitId].push(hero);
    AddDataToLog(G, "private", `Игрок ${G.publicPlayers[ctx.currentPlayer].nickname} добавил героя ${hero.name} во 
    фракцию ${suitsConfig[hero.suit].suitName}.`);
};

/**
 * <h3>Добавляет карту в массив потенциальных карт для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подсчёте потенциального скоринга для ботов.</li>
 * </ol>
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
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param playerId
 * @returns {*}
 * @constructor
 */
export const IsTopPlayer = (G, playerId) => {
    const score = CurrentScoring(G.publicPlayers[playerId]);
    return G.publicPlayers.every(player => CurrentScoring(player) <= score);
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров
 * @param G
 * @param currentPlayerId
 * @returns {*}
 * @constructor
 */
export const GetTop1PlayerId = (G, currentPlayerId) => {
    let top1PlayerId = G.publicPlayers.findIndex((player, index) => IsTopPlayer(G, index));
    if (G.publicPlayersOrder.indexOf(currentPlayerId) > G.publicPlayersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param top1PlayerId
 * @returns {number}
 * @constructor
 */
export const GetTop2PlayerId = (G, top1PlayerId) => {
    const playersScore = G.publicPlayers.map(player => CurrentScoring(player)),
        maxScore = Math.max(...playersScore);
    let top2PlayerId, temp;
    if (playersScore.filter(score => score === maxScore).length === 1) {
        temp = playersScore.sort((a, b) => b - a)[1];
        top2PlayerId = G.publicPlayers.findIndex(player => CurrentScoring(player) === temp);
    } else {
        top2PlayerId = G.publicPlayers.findIndex((player, index) => index !== top1PlayerId && IsTopPlayer(G, index));
    }
    if (G.publicPlayersOrder.indexOf(top1PlayerId) > G.publicPlayersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};
