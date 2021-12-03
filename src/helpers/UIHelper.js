"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.DrawButton = exports.DrawCoin = exports.DrawCard = exports.DrawPlayersBoardForSuitCardDiscard = exports.DrawPlayerBoardForCardDiscard = exports.DrawBoard = void 0;
var SuitHelpers_1 = require("./SuitHelpers");
var SuitData_1 = require("../data/SuitData");
var StyleData_1 = require("../data/StyleData");
var react_1 = __importDefault(require("react"));
/**
 * <h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {{boardCols: number, lastBoardCol: number, boardRows: number}} Параметры для отрисовки сегмента игрового поля.
 * @constructor
 */
var DrawBoard = function (objectsSize) {
    var boardRows = Math.floor(Math.sqrt(objectsSize)), boardCols = Math.ceil(objectsSize / boardRows), lastBoardCol = objectsSize % boardCols;
    return { boardRows: boardRows, boardCols: boardCols, lastBoardCol: lastBoardCol };
};
exports.DrawBoard = DrawBoard;
/**
 * <h3>Отрисовка планшета конкретного игрока для дискарда карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
var DrawPlayerBoardForCardDiscard = function (data) {
    var playerHeaders = [], playerRows = [];
    for (var suit in SuitData_1.suitsConfig) {
        playerHeaders.push(react_1["default"].createElement("th", { className: "".concat(SuitData_1.suitsConfig[suit].suitColor), key: "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " ").concat(SuitData_1.suitsConfig[suit].suitName) },
            react_1["default"].createElement("span", { style: StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suit].suit), className: "bg-suit-icon" })));
    }
    for (var i = 0;; i++) {
        var playerCells = [];
        var isDrawRow = false, isExit = true, id = 0;
        playerRows[i] = [];
        for (var j = 0; j < data.props.G.suitsNum; j++) {
            var suit = Object.keys(SuitData_1.suitsConfig)[j];
            id = i + j;
            if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j] !== undefined &&
                data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i] !== undefined) {
                isExit = false;
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i].type !== "герой") {
                    isDrawRow = true;
                    (0, exports.DrawCard)(data, playerCells, data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i], id, data.props.G.publicPlayers[data.props.ctx.currentPlayer], suit, "OnClickDiscardCardFromPlayerBoard", j, i);
                }
                else {
                    playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " empty card ").concat(id) }));
                }
            }
            else {
                playerCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " empty card ").concat(id) }));
            }
        }
        if (isDrawRow) {
            playerRows[i].push(react_1["default"].createElement("tr", { key: "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " board row ").concat(i) }, playerCells));
        }
        if (isExit) {
            break;
        }
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("thead", null,
            react_1["default"].createElement("tr", null, playerHeaders)),
        react_1["default"].createElement("tbody", null, playerRows)));
};
exports.DrawPlayerBoardForCardDiscard = DrawPlayerBoardForCardDiscard;
/**
 * <h3>Отрисовка планшета конкретных игроков для дискарда карты конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшетов конкретных игроков для дискарда карты конкретной фракции по действию артефакта Hofud.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param suitName Фракция.
 * @returns {JSX.Element} Шаблон.
 * @constructor
 */
