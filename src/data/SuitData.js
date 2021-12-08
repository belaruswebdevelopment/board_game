import { CreateCoin } from "../Coin";
import { CreateCard } from "../Card";
import { CreatePriority } from "../Priority";
import { AddActionsToStack, StartActionFromStackOrEndActions } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { ArithmeticSum, TotalPoints, TotalRank } from "../helpers/ScoreHelpers";
/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @todo Add may be potential points for hunters and blacksmiths.
 * @type {{scoringRule: (cards: PlayerCardsType[]) => number, ranksValues: () => IRankValues, distinction: {awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number, description: string}, description: string, suitColor: string, suit: SuitNames.BLACKSMITH, suitName: string, pointsValues: () => IPointsValues}}
 */
var blacksmith = {
    suit: "blacksmith" /* BLACKSMITH */,
    suitName: "Кузнецы",
    suitColor: 'bg-purple-600',
    description: "Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).",
    ranksValues: function () { return ({
        2: {
            0: 8,
            1: 8,
        },
        3: {
            0: 8,
            1: 8,
        },
        4: {
            0: 8,
            1: 8,
        },
        5: {
            0: 10,
            1: 10,
        },
    }); },
    pointsValues: function () { return ({
        2: {
            0: 8,
            1: 8,
        },
        3: {
            0: 8,
            1: 8,
        },
        4: {
            0: 8,
            1: 8,
        },
        5: {
            0: 10,
            1: 10,
        },
    }); },
    scoringRule: function (cards) {
        return ArithmeticSum(3, 1, cards.reduce(TotalRank, 0));
    },
    distinction: {
        description: "\u041F\u043E\u043B\u0443\u0447\u0438\u0432 \u0437\u043D\u0430\u043A \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u043A\u0443\u0437\u043D\u0435\u0446\u043E\u0432, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u0440\u0438\u0437\u043E\u0432\u0438\u0442\u0435 \u0413\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u043A\u0443\u0437\u043D\u0435\u0446\u0430 \u0441 \u0434\u0432\u0443\u043C\u044F \u0448\u0435\u0432\u0440\u043E\u043D\u0430\u043C\u0438 \u0432 \u0441\u0432\u043E\u044E \u0430\u0440\u043C\u0438\u044E. \n        \u0418\u0433\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438 \u0432 \u044D\u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                player.cards[0].push(CreateCard({
                    suit: "blacksmith" /* BLACKSMITH */,
                    rank: 2,
                    points: 2,
                }));
                delete G.distinctions[0];
                AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u043A\u0443\u0437\u043D\u0435\u0446\u043E\u0432 \n                \u043A\u0430\u0440\u0442\u0443 \u0413\u043B\u0430\u0432\u043D\u043E\u0433\u043E \u043A\u0443\u0437\u043D\u0435\u0446\u0430."));
                ctx.events.endTurn();
            }
            return 0;
        },
    },
};
/**
 * <h3>Фракция охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (cards: PlayerCardsType[]) => number, ranksValues: () => IRankValues, distinction: {awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number, description: string}, description: string, suitColor: string, suit: SuitNames.HUNTER, suitName: string, pointsValues: () => IPointsValues}}
 */
var hunter = {
    suit: "hunter" /* HUNTER */,
    suitName: "Охотники",
    suitColor: "bg-green-600",
    description: "Их показатель храбрости равен квадрату числа карт охотников в армии игрока.",
    ranksValues: function () { return ({
        2: {
            0: 6,
            1: 6,
        },
        3: {
            0: 6,
            1: 6,
        },
        4: {
            0: 6,
            1: 6,
        },
        5: {
            0: 8,
            1: 8,
        },
    }); },
    pointsValues: function () { return ({
        2: {
            0: 6,
            1: 6,
        },
        3: {
            0: 6,
            1: 6,
        },
        4: {
            0: 6,
            1: 6,
        },
        5: {
            0: 8,
            1: 8,
        },
    }); },
    scoringRule: function (cards) { return Math.pow(cards.reduce(TotalRank, 0), 2); },
    distinction: {
        description: "\u041F\u043E\u043B\u0443\u0447\u0438\u0432 \u0437\u043D\u0430\u043A \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043E\u0431\u043C\u0435\u043D\u044F\u0439\u0442\u0435 \u0441\u0432\u043E\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0441 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u043E\u043C 0 \u043D\u0430 \u043E\u0441\u043E\u0431\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0441 \n        \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u043E\u043C 3. \u042D\u0442\u0430 \u043C\u043E\u043D\u0435\u0442\u0430 \u0442\u0430\u043A\u0436\u0435 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043E\u0431\u043C\u0435\u043D\u0438\u0432\u0430\u0442\u044C \u043C\u043E\u043D\u0435\u0442\u044B \u0432 \u043A\u043E\u0448\u0435\u043B\u0435 \u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0430.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                var tradingCoinIndex = player.boardCoins.findIndex(function (coin) { return (coin && coin.value) === 0; });
                player.boardCoins[tradingCoinIndex] = CreateCoin({
                    value: 3,
                    isTriggerTrading: true,
                });
                delete G.distinctions[1];
                AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043E\u0431\u043C\u0435\u043D\u044F\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u043E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432 \n                \u0441\u0432\u043E\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0441 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u043E\u043C 0 \u043D\u0430 \u043E\u0441\u043E\u0431\u0443\u044E \u043C\u043E\u043D\u0435\u0442\u0443 \u0441 \u043D\u043E\u043C\u0438\u043D\u0430\u043B\u043E\u043C 3."));
                ctx.events.endTurn();
            }
            return 0;
        },
    },
};
/**
 * <h3>Фракция горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (cards: PlayerCardsType[]) => number, ranksValues: () => IRankValues, distinction: {awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number, description: string}, description: string, suitColor: string, suit: SuitNames.MINER, suitName: string, pointsValues: () => IPointsValues}}
 */
