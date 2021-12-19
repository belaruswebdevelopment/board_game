import { __assign, __spreadArray } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GetSuitIndexByName } from "./SuitHelpers";
import { suitsConfig } from "../data/SuitData";
import { Styles } from "../data/StyleData";
import { AddDataToLog, LogTypes } from "../Logging";
import { DiscardAnyCardFromPlayerBoardProfit } from "./ProfitHelpers";
/**
 * <h3>Активация мува при клике на карту героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретного героя выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickHeroCard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickHeroCard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты кэмпа выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCampCard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickCampCard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты таверны выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickCard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту преимущества.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты преимущества выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCardToPickDistinction = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickCardToPickDistinction.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карты для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретнойкарты для дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCardToDiscard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).DiscardCard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карты из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты из дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCardFromDiscard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).PickDiscardCard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту таверны для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты таверны при 2-х игроках выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCardToDiscard2Players = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).DiscardCard2Players.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту на планшете игрока для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретную карту на планшете игрока для дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickDiscardCardFromPlayerBoard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).DiscardCardFromPlayerBoard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту на планшете определённой фракции игрока для дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретную карту на планшете определённой фракции игрока для дискарда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
var OnClickDiscardSuitCardFromPlayerBoard = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).DiscardSuitCardFromPlayerBoard.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту кэмпа по действию героя Хольда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты кэмпа по действию героя Хольда выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCampCardHolda = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickCampCardHolda.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на карту наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной карты наёмника выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickGetEnlistmentMercenaries = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).GetEnlistmentMercenaries.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на монету на игровом столе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты на игровом столе выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickBoardCoin = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickBoardCoin.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на монету в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты в руке игрока выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickHandCoin = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickHandCoin.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на монету для её улучшения.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты для её улучшения выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCoinToUpgrade = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).ClickCoinToUpgrade.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на монету для добавления её в кошелёк.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты для добавления её в кошелёк выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCoinToAddToPouch = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).AddCoinToPouch.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на монету для её улучшения по действию артефакта 'VidofnirVedrfolnir'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной монеты для её улучшения о действию артефакта 'VidofnirVedrfolnir' выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param args Дополнительные аргументы.
 */
export var OnClickCoinToUpgradeVidofnirVedrfolnir = function (data) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    (_a = data.props.moves).UpgradeCoinVidofnirVedrfolnir.apply(_a, args);
};
/**
 * <h3>Активация мува при клике на кнопку старта действия 'EnlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной кнопки старта действия 'EnlistmentMercenaries' выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 */
export var OnClickStartEnlistmentMercenaries = function (data) {
    data.props.moves.StartEnlistmentMercenaries();
};
/**
 * <h3>Активация мува при клике на кнопку паса действия 'EnlistmentMercenaries'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретной кнопки паса действия 'EnlistmentMercenaries' выполняются мув.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 */
export var OnClickPassEnlistmentMercenaries = function (data) {
    data.props.moves.PassEnlistmentMercenaries();
};
/**
 * h3>Отрисовка сегмента игрового поля по указанным данным.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для отрисовки некоторых сегментов игрового поля.</li>
 * </ol>
 *
 * @param objectsSize Данные для вычисления параметров отрисовки сегмента игрового поля.
 * @returns Параметры для отрисовки сегмента игрового поля.
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
 * @param data Глобальные параметры.
 * @returns Поле для вывода карт для дискарда.
 */