var DrawPlayersBoardForSuitCardDiscard = function (data, suitName) {
    var playersHeaders = [], playersRows = [], suitId = (0, SuitHelpers_1.GetSuitIndexByName)(suitName);
    for (var p = 0; p < data.props.G.publicPlayers.length; p++) {
        if (p !== +data.props.ctx.currentPlayer) {
            if (data.props.G.publicPlayers[p].cards[suitId] !== undefined &&
                data.props.G.publicPlayers[p].cards[suitId].length) {
                playersHeaders.push(react_1["default"].createElement("th", { className: "".concat(SuitData_1.suitsConfig[suitName].suitColor, " discard suit"), key: "".concat(data.props.G.publicPlayers[p].nickname, " ").concat(SuitData_1.suitsConfig[suitName].suitName) },
                    react_1["default"].createElement("span", { style: StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suitName].suitName), className: "bg-suit-icon" }, p + 1)));
            }
        }
    }
    for (var i = 0;; i++) {
        var isDrawRow = false, isExit = true;
        playersRows[i] = [];
        var playersCells = [];
        for (var p = 0; p < data.props.G.publicPlayers.length; p++) {
            if (p !== +data.props.ctx.currentPlayer) {
                if (data.props.G.publicPlayers[p].cards[suitId] !== undefined &&
                    data.props.G.publicPlayers[p].cards[suitId][i] !== undefined) {
                    if (data.props.G.publicPlayers[p].cards[suitId][i].type !== "герой") {
                        isExit = false;
                        isDrawRow = true;
                        (0, exports.DrawCard)(data, playersCells, data.props.G.publicPlayers[p].cards[suitId][i], i, data.props.G.publicPlayers[p], suitName, "OnClickDiscardSuitCardFromPlayerBoard", suitId, p, i);
                    }
                }
                else {
                    playersCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[p].nickname, " discard suit cardboard row ").concat(i) }));
                }
            }
        }
        if (isDrawRow) {
            playersRows[i].push(react_1["default"].createElement("tr", { key: "Discard suit cardboard row ".concat(i) }, playersCells));
        }
        if (isExit) {
            break;
        }
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("thead", null,
            react_1["default"].createElement("tr", null, playersHeaders)),
        react_1["default"].createElement("tbody", null, playersRows)));
};
exports.DrawPlayersBoardForSuitCardDiscard = DrawPlayersBoardForSuitCardDiscard;
/**
 * <h3>Отрисовка карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка карт на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param card Карта.
 * @param id Id карты.
 * @param player Игрок.
 * @param suit Фракция.
 * @param actionName Название действия.
 * @param args Аргументы действия.
 * @constructor
 */
var DrawCard = function (data, playerCells, card, id, player, suit, actionName) {
    var args = [];
    for (var _i = 7; _i < arguments.length; _i++) {
        args[_i - 7] = arguments[_i];
    }
    var styles, tdClasses, spanClasses, action;
    switch (actionName) {
        case "OnClickHeroCard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickHeroCard.apply(_a, args);
            };
            break;
        case "OnClickCampCard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickCampCard.apply(_a, args);
            };
            break;
        case "OnClickCard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickCard.apply(_a, args);
            };
            break;
        case "OnClickCardToPickDistinction":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickCardToPickDistinction.apply(_a, args);
            };
            break;
        case "OnClickCardToDiscard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).DiscardCard.apply(_a, args);
            };
            break;
        case "OnClickCardFromDiscard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).PickDiscardCard.apply(_a, args);
            };
            break;
        case "OnClickCardToDiscard2Players":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).DiscardCard2Players.apply(_a, args);
            };
            break;
        case "OnClickDiscardCardFromPlayerBoard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).DiscardCardFromPlayerBoard.apply(_a, args);
            };
            break;
        case "OnClickDiscardSuitCardFromPlayerBoard":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).DiscardSuitCardFromPlayerBoard.apply(_a, args);
            };
            break;
        case "OnClickCampCardHolda":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickCampCardHolda.apply(_a, args);
            };
            break;
        case "OnClickGetEnlistmentMercenaries":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).GetEnlistmentMercenaries.apply(_a, args);
            };
            break;
        default:
            action = null;
    }
    if (suit) {
        tdClasses = SuitData_1.suitsConfig[suit].suitColor;
    }
    if (card.type === "герой") {
        styles = StyleData_1.Styles.Heroes(card.game, card.name);
        if (player === null && !card.active) {
            spanClasses = "bg-hero-inactive";
            action = null;
        }
        else {
            spanClasses = "bg-hero";
        }
        if (suit === null) {
            tdClasses = "bg-gray-600";
        }
    }
    else if (card.type === "наёмник" || card.type === "артефакт") {
        styles = StyleData_1.Styles.CampCards(card.tier, card.path);
        spanClasses = "bg-camp";
        if (suit === null) {
            tdClasses = "bg-yellow-200";
        }
    }
    else {
        styles = StyleData_1.Styles.Cards(card.suit, card.points, card.name);
        spanClasses = "bg-card";
    }
    if (action) {
        tdClasses += " cursor-pointer";
    }
    playerCells.push(react_1["default"].createElement("td", { key: "".concat((player && player.nickname) ? "player ".concat((player.nickname), " ") : "").concat(suit, " card ").concat(id, " ").concat(card.name), className: tdClasses, onClick: function () { return action && action.apply(void 0, args); } },
        react_1["default"].createElement("span", { style: styles, title: card.description ? card.description : card.name, className: spanClasses },
            react_1["default"].createElement("b", null, card.points !== null ? card.points : (card.value !== undefined ? card.value : "")))));
};
exports.DrawCard = DrawCard;
/**
 * <h3>Отрисовка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка монет на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param type Тип монеты.
 * @param coin Монета.
 * @param id Id монеты.
 * @param player Игрок.
 * @param coinClasses Дополнительный классы для монеты.
 * @param additionalParam Дополнительные параметры.
 * @param actionName Название действия.
 * @param args Аргументы действия.
 * @constructor
 */
