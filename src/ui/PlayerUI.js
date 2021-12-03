"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.DrawPlayersBoards = exports.DrawPlayersHandsCoins = exports.DrawPlayersBoardsCoins = void 0;
var react_1 = __importDefault(require("react"));
var SuitData_1 = require("../data/SuitData");
var Tavern_1 = require("../Tavern");
var Score_1 = require("../Score");
var StyleData_1 = require("../data/StyleData");
var SuitHelpers_1 = require("../helpers/SuitHelpers");
var UIHelper_1 = require("../helpers/UIHelper");
var ScoreHelpers_1 = require("../helpers/ScoreHelpers");
/**
 * <h3>Отрисовка планшета монет, выложенных игроком на стол.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawPlayersBoardsCoins = function (data) {
    var playersBoardsCoins = [], playerHeaders = [], playerFooters = [], playerRows = [];
    for (var p = 0; p < data.props.ctx.numPlayers; p++) {
        var coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
        playerRows[p] = [];
        for (var i = 0; i < 2; i++) {
            var playerCells = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (var j = 0; j < data.props.G.tavernsNum; j++) {
                    playerHeaders[p].push(react_1["default"].createElement("th", { key: "Tavern ".concat(Tavern_1.tavernsConfig[j].name) },
                        react_1["default"].createElement("span", { style: StyleData_1.Styles.Taverns(j), className: "bg-tavern-icon" })));
                    if (data.props.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                        if ((+data.props.ctx.currentPlayer === p && data.props.ctx.phase === "placeCoins") ||
                            (+data.props.ctx.currentPlayer === p && data.props.ctx.phase === "placeCoinsUline"
                                && j === data.props.G.currentTavern + 1)) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "back-tavern-icon", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, j, "OnClickBoardCoin", j);
                        }
                        else {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "back-tavern-icon", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, j);
                        }
                    }
                    else if (data.props.ctx.phase === "placeCoins" && +data.props.ctx.currentPlayer === p) {
                        (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, "OnClickBoardCoin", j);
                    }
                    else {
                        if (data.props.G.winner || (data.props.ctx.phase === "placeCoinsUline" &&
                            data.props.G.currentTavern >= j - 1) || (data.props.ctx.phase !== "placeCoins"
                            && data.props.G.currentTavern >= j)) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                        }
                        else {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "back", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                        }
                    }
                    coinIndex++;
                }
            }
            else if (i === 1) {
                for (var j = data.props.G.tavernsNum; j <= data.props.G.publicPlayers[p].boardCoins.length; j++) {
                    if (j === data.props.G.publicPlayers[p].boardCoins.length) {
                        playerFooters[p].push(react_1["default"].createElement("th", { key: "".concat(data.props.G.publicPlayers[p].nickname, " priority icon") },
                            react_1["default"].createElement("span", { style: StyleData_1.Styles.Priority(), className: "bg-priority-icon" })));
                        playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[p].nickname, " priority gem"), className: "bg-gray-300" },
                            react_1["default"].createElement("span", { style: StyleData_1.Styles.Priorities(data.props.G.publicPlayers[p].priority.value), className: "bg-priority" })));
                    }
                    else {
                        playerFooters[p].push(react_1["default"].createElement("th", { key: "".concat(data.props.G.publicPlayers[p].nickname, " exchange icon ").concat(j) },
                            react_1["default"].createElement("span", { style: StyleData_1.Styles.Exchange(), className: "bg-small-market-coin" })));
                        if (data.props.G.publicPlayers[p].boardCoins[coinIndex] === null) {
                            if (+data.props.ctx.currentPlayer === p && data.props.ctx.phase !== "placeCoinsUline" &&
                                (data.props.ctx.phase === "placeCoins" || (data.props.ctx.activePlayers &&
                                    data.props.ctx.activePlayers[data.props.ctx.currentPlayer]) ===
                                    "placeTradingCoinsUline")) {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "back-small-market-coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, "OnClickBoardCoin", j);
                            }
                            else {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "back-small-market-coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        else if (+data.props.ctx.currentPlayer === p && (data.props.ctx.phase === "placeCoins" ||
                            (data.props.ctx.activePlayers && data.props.ctx.activePlayers[data.props.ctx.currentPlayer])
                                === "placeTradingCoinsUline")) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p], null, null, "OnClickBoardCoin", j);
                        }
                        else {
                            if (data.props.G.winner || (data.props.ctx.phase !== "placeCoins" &&
                                +data.props.ctx.currentPlayer === p &&
                                data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern] &&
                                data.props.G.publicPlayers[p].boardCoins[data.props.G.currentTavern].isTriggerTrading)) {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                            }
                            else {
                                (0, UIHelper_1.DrawCoin)(data, playerCells, "back", data.props.G.publicPlayers[p].boardCoins[coinIndex], coinIndex, data.props.G.publicPlayers[p]);
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(react_1["default"].createElement("tr", { key: "".concat(data.props.G.publicPlayers[p].nickname, " board coins row ").concat(i) }, playerCells));
        }
        playersBoardsCoins[p].push(react_1["default"].createElement("table", { className: "mx-auto", key: "".concat(data.props.G.publicPlayers[p].nickname, " board coins") },
            react_1["default"].createElement("caption", null,
                "Player ",
                p + 1,
                " (",
                data.props.G.publicPlayers[p].nickname,
                ") played coins"),
            react_1["default"].createElement("thead", null,
                react_1["default"].createElement("tr", null, playerHeaders[p])),
            react_1["default"].createElement("tbody", null, playerRows[p]),
            react_1["default"].createElement("tfoot", null,
                react_1["default"].createElement("tr", null, playerFooters[p]))));
    }
    return playersBoardsCoins;
};
exports.DrawPlayersBoardsCoins = DrawPlayersBoardsCoins;
/**
 * <h3>Отрисовка планшета монет, находящихся в руках игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawPlayersHandsCoins = function (data) {
    var playersHandsCoins = [];
    for (var p = 0; p < data.props.ctx.numPlayers; p++) {
        var playerCells = [];
        playersHandsCoins[p] = [];
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < data.props.G.publicPlayers[p].handCoins.length; j++) {
                if (data.props.G.publicPlayers[p].handCoins[j] === null) {
                    playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[p].nickname, " hand coin ").concat(j, " empty"), className: "bg-yellow-300" },
                        react_1["default"].createElement("span", { className: "bg-coin bg-yellow-300 border-2" })));
                }
                else {
                    if (+data.props.ctx.currentPlayer === p || data.props.G.winner) {
                        var coinClasses = "border-2";
                        if (data.props.G.publicPlayers[p].selectedCoin === j) {
                            coinClasses = "border-2 border-green-400";
                        }
                        if (!data.props.G.winner && (data.props.ctx.phase === "placeCoins" ||
                            data.props.ctx.phase === "placeCoinsUline" || (data.props.ctx.activePlayers &&
                            data.props.ctx.activePlayers[data.props.ctx.currentPlayer]) === "placeTradingCoinsUline")) {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p], coinClasses, null, "OnClickHandCoin", j);
                        }
                        else {
                            (0, UIHelper_1.DrawCoin)(data, playerCells, "coin", data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p], coinClasses);
                        }
                    }
                    else {
                        (0, UIHelper_1.DrawCoin)(data, playerCells, "back", data.props.G.publicPlayers[p].handCoins[j], j, data.props.G.publicPlayers[p]);
                    }
                }
            }
        }
        playersHandsCoins[p].push(react_1["default"].createElement("table", { className: "mx-auto", key: "".concat(data.props.G.publicPlayers[p].nickname, " hand coins") },
            react_1["default"].createElement("caption", null,
                "Player ",
                p + 1,
                " (",
                data.props.G.publicPlayers[p].nickname,
                ") coins"),
            react_1["default"].createElement("tbody", null,
                react_1["default"].createElement("tr", null, playerCells))));
    }
    return playersHandsCoins;
};
exports.DrawPlayersHandsCoins = DrawPlayersHandsCoins;
/**
 * <h3>Отрисовка планшета всех карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawPlayersBoards = function (data) {
    var playersBoards = [], playerHeaders = [], playerHeadersCount = [], playerRows = [];
    for (var p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerHeadersCount[p] = [];
        playerRows[p] = [];
        for (var suit in SuitData_1.suitsConfig) {
            playerHeaders[p].push(react_1["default"].createElement("th", { className: "".concat(SuitData_1.suitsConfig[suit].suitColor), key: "".concat(data.props.G.publicPlayers[p].nickname, " ").concat(SuitData_1.suitsConfig[suit].suitName) },
                react_1["default"].createElement("span", { style: StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suit].suit), className: "bg-suit-icon" })));
            playerHeadersCount[p].push(react_1["default"].createElement("th", { className: "".concat(SuitData_1.suitsConfig[suit].suitColor, " text-white"), key: "".concat(data.props.G.publicPlayers[p].nickname, " ").concat(SuitData_1.suitsConfig[suit].suitName, " count") },
                react_1["default"].createElement("b", null, data.props.G.publicPlayers[p].cards[(0, SuitHelpers_1.GetSuitIndexByName)(suit)].reduce(ScoreHelpers_1.TotalRank, 0))));
        }
        for (var s = 0; s < 1 + data.props.G.expansions.thingvellir.active; s++) {
            if (s === 0) {
                playerHeaders[p].push(react_1["default"].createElement("th", { className: "bg-gray-600", key: "".concat(data.props.G.publicPlayers[p].nickname, " hero icon") },
                    react_1["default"].createElement("span", { style: StyleData_1.Styles.HeroBack(), className: "bg-hero-icon" })));
                playerHeadersCount[p].push(react_1["default"].createElement("th", { className: "bg-gray-600 text-white", key: "".concat(data.props.G.publicPlayers[p].nickname, " hero count") },
                    react_1["default"].createElement("b", null, data.props.G.publicPlayers[p].heroes.length)));
            }
            else {
                playerHeaders[p].push(react_1["default"].createElement("th", { className: "bg-yellow-200", key: "".concat(data.props.G.publicPlayers[p].nickname, " camp icon") },
                    react_1["default"].createElement("span", { style: StyleData_1.Styles.Camp(), className: "bg-camp-icon" })));
                playerHeadersCount[p].push(react_1["default"].createElement("th", { className: "bg-yellow-200 text-white", key: "".concat(data.props.G.publicPlayers[p].nickname, " camp counts") },
                    react_1["default"].createElement("b", null, data.props.G.publicPlayers[p].campCards.length)));
            }
        }
        for (var i = 0;; i++) {
            var playerCells = [];
            var isDrawRow = false, id = 0;
            playerRows[p][i] = [];
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                var suit = Object.keys(SuitData_1.suitsConfig)[j];
                id = i + j;
                if (data.props.G.publicPlayers[p].cards[j] !== undefined && data.props.G.publicPlayers[p].cards[j][i]
                    !== undefined) {
                    isDrawRow = true;
                    (0, UIHelper_1.DrawCard)(data, playerCells, data.props.G.publicPlayers[p].cards[j][i], id, data.props.G.publicPlayers[p], suit);
                }
                else {
                    playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[p].nickname, " empty card ").concat(id) }));
                }
            }
            for (var k = 0; k < 1 + data.props.G.expansions.thingvellir.active; k++) {
                id += k + 1;
                if (k === 0) {
                    // todo Draw heroes from the beginning if player has suit heroes (or draw them with opacity)
                    if (data.props.G.publicPlayers[p].heroes[i] !== undefined &&
                        (!data.props.G.publicPlayers[p].heroes[i].suit &&
                            !((data.props.G.publicPlayers[p].heroes[i].name === "Ylud" &&
                                data.props.G.publicPlayers[p].cards.flat().findIndex(function (card) { return card.name === "Ylud"; }) !== -1)
                                || (data.props.G.publicPlayers[p].heroes[i].name === "Thrud" &&
                                    data.props.G.publicPlayers[p].cards.flat().findIndex(function (card) { return card.name === "Thrud"; })
                                        !== -1)))) {
                        isDrawRow = true;
                        (0, UIHelper_1.DrawCard)(data, playerCells, data.props.G.publicPlayers[p].heroes[i], id, data.props.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[p].nickname, " hero ").concat(i) }));
                    }
                }
                else {
                    if (data.props.G.publicPlayers[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        (0, UIHelper_1.DrawCard)(data, playerCells, data.props.G.publicPlayers[p].campCards[i], id, data.props.G.publicPlayers[p]);
                    }
                    else {
                        playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[p].nickname, " camp card ").concat(i) }));
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(react_1["default"].createElement("tr", { key: "".concat(data.props.G.publicPlayers[p].nickname, " board row ").concat(i) }, playerCells));
            }
            else {
                break;
            }
        }
        playersBoards[p].push(react_1["default"].createElement("table", { className: "mx-auto", key: "".concat(data.props.G.publicPlayers.nickname, " board") },
            react_1["default"].createElement("caption", null,
                "Player ",
                p + 1,
                " (",
                data.props.G.publicPlayers[p].nickname,
                ") cards, ",
                data.props.G.winner !== null ?
                    "Final: ".concat(data.props.G.totalScore[p]) : (0, Score_1.CurrentScoring)(data.props.G.publicPlayers[p]),
                " points"),
            react_1["default"].createElement("thead", null,
                react_1["default"].createElement("tr", null, playerHeaders[p]),
                react_1["default"].createElement("tr", null, playerHeadersCount[p])),
            react_1["default"].createElement("tbody", null, playerRows[p])));
    }
    return playersBoards;
};
exports.DrawPlayersBoards = DrawPlayersBoards;
