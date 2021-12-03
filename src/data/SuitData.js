"use strict";
exports.__esModule = true;
exports.suitsConfig = void 0;
var Coin_1 = require("../Coin");
var Card_1 = require("../Card");
var Priority_1 = require("../Priority");
var StackHelpers_1 = require("../helpers/StackHelpers");
var Logging_1 = require("../Logging");
var ScoreHelpers_1 = require("../helpers/ScoreHelpers");
/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @todo Add may be potential points for hunters and blacksmiths.
 * @type {{scoringRule: (function(*): number), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: blacksmithSuit.distinction.awarding, description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}})}} Кузнецы.
 */
var blacksmith = {
    suit: "blacksmith",
    suitName: "Кузнецы",
    suitColor: 'bg-purple-600',
    description: "Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).",
    ranksValues: function () { return ({
        2: {
            0: 8,
            1: 8
        },
        3: {
            0: 8,
            1: 8
        },
        4: {
            0: 8,
            1: 8
        },
        5: {
            0: 10,
            1: 10
        }
    }); },
    pointsValues: function () { return ({
        2: {
            0: 8,
            1: 8
        },
        3: {
            0: 8,
            1: 8
        },
        4: {
            0: 8,
            1: 8
        },
        5: {
            0: 10,
            1: 10
        }
    }); },
    scoringRule: function (cards) { return (0, ScoreHelpers_1.ArithmeticSum)(3, 1, cards.reduce(ScoreHelpers_1.TotalRank, 0)); },
    distinction: {
        description: "Получив знак отличия кузнецов, сразу же призовите Главного кузнеца с двумя шевронами в свою армию. "
            + "Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                player.cards[0].push((0, Card_1.CreateCard)({
                    suit: "blacksmith",
                    rank: 2,
                    points: 2
                }));
                delete G.distinctions[0];
                (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u043A\u0443\u0437\u043D\u0435\u0446\u043E\u0432 \n                \u043A\u0430\u0440\u0442\u0443 \u0413\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u043A\u0443\u0437\u043D\u0435\u0446\u0430."));
                ctx.events.endTurn();
            }
            return 0;
        }
    }
};
/**
 * <h3>Фракция охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*)), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: hunterSuit.distinction.awarding, description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}})}} Охотники.
 */
var hunter = {
    suit: "hunter",
    suitName: "Охотники",
    suitColor: "bg-green-600",
    description: "Их показатель храбрости равен квадрату числа карт охотников в армии игрока.",
    ranksValues: function () { return ({
        2: {
            0: 6,
            1: 6
        },
        3: {
            0: 6,
            1: 6
        },
        4: {
            0: 6,
            1: 6
        },
        5: {
            0: 8,
            1: 8
        }
    }); },
    pointsValues: function () { return ({
        2: {
            0: 6,
            1: 6
        },
        3: {
            0: 6,
            1: 6
        },
        4: {
            0: 6,
            1: 6
        },
        5: {
            0: 8,
            1: 8
        }
    }); },
    scoringRule: function (cards) { return Math.pow(cards.reduce(ScoreHelpers_1.TotalRank, 0), 2); },
    distinction: {
        description: "Получив знак отличия охотников, сразу же обменяйте свою монету с номиналом 0 на особую монету " +
            "с номиналом 3. Эта монета также позволяет обменивать монеты в кошеле и не может быть улучшена.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                var tradingCoinIndex = player.boardCoins.findIndex(function (coin) { return (coin && coin.value) === 0; });
                player.boardCoins[tradingCoinIndex] = (0, Coin_1.CreateCoin)({
                    value: 3,
                    isTriggerTrading: true
                });
                delete G.distinctions[1];
                (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043E\u0431\u043C\u0435\u043D\u044F\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432 \n                \u0441\u0432\u043E\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0441 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u043E\u043C 0 \u043D\u0430 \u043E\u0441\u043E\u0431\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0441 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u043E\u043C 3."));
                ctx.events.endTurn();
            }
            return 0;
        }
    }
};
/**
 * <h3>Фракция горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*)), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*=, *, *): (number|undefined))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}} Горняки.
 */
var miner = {
    suit: "miner",
    suitName: "Горняки",
    suitColor: "bg-yellow-600",
    description: "Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии " +
        "игрока.",
    ranksValues: function () { return ({
        2: {
            0: 6,
            1: 6
        },
        3: {
            0: 6,
            1: 6
        },
        4: {
            0: 6,
            1: 6
        },
        5: {
            0: 8,
            1: 8
        }
    }); },
    pointsValues: function () { return ({
        2: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2]
        },
        3: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2]
        },
        4: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2]
        },
        5: {
            0: [0, 0, 0, 1, 1, 1, 2, 2],
            1: [0, 0, 0, 1, 1, 1, 2, 2]
        }
    }); },
    scoringRule: function (cards) { return cards.reduce(ScoreHelpers_1.TotalRank, 0) * cards.reduce(ScoreHelpers_1.TotalPoints, 0); },
    distinction: {
        description: "Получив знак отличия горняков, сразу же положите особый кристалл 6 поверх вашего текущего " +
            "кристалла (тот остаётся скрытым до конца игры). В конце игры обладатель этого кристалла прибавит +3 очка "
            + "к итоговому показателю храбрости своей армии. Этот кристалл позволяет победить во всех спорах при равенстве "
            + "ставок и никогда не обменивается.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                player.priority = (0, Priority_1.CreatePriority)({
                    value: 6,
                    isExchangeable: false
                });
                delete G.distinctions[2];
                (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043E\u0431\u043C\u0435\u043D\u044F\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \n                \u0441\u0432\u043E\u0439 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u043D\u0430 \u043E\u0441\u043E\u0431\u044B\u0439 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B 6."));
                ctx.events.endTurn();
            }
            else {
                if (player.priority.value === 6) {
                    return 3;
                }
            }
            return 0;
        }
    }
};
/**
 * <h3>Фракция воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*): *), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*=, *=, *): (*))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}} Воины.
 */