var DrawCoin = function (data, playerCells, type, coin, id, player, coinClasses, additionalParam, actionName) {
    var args = [];
    for (var _i = 9; _i < arguments.length; _i++) {
        args[_i - 9] = arguments[_i];
    }
    var styles, span = null, action, tdClasses = "bg-yellow-300", spanClasses;
    switch (actionName) {
        case "OnClickBoardCoin":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickBoardCoin.apply(_a, args);
            };
            break;
        case "OnClickHandCoin":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickHandCoin.apply(_a, args);
            };
            break;
        case "OnClickCoinToUpgrade":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).ClickCoinToUpgrade.apply(_a, args);
            };
            break;
        case "OnClickCoinToAddToPouch":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).AddCoinToPouch.apply(_a, args);
            };
            break;
        case "OnClickCoinToUpgradeVidofnirVedrfolnir":
            action = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = data.props.moves).UpgradeCoinVidofnirVedrfolnir.apply(_a, args);
            };
            break;
        default:
            action = null;
    }
    if (action) {
        tdClasses += " cursor-pointer";
    }
    if (type === "market") {
        styles = StyleData_1.Styles.Coin(coin.value, false);
        spanClasses = "bg-market-coin";
        span = (react_1["default"].createElement("span", { className: coinClasses }, additionalParam));
    }
    else {
        spanClasses = "bg-coin";
        if (coinClasses) {
            spanClasses += " ".concat(coinClasses);
        }
        if (type === "coin") {
            if (coin === undefined) {
                styles = StyleData_1.Styles.CoinBack();
            }
            else {
                styles = StyleData_1.Styles.Coin(coin.value, coin.isInitial);
            }
        }
        else {
            styles = StyleData_1.Styles.CoinBack();
            if (type === "back-small-market-coin") {
                span = (react_1["default"].createElement("span", { style: StyleData_1.Styles.Exchange(), className: "bg-small-market-coin" }));
            }
            else if (type === "back-tavern-icon") {
                span = (react_1["default"].createElement("span", { style: StyleData_1.Styles.Taverns(additionalParam), className: "bg-tavern-icon" }));
            }
        }
    }
    playerCells.push(react_1["default"].createElement("td", { key: "".concat((player && player.nickname) ? "player ".concat(player.nickname, " ") : "", "coin ").concat(id).concat(coin ? " ".concat(coin.value)
            : " empty"), className: tdClasses, onClick: function () { return action && action.apply(void 0, args); } },
        react_1["default"].createElement("span", { style: styles, className: spanClasses }, span)));
};
exports.DrawCoin = DrawCoin;
/**
 * <h3>Отрисовка кнопок.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка кнопок на игровом поле.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param boardCells Ячейки для отрисовки.
 * @param key Ключ.
 * @param name Имя кнопки.
 * @param player Игрок.
 * @param actionName
 * @param args Аргументы действия.
 * @constructor
 */
var DrawButton = function (data, boardCells, key, name, player, actionName) {
    var args = [];
    for (var _i = 6; _i < arguments.length; _i++) {
        args[_i - 6] = arguments[_i];
    }
    var action;
    switch (actionName) {
        case "OnClickStartEnlistmentMercenaries":
            action = function () {
                data.props.moves.StartEnlistmentMercenaries();
            };
            break;
        case "OnClickPassEnlistmentMercenaries":
            action = function () {
                data.props.moves.PassEnlistmentMercenaries();
            };
            break;
        default:
            action = null;
    }
    boardCells.push(react_1["default"].createElement("td", { key: "".concat((player && player.nickname) ? "Player ".concat(player.nickname, " ") : "").concat(key), className: "cursor-pointer", onClick: function () { return action && action.apply(void 0, args); } },
        react_1["default"].createElement("button", { className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" }, name)));
};
exports.DrawButton = DrawButton;