var miner = {
    suit: "miner" /* MINER */,
    suitName: "Горняки",
    suitColor: "bg-yellow-600",
    description: "\u0418\u0445 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0440\u0430\u0432\u0435\u043D \u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044E \u0441\u0443\u043C\u043C\u044B \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u043D\u0430 \u0441\u0443\u043C\u043C\u0443 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \u0432 \u0430\u0440\u043C\u0438\u0438 \n    \u0438\u0433\u0440\u043E\u043A\u0430.",
    ranksValues: function () { return ({
        2: {
            0: 6,
            1: 6,
        },
        3: {
            0: 6,
            1: 6,
        },
        4: {
            0: 6,
            1: 6,
        },
        5: {
            0: 8,
            1: 8,
        },
    }); },
    pointsValues: function () { return ({
        2: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2],
        },
        3: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2],
        },
        4: {
            0: [0, 0, 1, 1, 2, 2],
            1: [0, 0, 1, 1, 2, 2],
        },
        5: {
            0: [0, 0, 0, 1, 1, 1, 2, 2],
            1: [0, 0, 0, 1, 1, 1, 2, 2],
        },
    }); },
    scoringRule: function (cards) { return cards.reduce(TotalRank, 0) * cards.reduce(TotalPoints, 0); },
    distinction: {
        description: "\u041F\u043E\u043B\u0443\u0447\u0438\u0432 \u0437\u043D\u0430\u043A \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u0435 \u043E\u0441\u043E\u0431\u044B\u0439 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B 6 \u043F\u043E\u0432\u0435\u0440\u0445 \u0432\u0430\u0448\u0435\u0433\u043E \u0442\u0435\u043A\u0443\u0449\u0435\u0433\u043E \n        \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B\u0430 (\u0442\u043E\u0442 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0441\u043A\u0440\u044B\u0442\u044B\u043C \u0434\u043E \u043A\u043E\u043D\u0446\u0430 \u0438\u0433\u0440\u044B). \u0412 \u043A\u043E\u043D\u0446\u0435 \u0438\u0433\u0440\u044B \u043E\u0431\u043B\u0430\u0434\u0430\u0442\u0435\u043B\u044C \u044D\u0442\u043E\u0433\u043E \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B\u0430 \u043F\u0440\u0438\u0431\u0430\u0432\u0438\u0442 +3 \u043E\u0447\u043A\u0430 \u043A \n        \u0438\u0442\u043E\u0433\u043E\u0432\u043E\u043C\u0443 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0441\u0432\u043E\u0435\u0439 \u0430\u0440\u043C\u0438\u0438. \u042D\u0442\u043E\u0442 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u044C \u0432\u043E \u0432\u0441\u0435\u0445 \u0441\u043F\u043E\u0440\u0430\u0445 \u043F\u0440\u0438 \u0440\u0430\u0432\u0435\u043D\u0441\u0442\u0432\u0435 \u0441\u0442\u0430\u0432\u043E\u043A \n        \u0438 \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u043E\u0431\u043C\u0435\u043D\u0438\u0432\u0430\u0435\u0442\u0441\u044F.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                player.priority = CreatePriority({
                    value: 6,
                    isExchangeable: false,
                });
                delete G.distinctions[2];
                AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043E\u0431\u043C\u0435\u043D\u044F\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0433\u043E\u0440\u043D\u044F\u043A\u043E\u0432 \n                \u0441\u0432\u043E\u0439 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u043D\u0430 \u043E\u0441\u043E\u0431\u044B\u0439 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B 6."));
                ctx.events.endTurn();
            }
            else {
                if (player.priority.value === 6) {
                    return 3;
                }
            }
            return 0;
        },
    },
};
/**
 * <h3>Фракция воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (cards: PlayerCardsType[]) => number, ranksValues: () => IRankValues, distinction: {awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number, description: string}, description: string, suitColor: string, suit: SuitNames.WARRIOR, suitName: string, pointsValues: () => IPointsValues}}
 */
