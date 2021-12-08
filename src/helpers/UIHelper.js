var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GetSuitIndexByName } from "./SuitHelpers";
import { suitsConfig } from "../data/SuitData";
import { Styles } from "../data/StyleData";
/**
 * h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param {number} objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {{boardCols: number, lastBoardCol: number, boardRows: number}} Параметры для отрисовки сегмента игрового поля.
 * @constructor
 */
export var DrawBoard = function (objectsSize) {
    var boardRows = Math.floor(Math.sqrt(objectsSize)), boardCols = Math.ceil(objectsSize / boardRows), lastBoardCol = objectsSize % boardCols;
    return { boardRows: boardRows, boardCols: boardCols, lastBoardCol: lastBoardCol };
};
/**
 * <h3>Отрисовка планшета конкретного игрока для дискарда карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшета конкретного игрока для дискарда карты по действию артефакта Brisingamens.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @returns {JSX.Element} Поле для вывода карт для дискарда.
 * @constructor
 */
export var DrawPlayerBoardForCardDiscard = function (data) {
    var playerHeaders = [], playerRows = [];
    for (var suit in suitsConfig) {
        playerHeaders.push(_jsx("th", __assign({ className: "".concat(suitsConfig[suit].suitColor) }, { children: _jsx("span", { style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, void 0) }), "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " ").concat(suitsConfig[suit].suitName)));
    }
    for (var i = 0;; i++) {
        var playerCells = [];
        var isDrawRow = false, isExit = true, id = 0;
        playerRows[i] = [];
        for (var j = 0; j < data.props.G.suitsNum; j++) {
            var suit = Object.keys(suitsConfig)[j];
            id = i + j;
            if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j] !== undefined
                && data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i] !== undefined) {
                isExit = false;
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i].type !== "герой") {
                    isDrawRow = true;
                    DrawCard(data, playerCells, data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][i], id, data.props.G.publicPlayers[data.props.ctx.currentPlayer], suit, "OnClickDiscardCardFromPlayerBoard", j, i);
                }
                else {
                    playerCells.push(_jsx("td", {}, "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " empty card ").concat(id)));
                }
            }
            else {
                playerCells.push(_jsx("td", {}, "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " empty card ").concat(id)));
            }
        }
        if (isDrawRow) {
            playerRows[i].push(_jsx("tr", { children: playerCells }, "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " board row ").concat(i)));
        }
        if (isExit) {
            break;
        }
    }
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playerHeaders }, void 0) }, void 0), _jsx("tbody", { children: playerRows }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка планшета конкретных игроков для дискарда карты конкретной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка планшетов конкретных игроков для дискарда карты конкретной фракции по действию артефакта Hofud.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @param {string} suitName Фракция.
 * @returns {JSX.Element} Поле игрока для дискарда карты фракции.
 * @constructor
 */
export var DrawPlayersBoardForSuitCardDiscard = function (data, suitName) {
    var playersHeaders = [], playersRows = [], suitId = GetSuitIndexByName(suitName);
    for (var p = 0; p < data.props.G.publicPlayers.length; p++) {
        if (p !== Number(data.props.ctx.currentPlayer)) {
            if (data.props.G.publicPlayers[p].cards[suitId] !== undefined
                && data.props.G.publicPlayers[p].cards[suitId].length) {
                playersHeaders.push(_jsx("th", __assign({ className: "".concat(suitsConfig[suitName].suitColor, " discard suit") }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suitName].suitName), className: "bg-suit-icon" }, { children: p + 1 }), void 0) }), "".concat(data.props.G.publicPlayers[p].nickname, " ").concat(suitsConfig[suitName].suitName)));
            }
        }
    }
    for (var i = 0;; i++) {
        var isDrawRow = false, isExit = true;
        playersRows[i] = [];
        var playersCells = [];
        for (var p = 0; p < data.props.G.publicPlayers.length; p++) {
            if (p !== Number(data.props.ctx.currentPlayer)) {
                if (data.props.G.publicPlayers[p].cards[suitId] !== undefined
                    && data.props.G.publicPlayers[p].cards[suitId][i] !== undefined) {
                    if (data.props.G.publicPlayers[p].cards[suitId][i].type !== "герой") {
                        isExit = false;
                        isDrawRow = true;
                        DrawCard(data, playersCells, data.props.G.publicPlayers[p].cards[suitId][i], i, data.props.G.publicPlayers[p], suitName, "OnClickDiscardSuitCardFromPlayerBoard", suitId, p, i);
                    }
                }
                else {
                    playersCells.push(_jsx("td", {}, "".concat(data.props.G.publicPlayers[p].nickname, " discard suit cardboard row ").concat(i)));
                }
            }
        }
        if (isDrawRow) {
            playersRows[i].push(_jsx("tr", { children: playersCells }, "Discard suit cardboard row ".concat(i)));
        }
        if (isExit) {
            break;
        }
    }
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: playersHeaders }, void 0) }, void 0), _jsx("tbody", { children: playersRows }, void 0)] }, void 0));
};
/**
 * <h3>Отрисовка карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка карт на игровом поле.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @param {JSX.Element[]} playerCells Ячейки для отрисовки.
 * @param {DeckCardTypes | CampDeckCardTypes | IHero} card Карта.
 * @param {number} id Id карты.
 * @param {IPublicPlayer | null} player Игрок.
 * @param {string | null} suit Фракция.
 * @param {string} actionName Название действия.
 * @param {string | number | boolean | object | null} args Аргументы действия.
 * @constructor
 */
