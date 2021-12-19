import { BuildCoins } from "./Coin";
import { initialPlayerCoinsConfig } from "./data/CoinData";
import { CurrentScoring } from "./Score";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog, LogTypes } from "./Logging";
import { suitsConfig } from "./data/SuitData";
import { isCardNotAction } from "./Card";
import { isArtefactCard } from "./Camp";
/**
 * <h3>Создание приватных данных игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @returns Приватные данные игрока.
 */
var CreatePlayer = function (_a) {
    var _b = _a === void 0 ? {} : _a, handCoins = _b.handCoins, boardCoins = _b.boardCoins;
    return ({
        handCoins: handCoins,
        boardCoins: boardCoins,
    });
};
/**
 * <h3>Создание публичных данных игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт кэмпа.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стэк действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @param pickedCard Выбранная карта.
 * @returns Публичные данные игрока.
 */
var CreatePublicPlayer = function (_a) {
    var _b = _a === void 0 ? {} : _a, nickname = _b.nickname, cards = _b.cards, _c = _b.heroes, heroes = _c === void 0 ? [] : _c, _d = _b.campCards, campCards = _d === void 0 ? [] : _d, handCoins = _b.handCoins, boardCoins = _b.boardCoins, _e = _b.stack, stack = _e === void 0 ? [] : _e, priority = _b.priority, _f = _b.buffs, buffs = _f === void 0 ? {} : _f, selectedCoin = _b.selectedCoin, _g = _b.pickedCard, pickedCard = _g === void 0 ? null : _g;
    return ({
        nickname: nickname,
        cards: cards,
        campCards: campCards,
        heroes: heroes,
        handCoins: handCoins,
        boardCoins: boardCoins,
        stack: stack,
        priority: priority,
        buffs: buffs,
        selectedCoin: selectedCoin,
        pickedCard: pickedCard,
    });
};
/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @returns Приватные данные игрока.
 */
export var BuildPlayer = function () { return CreatePlayer({
    handCoins: BuildCoins(initialPlayerCoinsConfig, {
        isInitial: true,
        isTriggerTrading: false,
    }),
    boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
}); };
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
 * @param priority Кристалл.
 * @returns Публичные данные игрока.
 */
export var BuildPublicPlayer = function (playersNum, suitsNum, nickname, priority) { return CreatePublicPlayer({
    nickname: nickname,
    cards: Array(suitsNum).fill(Array(0)),
    handCoins: BuildCoins(initialPlayerCoinsConfig, { isInitial: true, isTriggerTrading: false }),
    boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
    priority: priority,
}); };
/**
 * <h3>Проверяет базовый порядок хода игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости выставления монет на игровое поле.</li>
 * <li>Происходит при необходимости выставления монет на игровое поле при наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export var CheckPlayersBasicOrder = function (G, ctx) {
    G.publicPlayersOrder = [];
    for (var i = 0; i < ctx.numPlayers; i++) {
        if (ctx.phase !== "placeCoinsUline") {
            if (G.publicPlayers[i].buffs.everyTurn !== "Uline") {
                G.publicPlayersOrder.push(i);
            }
        }
        else {
            if (G.publicPlayers[i].buffs.everyTurn === "Uline") {
                G.publicPlayersOrder.push(i);
            }
        }
    }
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
 * @returns Добавлена ли карта на планшет игрока.
 */
