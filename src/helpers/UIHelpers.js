import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GetSuitIndexByName } from "./SuitHelpers";
import { suitsConfig } from "../data/SuitData";
import { Styles } from "../data/StyleData";
import { AddDataToLog, LogTypes } from "../Logging";
import { DiscardAnyCardFromPlayerBoardProfit } from "./ProfitHelpers";
/**
 * h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param {number} objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns {IDrawBoardOptions} Параметры для отрисовки сегмента игрового поля.
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
        playerHeaders.push(_jsx("th", __assign({ className: "".concat(suitsConfig[suit].suitColor) }, { children: _jsx("span", { style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, void 0) }), "".concat(data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname, " \n                ").concat(suitsConfig[suit].suitName)));
    }
    DiscardAnyCardFromPlayerBoardProfit(data.props.G, data.props.ctx, data, playerRows);
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
            playersHeaders.push(_jsx("th", __assign({ className: "".concat(suitsConfig[suitName].suitColor, " discard suit") }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suitName].suitName), className: "bg-suit-icon" }, { children: p + 1 }), void 0) }), "".concat(data.props.G.publicPlayers[p].nickname, " ").concat(suitsConfig[suitName].suitName)));
        }
    }
    for (var i = 0;; i++) {
        var isDrawRow = false, isExit = true;
        playersRows[i] = [];
        var playersCells = [];
        for (var p = 0; p < data.props.G.publicPlayers.length; p++) {
            if (p !== Number(data.props.ctx.currentPlayer)) {
                if (data.props.G.publicPlayers[p].cards[suitId][i] !== undefined) {
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
    if (suit !== null && suit !== undefined) {
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
        if ("suit" in card && "points" in card && card.suit !== null) {
            styles = Styles.Cards(card.suit, card.name, card.points);
        }
        else {
            styles = Styles.Cards(null, card.name, null);
        }
        spanClasses = "bg-card";
    }
    if (action !== null) {
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
    playerCells.push(_jsx("td", __assign({ className: tdClasses, onClick: function () { return action && action.apply(void 0, args); } }, { children: _jsx("span", __assign({ style: styles, title: description !== null && description !== void 0 ? description : card.name, className: spanClasses }, { children: _jsx("b", { children: value }, void 0) }), void 0) }), "".concat((player && player.nickname) ? "player ".concat((player.nickname), " ") : "").concat(suit, " card ").concat(id, " ").concat(card.name)));
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
    var styles = { background: "" }, span = null, action, tdClasses = "bg-yellow-300", spanClasses = "";
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
    if (action !== null) {
        tdClasses += " cursor-pointer";
    }
    if (type === "market") {
        if (coin !== null) {
            styles = Styles.Coin(coin.value, false);
            spanClasses = "bg-market-coin";
            if (coinClasses !== null && coinClasses !== undefined) {
                span = (_jsx("span", __assign({ className: coinClasses }, { children: additionalParam }), void 0));
            }
        }
        else {
            AddDataToLog(data.props.G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041C\u043E\u043D\u0435\u0442\u0430 \u043D\u0430 \u0440\u044B\u043D\u043A\u0435 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C 'null'.");
        }
    }
    else {
        spanClasses = "bg-coin";
        if (coinClasses !== null && coinClasses !== undefined) {
            spanClasses += " ".concat(coinClasses);
        }
        if (type === "coin") {
            if (coin === null) {
                styles = Styles.CoinBack();
            }
            else {
                if (coin.isInitial !== undefined) {
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
                if (additionalParam !== null && additionalParam !== undefined) {
                    span = (_jsx("span", { style: Styles.Taverns(additionalParam), className: "bg-tavern-icon" }, void 0));
                }
            }
        }
    }
    playerCells.push(_jsx("td", __assign({ className: tdClasses, onClick: function () { return action !== null && action.apply(void 0, args); } }, { children: _jsx("span", __assign({ style: styles, className: spanClasses }, { children: span }), void 0) }), "".concat((player !== null && player.nickname) ? "player ".concat(player.nickname, " ") : "", "coin ").concat(id).concat(coin !== null
        ? " ".concat(coin.value) : " empty")));
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
    boardCells.push(_jsx("td", __assign({ className: "cursor-pointer", onClick: function () { return action !== null && action.apply(void 0, args); } }, { children: _jsx("button", __assign({ className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" }, { children: name }), void 0) }), "".concat((player === null || player === void 0 ? void 0 : player.nickname) ? "Player ".concat(player.nickname, " ") : "").concat(key)));
};