export var DrawCard = function (data, playerCells, card, id, player, suit, actionName) {
    var args = [];
    for (var _i = 7; _i < arguments.length; _i++) {
        args[_i - 7] = arguments[_i];
    }
    var styles = { background: "" }, tdClasses = "", spanClasses, action;
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
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (card.type === "герой" && "game" in card) {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && "active" in card && !card.active) {
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
        if ("tier" in card && "path" in card) {
            styles = Styles.CampCards(card.tier, card.path);
        }
        spanClasses = "bg-camp";
        if (suit === null) {
            tdClasses = "bg-yellow-200";
        }
    }
    else {
        if ("suit" in card && "points" in card) {
            if (typeof card.points === "number") {
                styles = Styles.Cards(card.suit, card.points, card.name);
            }
        }
        spanClasses = "bg-card";
    }
    if (action) {
        tdClasses += " cursor-pointer";
    }
    var description = "", value = "";
    if ("description" in card) {
        description = card.description;
    }
    if ("points" in card) {
        value = card.points !== null ? String(card.points) : "";
    }
    else if ("value" in card) {
        value = String(card.value);
    }
    playerCells.push(_jsx("td", __assign({ className: tdClasses, onClick: function () { return action && action.apply(void 0, args); } }, { children: _jsx("span", __assign({ style: styles, title: description ? description : card.name, className: spanClasses }, { children: _jsx("b", { children: value }, void 0) }), void 0) }), "".concat((player && player.nickname) ? "player ".concat((player.nickname), " ") : "").concat(suit, " card ").concat(id, " ").concat(card.name)));
};
/**
 * <h3>Отрисовка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка монет на игровом поле.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @param {JSX.Element[]} playerCells Ячейки для отрисовки.
 * @param {string} type Тип монеты.
 * @param {ICoin} coin Монета.
 * @param {number} id Id монеты.
 * @param {IPublicPlayer | null} player Игрок.
 * @param {string | null} coinClasses Дополнительный классы для монеты.
 * @param {number | null} additionalParam Дополнительные параметры.
 * @param {string} actionName Название действия.
 * @param {string | number | boolean | object | null} args Аргументы действия.
 * @constructor
 */
export var DrawCoin = function (data, playerCells, type, coin, id, player, coinClasses, additionalParam, actionName) {
    var args = [];
    for (var _i = 9; _i < arguments.length; _i++) {
        args[_i - 9] = arguments[_i];
    }
    var styles = { background: "" }, span = null, action, tdClasses = "bg-yellow-300", spanClasses;
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
        styles = Styles.Coin(coin.value, false);
        spanClasses = "bg-market-coin";
        if (coinClasses) {
            span = (_jsx("span", __assign({ className: coinClasses }, { children: additionalParam }), void 0));
        }
    }
    else {
        spanClasses = "bg-coin";
        if (coinClasses) {
            spanClasses += " ".concat(coinClasses);
        }
        if (type === "coin") {
            if (coin === undefined) {
                styles = Styles.CoinBack();
            }
            else {
                if (typeof coin.isInitial !== "undefined") {
                    styles = Styles.Coin(coin.value, coin.isInitial);
                }
            }
        }
        else {
            styles = Styles.CoinBack();
            if (type === "back-small-market-coin") {
                span = (_jsx("span", { style: Styles.Exchange(), className: "bg-small-market-coin" }, void 0));
            }
            else if (type === "back-tavern-icon") {
                if (typeof additionalParam === "number") {
                    span = (_jsx("span", { style: Styles.Taverns(additionalParam), className: "bg-tavern-icon" }, void 0));
                }
            }
        }
    }
    playerCells.push(_jsx("td", __assign({ className: tdClasses, onClick: function () { return action && action.apply(void 0, args); } }, { children: _jsx("span", __assign({ style: styles, className: spanClasses }, { children: span }), void 0) }), "".concat((player && player.nickname) ? "player ".concat(player.nickname, " ") : "", "coin ").concat(id).concat(coin ? " ".concat(coin.value)
        : " empty")));
};
/**
 * <h3>Отрисовка кнопок.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка кнопок на игровом поле.</li>
 * </ol>
 *
 * @param {GameBoard} data Глобальные параметры.
 * @param {JSX.Element[]} boardCells Ячейки для отрисовки.
 * @param {string} key Ключ.
 * @param {string} name Имя кнопки.
 * @param {IPublicPlayer} player Игрок.
 * @param {string} actionName Название действия.
 * @param {string | number | boolean | object | null} args Аргументы действия.
 * @constructor
 */
export var DrawButton = function (data, boardCells, key, name, player, actionName) {
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
    boardCells.push(_jsx("td", __assign({ className: "cursor-pointer", onClick: function () { return action && action.apply(void 0, args); } }, { children: _jsx("button", __assign({ className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" }, { children: name }), void 0) }), "".concat((player && player.nickname) ? "Player ".concat(player.nickname, " ") : "").concat(key)));
};