export var DrawPlayerBoardForCardDiscard = function (data) {
    var playerHeaders = [], playerRows = [];
    for (var suit in suitsConfig) {
        playerHeaders.push(_jsx("th", __assign({ className: "".concat(suitsConfig[suit].suitColor) }, { children: _jsx("span", { style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, void 0) }), "".concat(data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname, " ").concat(suitsConfig[suit].suitName)));
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
 * @param data Глобальные параметры.
 * @param suitName Фракция.
 * @returns Поле игрока для дискарда карты фракции.
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
                    if (data.props.G.publicPlayers[p].cards[suitId][i].type !== "\u0433\u0435\u0440\u043E\u0439") {
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
 * @param data Глобальные параметры.
 * @param playerCells Ячейки для отрисовки.
 * @param card Карта.
 * @param id Id карты.
 * @param player Игрок.
 * @param suit Фракция.
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export var DrawCard = function (data, playerCells, card, id, player, suit, actionName) {
    var args = [];
    for (var _i = 7; _i < arguments.length; _i++) {
        args[_i - 7] = arguments[_i];
    }
    var styles = { background: "" }, tdClasses = "", spanClasses = "", action = null;
    switch (actionName) {
        case "OnClickHeroCard":
            action = OnClickHeroCard;
            break;
        case "OnClickCampCard":
            action = OnClickCampCard;
            break;
        case "OnClickCard":
            action = OnClickCard;
            break;
        case "OnClickCardToPickDistinction":
            action = OnClickCardToPickDistinction;
            break;
        case "OnClickCardToDiscard":
            action = OnClickCardToDiscard;
            break;
        case "OnClickCardFromDiscard":
            action = OnClickCardFromDiscard;
            break;
        case "OnClickCardToDiscard2Players":
            action = OnClickCardToDiscard2Players;
            break;
        case "OnClickDiscardCardFromPlayerBoard":
            action = OnClickDiscardCardFromPlayerBoard;
            break;
        case "OnClickDiscardSuitCardFromPlayerBoard":
            action = OnClickDiscardSuitCardFromPlayerBoard;
            break;
        case "OnClickCampCardHolda":
            action = OnClickCampCardHolda;
            break;
        case "OnClickGetEnlistmentMercenaries":
            action = OnClickGetEnlistmentMercenaries;
            break;
        default:
            action = null;
    }
    if (suit !== null && suit !== undefined) {
        tdClasses = suitsConfig[suit].suitColor;
    }
    if (card.type === "\u0433\u0435\u0440\u043E\u0439" && "game" in card) {
        styles = Styles.Heroes(card.game, card.name);
        if (player === null && "active" in card && !card.active) {
            spanClasses = "bg-hero-inactive";
        }
        else {
            spanClasses = "bg-hero";
        }
        if (suit === null) {
            tdClasses = "bg-gray-600";
        }
    }
    else if (card.type === "\u043D\u0430\u0451\u043C\u043D\u0438\u043A" || card.type === "\u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442") {
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
    if (actionName !== null) {
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
    playerCells.push(_jsx("td", __assign({ className: tdClasses, onClick: function () { return action === null || action === void 0 ? void 0 : action.apply(void 0, __spreadArray([data], args, false)); } }, { children: _jsx("span", __assign({ style: styles, title: description !== null && description !== void 0 ? description : card.name, className: spanClasses }, { children: _jsx("b", { children: value }, void 0) }), void 0) }), "".concat((player && player.nickname) ? "player ".concat((player.nickname), " ") : "").concat(suit, " card ").concat(id, " ").concat(card.name)));
};
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
 */
export var DrawCoin = function (data, playerCells, type, coin, id, player, coinClasses, additionalParam, actionName) {
    var args = [];
    for (var _i = 9; _i < arguments.length; _i++) {
        args[_i - 9] = arguments[_i];
    }
    var styles = { background: "" }, span = null, tdClasses = "bg-yellow-300", spanClasses = "", action = null;
    switch (actionName) {
        case "OnClickBoardCoin":
            action = OnClickBoardCoin;
            break;
        case "OnClickHandCoin":
            action = OnClickHandCoin;
            break;
        case "OnClickCoinToUpgrade":
            action = OnClickCoinToUpgrade;
            break;
        case "OnClickCoinToAddToPouch":
            action = OnClickCoinToAddToPouch;
            break;
        case "OnClickCoinToUpgradeVidofnirVedrfolnir":
            action = OnClickCoinToUpgradeVidofnirVedrfolnir;
            break;
        default:
            action = null;
    }
    if (actionName !== null) {
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
    playerCells.push(_jsx("td", __assign({ className: tdClasses, onClick: function () { return action === null || action === void 0 ? void 0 : action.apply(void 0, __spreadArray([data], args, false)); } }, { children: _jsx("span", __assign({ style: styles, className: spanClasses }, { children: span }), void 0) }), "".concat((player === null || player === void 0 ? void 0 : player.nickname) ? "player ".concat(player.nickname, " ") : "", "coin ").concat(id).concat(coin !== null ? " ".concat(coin.value) : " empty")));
};
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
 * @param actionName Название действия.
 * @param args Аргументы действия.
 */
export var DrawButton = function (data, boardCells, key, name, player, actionName) {
    var args = [];
    for (var _i = 6; _i < arguments.length; _i++) {
        args[_i - 6] = arguments[_i];
    }
    var action = null;
    switch (actionName) {
        case "OnClickStartEnlistmentMercenaries":
            action = OnClickStartEnlistmentMercenaries;
            break;
        case "OnClickPassEnlistmentMercenaries":
            action = OnClickPassEnlistmentMercenaries;
            break;
        default:
            action = null;
    }
    boardCells.push(_jsx("td", __assign({ className: "cursor-pointer", onClick: function () { return action === null || action === void 0 ? void 0 : action.apply(void 0, __spreadArray([data], args, false)); } }, { children: _jsx("button", __assign({ className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" }, { children: name }), void 0) }), "".concat((player === null || player === void 0 ? void 0 : player.nickname) ? "Player ".concat(player.nickname, " ") : "").concat(key)));
};