var warrior = {
    suit: "warrior" /* WARRIOR */,
    suitName: "Воины",
    suitColor: "bg-red-600",
    description: "\u0418\u0445 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0440\u0430\u0432\u0435\u043D \u0441\u0443\u043C\u043C\u0435 \u043E\u0447\u043A\u043E\u0432 \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0432\u0441\u0435\u0445 \u0432\u043E\u0438\u043D\u043E\u0432 \u0432 \u0430\u0440\u043C\u0438\u0438 \u0438\u0433\u0440\u043E\u043A\u0430. \u041E\u0434\u043D\u0430\u043A\u043E \u0438\u0433\u0440\u043E\u043A, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \n    \u043E\u0431\u043B\u0430\u0434\u0430\u0435\u0442 \u043D\u0430\u0438\u0431\u043E\u043B\u044C\u0448\u0438\u043C \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E\u043C \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0432\u043E\u0438\u043D\u043E\u0432, \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u043D\u043E\u043C\u0438\u043D\u0430\u043B \u0441\u0432\u043E\u0435\u0439 \u0441\u0430\u043C\u043E\u0439 \u0446\u0435\u043D\u043D\u043E\u0439 \u043C\u043E\u043D\u0435\u0442\u044B. \n    \u0412 \u0441\u043B\u0443\u0447\u0430\u0435 \u0440\u0430\u0432\u043D\u043E\u0433\u043E \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432 \u0443 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0432\u0441\u0435 \u044D\u0442\u0438 \u0438\u0433\u0440\u043E\u043A\u0438 \u043F\u0440\u0438\u0431\u0430\u0432\u043B\u044F\u044E\u0442 \u043D\u043E\u043C\u0438\u043D\u0430\u043B \u0441\u0432\u043E\u0435\u0439 \u0441\u0430\u043C\u043E\u0439 \u0446\u0435\u043D\u043D\u043E\u0439 \n    \u043C\u043E\u043D\u0435\u0442\u044B \u043A \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044E \u0445\u0440\u0430\u0431\u0440\u043E\u0441\u0442\u0438 \u0441\u0432\u043E\u0438\u0445 \u0432\u043E\u0438\u043D\u043E\u0432.",
    ranksValues: function () { return ({
        2: {
            0: 8,
            1: 8,
        },
        3: {
            0: 8,
            1: 8,
        },
        4: {
            0: 8,
            1: 8,
        },
        5: {
            0: 9,
            1: 9,
        },
    }); },
    pointsValues: function () { return ({
        2: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9],
        },
        3: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9],
        },
        4: {
            0: [3, 4, 5, 6, 6, 7, 8, 9],
            1: [3, 4, 5, 6, 6, 7, 8, 9],
        },
        5: {
            0: [3, 4, 5, 6, 6, 7, 8, 9, 10],
            1: [3, 4, 5, 6, 6, 7, 8, 9, 10],
        },
    }); },
    scoringRule: function (cards) { return cards.reduce(TotalPoints, 0); },
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
                            drawName: "Upgrade coin Warrior distinction",
                        },
                    },
                    {
                        actionName: "UpgradeCoinAction",
                        config: {
                            value: 5,
                        },
                    },
                ];
                AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0432\u043E\u0438\u043D\u043E\u0432 \n                \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u043E\u0434\u043D\u0443 \u0438\u0437 \u0441\u0432\u043E\u0438\u0445 \u043C\u043E\u043D\u0435\u0442 \u043D\u0430 +5:"));
                AddActionsToStack(G, ctx, stack);
                StartActionFromStackOrEndActions(G, ctx, false);
            }
            else {
                return Math.max.apply(Math, player.boardCoins
                    .filter(function (coin) { return Boolean(coin === null || coin === void 0 ? void 0 : coin.value); })
                    .map(function (coin) { return coin.value; }));
            }
            return 0;
        },
    },
};
/**
 * <h3>Фракция разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (cards: PlayerCardsType[]) => number, ranksValues: () => IRankValues, distinction: {awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number, description: string}, description: string, suitColor: string, suit: SuitNames.EXPLORER, suitName: string, pointsValues: () => IPointsValues}}
 */