export var AddCardToPlayer = function (G, ctx, card) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = card;
    // TODO Not only deckcardtypes but ihero+icampcardtypes?? but they are created as ICard and added to players cards...
    if (isCardNotAction(card)) {
        var suitIndex = GetSuitIndexByName(card.suit);
        if (suitIndex !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[suitIndex].push(card);
            AddDataToLog(G, LogTypes.PUBLIC, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 '").concat(card.name, "' \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[card.suit].suitName, "."));
            return true;
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 ".concat(card.name, " \u0438\u0437-\u0437\u0430 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ").concat(card.suit, "."));
            // todo ERROR must not return false!
        }
    }
    AddDataToLog(G, LogTypes.PUBLIC, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 '").concat(card.name, "'."));
    return false;
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
 */
export var AddCampCardToPlayer = function (G, ctx, card) {
    if (!isArtefactCard(card) || (isArtefactCard(card) && card.suit === null)) {
        G.publicPlayers[Number(ctx.currentPlayer)].campCards.push(card);
        AddDataToLog(G, LogTypes.PUBLIC, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 \u043A\u044D\u043C\u043F\u0430 ").concat(card.name, "."));
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u0430 ".concat(card.name, " \u0432 \u043C\u0430\u0441\u0441\u0438\u0432 \u043A\u0430\u0440\u0442 \u043A\u044D\u043C\u043F\u0430 \u0438\u0433\u0440\u043E\u043A\u0430 \u0438\u0437-\u0437\u0430 \u0435\u0451 \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u0438 \u043A \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ").concat(card.suit, "."));
    }
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
 */
export var AddCampCardToPlayerCards = function (G, ctx, card) {
    if (card.suit !== null) {
        var suitId = GetSuitIndexByName(card.suit);
        if (suitId !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].push(card);
            AddDataToLog(G, LogTypes.PRIVATE, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0432\u044B\u0431\u0440\u0430\u043B \u043A\u0430\u0440\u0442\u0443 \u043A\u044D\u043C\u043F\u0430 '").concat(card.name, "' \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[card.suit].suitName, "."));
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 ".concat(card.name, " \u0438\u0437-\u0437\u0430 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ").concat(card.suit, "."));
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442 ".concat(card.name, " \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442 \u043A\u0430\u0440\u0442 \u0444\u0440\u0430\u043A\u0446\u0438\u0439 \u0438\u0433\u0440\u043E\u043A\u0430 \u0438\u0437-\u0437\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0438\u043D\u0430\u0434\u043B\u0435\u0436\u043D\u043E\u0441\u0442\u0438 \u0435\u0433\u043E \u043A \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0439 \u0444\u0440\u0430\u043A\u0446\u0438\u0438."));
    }
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
 */
export var AddHeroCardToPlayerHeroCards = function (G, ctx, hero) {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = hero;
    if (hero.active) {
        hero.active = false;
        G.publicPlayers[Number(ctx.currentPlayer)].heroes.push(hero);
        AddDataToLog(G, LogTypes.PUBLIC, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0432\u044B\u0431\u0440\u0430\u043B \u0433\u0435\u0440\u043E\u044F ").concat(hero.name, "."));
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0433\u0435\u0440\u043E\u044F ".concat(hero.name, " \u0438\u0437-\u0437\u0430 \u0442\u043E\u0433\u043E, \u0447\u0442\u043E \u043E\u043D \u0431\u044B\u043B \u0443\u0436\u0435 \u0432\u044B\u0431\u0440\u0430\u043D \u0434\u0440\u0443\u0433\u0438\u043C \u0438\u0433\u0440\u043E\u043A\u043E\u043C."));
    }
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
 */
export var AddHeroCardToPlayerCards = function (G, ctx, hero) {
    if (hero.suit !== null) {
        var suitId = GetSuitIndexByName(hero.suit);
        if (suitId !== -1) {
            G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].push(hero);
            AddDataToLog(G, LogTypes.PRIVATE, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \u0434\u043E\u0431\u0430\u0432\u0438\u043B \u0433\u0435\u0440\u043E\u044F ").concat(hero.name, " \u0432\u043E \u0444\u0440\u0430\u043A\u0446\u0438\u044E ").concat(suitsConfig[hero.suit].suitName, "."));
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0433\u0435\u0440\u043E\u044F ".concat(hero.name, " \u0438\u0437-\u0437\u0430 \u043D\u0435\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0439 \u0444\u0440\u0430\u043A\u0446\u0438\u0438 ").concat(hero.suit, "."));
        }
    }
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
 */
export var AddCardToCards = function (cards, card) {
    if (card.suit !== null) {
        var suitId = GetSuitIndexByName(card.suit);
        if (suitId !== -1) {
            cards[suitId].push(card);
        } /*else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось добавить героя ${card.name} из-за несуществующей фракции ${card.suit}.`);
        }*/
    }
    // todo Else it can be upgrade coin card here and it is not error, sure? Or add LogTypes.ERROR logging?
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
 * @param playerId Id игрока.
 * @returns
 */
export var IsTopPlayer = function (G, playerId) {
    return G.publicPlayers.every(function (player) {
        return CurrentScoring(player) <= CurrentScoring(G.publicPlayers[playerId]);
    });
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
 * @param currentPlayerId Id текущего игрока.
 * @returns
 */
/*export const GetTop1PlayerId = (G: MyGameState, currentPlayerId: number): number => {
    let top1PlayerId: number =
    G.publicPlayers.findIndex((player: IPublicPlayer, index: number): boolean => IsTopPlayer(G, index));
    if (G.publicPlayersOrder.indexOf(currentPlayerId) > G.publicPlayersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};*/
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param top1PlayerId Id текущего игрока.
 * @returns
 */
/*export const GetTop2PlayerId = (G: MyGameState, top1PlayerId: number): number => {
    const playersScore: number[] = G.publicPlayers.map((player: IPublicPlayer): number => CurrentScoring(player)),
        maxScore: number = Math.max(...playersScore);
    let top2PlayerId: number,
        temp: number;
    if (playersScore.filter((score: number): boolean => score === maxScore).length === 1) {
        temp = playersScore.sort((a: number, b: number): number => b - a)[1];
        top2PlayerId = G.publicPlayers.findIndex((player: IPublicPlayer): boolean => CurrentScoring(player) === temp);
    } else {
        top2PlayerId = G.publicPlayers.findIndex((player: IPublicPlayer, index: number): boolean =>
        index !== top1PlayerId && IsTopPlayer(G, index));
    }
    if (G.publicPlayersOrder.indexOf(top1PlayerId) > G.publicPlayersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};*/