var warrior = {
    suit: "warrior",
    suitName: "Воины",
    suitColor: "bg-red-600",
    description: "Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, " +
        "который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой " +
        "ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал " +
        "своей самой ценной монеты к показателю храбрости своих воинов.",
    ranksValues: function () { return ({
        2: {
            0: 8,
            1: 8
        },
        3: {
            0: 8,
            1: 8
        },
        4: {
            0: 8,
            1: 8
        },
        5: {
            0: 9,
            1: 9
        }
    }); },
    pointsValues: function () { return ({
        2: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9]
        },
        3: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9]
        },
        4: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9]
        },
        5: {
            0: [3, 4, 5, 6, 6, 7, 8, 9, 10],
            1: [3, 4, 5, 6, 6, 7, 8, 9, 10]
        }
    }); },
    scoringRule: function (cards) { return cards.reduce(ScoreHelpers_1.TotalPoints, 0); },
    distinction: {
        description: "Получив знак отличия воинов, сразу же улучшите одну из своих монет, добавив к её номиналу +5.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                var stack = [
                    {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "upgradeCoin",
                            stageName: "upgradeCoin",
                            value: 5,
                            drawName: "Upgrade coin Warrior distinction"
                        }
                    },
                    {
                        actionName: "UpgradeCoinAction",
                        config: {
                            value: 5
                        }
                    },
                ];
                (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0432\u043E\u0438\u043D\u043E\u0432 \n                \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u043E\u0434\u043D\u0443 \u0438\u0437 \u0441\u0432\u043E\u0438\u0445 \u043C\u043E\u043D\u0435\u0442 \u043D\u0430 +5:"));
                (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
                (0, StackHelpers_1.StartActionFromStackOrEndActions)(G, ctx, false);
            }
            else {
                return Math.max.apply(Math, player.boardCoins.filter(function (coin) { return coin === null || coin === void 0 ? void 0 : coin.value; }).map(function (coin) {
                    return coin.value;
                }));
            }
            return 0;
        }
    }
};
/**
 * <h3>Фракция разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*): *), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*=, *=, *): (*|undefined))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}} Разведчики.
 */
var explorer = {
    suit: "explorer",
    suitName: "Разведчики",
    suitColor: "bg-blue-500",
    description: "Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.",
    ranksValues: function () { return ({
        2: {
            0: 7,
            1: 7
        },
        3: {
            0: 7,
            1: 7
        },
        4: {
            0: 7,
            1: 7
        },
        5: {
            0: 8,
            1: 8
        }
    }); },
    pointsValues: function () { return ({
        2: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11]
        },
        3: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11]
        },
        4: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11]
        },
        5: {
            0: [5, 6, 7, 8, 9, 10, 11, 12],
            1: [5, 6, 7, 8, 9, 10, 11, 12]
        }
    }); },
    scoringRule: function (cards) { return cards.reduce(ScoreHelpers_1.TotalPoints, 0); },
    distinction: {
        description: "Получив знак отличия разведчиков, сразу же возьмите 3 карты из колоды эпохи 2 и сохраните у себя " +
            "одну из этих карт. Если это карта дворфа, сразу же поместите его в свою армию. Игрок получает право призвать "
            + "нового героя, если в этот момент завершил линию 5 шевронов. Если это карта королевская награда, то улучшите "
            + "одну из своих монет. Две оставшиеся карты возвращаются в колоду эпохи 2. Положите карту знак отличия " +
            "разведчиков в командную зону рядом с вашим планшетом.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                var stack = [
                    {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "explorerDistinction",
                            stageName: "pickDistinctionCard",
                            drawName: "Pick card by Explorer distinction"
                        }
                    },
                ];
                (0, Logging_1.AddDataToLog)(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \n                \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0438\u0437 \u043A\u043E\u043B\u043E\u0434\u044B \u0432\u0442\u043E\u0440\u043E\u0439 \u044D\u043F\u043E\u0445\u0438:"));
                (0, StackHelpers_1.AddActionsToStack)(G, ctx, stack);
                (0, StackHelpers_1.StartActionFromStackOrEndActions)(G, ctx, false);
            }
            return 0;
        }
    }
};
/**
 * <h3>Конфиг фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @type {{blacksmith: {scoringRule: (function(*): number), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: blacksmithSuit.distinction.awarding, description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}})}, warrior: {scoringRule: (function(*): *), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*, *, *): (number|undefined))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}, explorer: {scoringRule: (function(*): *), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: explorerSuit.distinction.awarding, description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}, hunter: {scoringRule: (function(*)), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: hunterSuit.distinction.awarding, description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}})}, miner: {scoringRule: (function(*)), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*, *, *): (number|undefined))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}}} Все фракции.
 */
exports.suitsConfig = {
    blacksmith: blacksmith,
    hunter: hunter,
    miner: miner,
    warrior: warrior,
    explorer: explorer
};