var explorer = {
    suit: "explorer" /* EXPLORER */,
    suitName: "Разведчики",
    suitColor: "bg-blue-500",
    description: "Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.",
    ranksValues: function () { return ({
        2: {
            0: 7,
            1: 7,
        },
        3: {
            0: 7,
            1: 7,
        },
        4: {
            0: 7,
            1: 7,
        },
        5: {
            0: 8,
            1: 8,
        },
    }); },
    pointsValues: function () { return ({
        2: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11],
        },
        3: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11],
        },
        4: {
            0: [5, 6, 7, 8, 9, 10, 11],
            1: [5, 6, 7, 8, 9, 10, 11],
        },
        5: {
            0: [5, 6, 7, 8, 9, 10, 11, 12],
            1: [5, 6, 7, 8, 9, 10, 11, 12],
        },
    }); },
    scoringRule: function (cards) { return cards.reduce(TotalPoints, 0); },
    distinction: {
        description: "\u041F\u043E\u043B\u0443\u0447\u0438\u0432 \u0437\u043D\u0430\u043A \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u0432\u043E\u0437\u044C\u043C\u0438\u0442\u0435 3 \u043A\u0430\u0440\u0442\u044B \u0438\u0437 \u043A\u043E\u043B\u043E\u0434\u044B \u044D\u043F\u043E\u0445\u0438 2 \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u0443 \u0441\u0435\u0431\u044F \n        \u043E\u0434\u043D\u0443 \u0438\u0437 \u044D\u0442\u0438\u0445 \u043A\u0430\u0440\u0442. \u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u043A\u0430\u0440\u0442\u0430 \u0434\u0432\u043E\u0440\u0444\u0430, \u0441\u0440\u0430\u0437\u0443 \u0436\u0435 \u043F\u043E\u043C\u0435\u0441\u0442\u0438\u0442\u0435 \u0435\u0433\u043E \u0432 \u0441\u0432\u043E\u044E \u0430\u0440\u043C\u0438\u044E. \u0418\u0433\u0440\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043F\u0440\u0438\u0437\u0432\u0430\u0442\u044C \n        \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F, \u0435\u0441\u043B\u0438 \u0432 \u044D\u0442\u043E\u0442 \u043C\u043E\u043C\u0435\u043D\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043B \u043B\u0438\u043D\u0438\u044E 5 \u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432. \u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u043A\u0430\u0440\u0442\u0430 \u043A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u043A\u0430\u044F \u043D\u0430\u0433\u0440\u0430\u0434\u0430, \u0442\u043E \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u0435 \u043E\u0434\u043D\u0443 \n        \u0438\u0437 \u0441\u0432\u043E\u0438\u0445 \u043C\u043E\u043D\u0435\u0442. \u0414\u0432\u0435 \u043E\u0441\u0442\u0430\u0432\u0448\u0438\u0435\u0441\u044F \u043A\u0430\u0440\u0442\u044B \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u044E\u0442\u0441\u044F \u0432 \u043A\u043E\u043B\u043E\u0434\u0443 \u044D\u043F\u043E\u0445\u0438 2. \u041F\u043E\u043B\u043E\u0436\u0438\u0442\u0435 \u043A\u0430\u0440\u0442\u0443 \u0437\u043D\u0430\u043A \u043E\u0442\u043B\u0438\u0447\u0438\u044F \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \u0432 \n        \u043A\u043E\u043C\u0430\u043D\u0434\u043D\u0443\u044E \u0437\u043E\u043D\u0443 \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u0448\u0438\u043C \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u043E\u043C.",
        awarding: function (G, ctx, player) {
            if (G.tierToEnd !== 0) {
                var stack = [
                    {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "explorerDistinction",
                            stageName: "pickDistinctionCard",
                            drawName: "Pick card by Explorer distinction",
                        },
                    },
                ];
                AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(player.nickname, " \u043F\u043E\u043B\u0443\u0447\u0438\u043B \u043F\u043E \u0437\u043D\u0430\u043A\u0443 \u043E\u0442\u043B\u0438\u0447\u0438\u044F \n                \u0440\u0430\u0437\u0432\u0435\u0434\u0447\u0438\u043A\u043E\u0432 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u0438\u0437 \u043A\u043E\u043B\u043E\u0434\u044B \u0432\u0442\u043E\u0440\u043E\u0439 \u044D\u043F\u043E\u0445\u0438:"));
                AddActionsToStack(G, ctx, stack);
                StartActionFromStackOrEndActions(G, ctx, false);
            }
            return 0;
        },
    },
};
/**
 * <h3>Конфиг фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @type {{blacksmith: ISuit, warrior: ISuit, explorer: ISuit, hunter: ISuit, miner: ISuit}}
 */
export var suitsConfig = {
    blacksmith: blacksmith,
    hunter: hunter,
    miner: miner,
    warrior: warrior,
    explorer: explorer,
};
