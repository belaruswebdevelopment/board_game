"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.DrawTaverns = exports.DrawCamp = exports.DrawProfit = exports.DrawDistinctions = exports.DrawHeroes = exports.DrawMarketCoins = exports.DrawWinner = exports.DrawCurrentPlayerTurn = exports.DrawTierCards = void 0;
var react_1 = __importDefault(require("react"));
var Coin_1 = require("../Coin");
var SuitData_1 = require("../data/SuitData");
var Tavern_1 = require("../Tavern");
var StyleData_1 = require("../data/StyleData");
var UIHelper_1 = require("../helpers/UIHelper");
var ScoreHelpers_1 = require("../helpers/ScoreHelpers");
/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawTierCards = function (data) { return (react_1["default"].createElement("b", null,
    "Tier: ",
    react_1["default"].createElement("span", { className: "italic" },
        data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length
            ? data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1,
        "/",
        data.props.G.decks.length,
        "(",
        data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
            data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0,
        data.props.G.decks.length - data.props.G.tierToEnd === 0 ? "/"
            + data.props.G.decks.reduce(function (count, current) { return count + current.length; }, 0)
            : "",
        " cards left)"))); };
exports.DrawTierCards = DrawTierCards;
/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawCurrentPlayerTurn = function (data) { return (react_1["default"].createElement("b", null,
    "Current player: ",
    react_1["default"].createElement("span", { className: "italic" },
        "Player ",
        Number(data.props.ctx.currentPlayer) + 1),
    " | Turn: ",
    react_1["default"].createElement("span", { className: "italic" }, data.props.ctx.turn))); };
exports.DrawCurrentPlayerTurn = DrawCurrentPlayerTurn;
/**
 * <h3>Отрисовка игровой информации о текущем статусе игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawWinner = function (data) {
    var winner;
    if (data.props.ctx.gameover) {
        if (data.props.G.winner !== undefined) {
            if (data.props.G.winner.length === 1) {
                winner = "Winner: Player ".concat(data.props.G.publicPlayers[data.props.G.winner[0]].nickname);
            }
            else {
                winner = "Winners: ";
                data.props.G.winner.forEach(function (playerId, index) {
                    winner += "".concat(index + 1, ") Player ").concat(data.props.G.publicPlayers[playerId].nickname, "; ");
                });
            }
        }
        else {
            winner = "Draw!";
        }
    }
    else {
        winner = "Game is started";
    }
    return (react_1["default"].createElement("b", null,
        "Game status: ",
        react_1["default"].createElement("span", { className: "italic" }, winner.trim())));
};
exports.DrawWinner = DrawWinner;
/**
 * <h3>Отрисовка рынка монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawMarketCoins = function (data) {
    var boardRows = [], drawData = (0, UIHelper_1.DrawBoard)(data.props.G.marketCoinsUnique.length), countMarketCoins = (0, Coin_1.CountMarketCoins)(data.props.G);
    for (var i = 0; i < drawData.boardRows; i++) {
        var boardCells = [];
        boardRows[i] = [];
        for (var j = 0; j < drawData.boardCols; j++) {
            var increment = i * drawData.boardCols + j, tempCoinValue = data.props.G.marketCoinsUnique[increment].value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? "text-red-500" : "text-blue-500";
            (0, UIHelper_1.DrawCoin)(data, boardCells, "market", data.props.G.marketCoinsUnique[increment], increment, null, coinClassName, countMarketCoins[tempCoinValue], "OnClickHandCoin", j);
            if (increment + 1 === data.props.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(react_1["default"].createElement("tr", { key: "Market coins row ".concat(i) }, boardCells));
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("caption", null,
            react_1["default"].createElement("span", { className: "block" },
                react_1["default"].createElement("span", { style: StyleData_1.Styles.Exchange(), className: "bg-top-market-coin-icon" }),
                " Market coins (",
                data.props.G.marketCoins.length,
                " left)")),
        react_1["default"].createElement("tbody", null, boardRows)));
};
exports.DrawMarketCoins = DrawMarketCoins;
/**
 * <h3>Отрисовка всех героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawHeroes = function (data) {
    var boardRows = [], drawData = (0, UIHelper_1.DrawBoard)(data.props.G.heroes.length);
    for (var i = 0; i < drawData.boardRows; i++) {
        var boardCells = [];
        boardRows[i] = [];
        for (var j = 0; j < drawData.boardCols; j++) {
            var increment = i * drawData.boardCols + j;
            (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.heroes[increment], increment, null, null, "OnClickHeroCard", increment);
            if (increment + 1 === data.props.G.heroes.length) {
                break;
            }
        }
        boardRows[i].push(react_1["default"].createElement("tr", { key: "Heroes row ".concat(i) }, boardCells));
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("caption", null,
            react_1["default"].createElement("span", { style: StyleData_1.Styles.HeroBack(), className: "bg-top-hero-icon" }),
            " ",
            react_1["default"].createElement("span", null,
                "Heroes (",
                data.props.G.heroes.length,
                " left)")),
        react_1["default"].createElement("tbody", null, boardRows)));
};
exports.DrawHeroes = DrawHeroes;
/**
 * <h3>Отрисовка преимуществ в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawDistinctions = function (data) {
    var boardCells = [];
    for (var i = 0; i < 1; i++) {
        var _loop_1 = function (j) {
            var suit = Object.keys(SuitData_1.suitsConfig)[j];
            boardCells.push(react_1["default"].createElement("td", { className: "bg-green-500 cursor-pointer", key: "Distinction ".concat(suit, " card"), onClick: function () { return data.OnClickDistinctionCard(j); }, title: SuitData_1.suitsConfig[suit].distinction.description },
                react_1["default"].createElement("span", { style: StyleData_1.Styles.Distinctions(suit), className: "bg-suit-distinction" })));
        };
        for (var j = 0; j < data.props.G.suitsNum; j++) {
            _loop_1(j);
        }
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("caption", null,
            react_1["default"].createElement("span", { style: StyleData_1.Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }),
            " ",
            react_1["default"].createElement("span", null, "Distinctions")),
        react_1["default"].createElement("tbody", null,
            react_1["default"].createElement("tr", null, boardCells))));
};
exports.DrawDistinctions = DrawDistinctions;
/**
 * <h3>Отрисовка профита от карт и героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param option Опция отрисовки конкретного профита.
 * @constructor
 */
var DrawProfit = function (data, option) {
    var boardCells = [];
    var caption = "Get ";
    var _loop_2 = function (i) {
        if (option === "placeCards") {
            caption += "suit to place ".concat(data.props.G.actionsNum ? data.props.G.actionsNum : 1, " \n            ").concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.drawName).concat(data.props.G.actionsNum
                > 1 ? "s" : "", " to ").concat(data.props.G.actionsNum > 1 ? "different" : "that", " suit.");
            var _loop_3 = function (j) {
                var suit = Object.keys(SuitData_1.suitsConfig)[j];
                if (suit !== (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard &&
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.suit)) {
                    boardCells.push(react_1["default"].createElement("td", { className: "".concat(SuitData_1.suitsConfig[suit].suitColor, " cursor-pointer"), key: "Place ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.drawName, " \n                            on ").concat(SuitData_1.suitsConfig[suit].suitName), onClick: function () { return data.OnClickSuitToPlaceCard(j); } },
                        react_1["default"].createElement("span", { style: StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suit].suit), className: "bg-suit-icon" },
                            react_1["default"].createElement("b", null, data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].variants[suit].points
                                !== null ? data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].variants[suit].points
                                : ""))));
                }
            };
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                _loop_3(j);
            }
        }
        else if (option === "explorerDistinction") {
            caption += "one card to your board.";
            for (var j = 0; j < 3; j++) {
                (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.decks[1][j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.decks[1][j].suit, "OnClickCardToPickDistinction", j);
            }
        }
        else if (option === "BonfurAction" || option === "DagdaAction") {
            caption += "".concat(data.props.G.actionsNum, " card").concat(data.props.G.actionsNum > 1 ? "s" : "", " to discard from your \n            board.");
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0] !== undefined &&
                    SuitData_1.suitsConfig[data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0].suit].suit !==
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit &&
                    !(option === "DagdaAction" && data.props.G.actionsNum === 1 &&
                        SuitData_1.suitsConfig[data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0].suit].suit ===
                            (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard &&
                                data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.suit))) {
                    var last = data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j].length - 1;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last].type !== "герой") {
                        (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last], last, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last].suit, "OnClickCardToDiscard", j, last);
                    }
                }
            }
        }
        else if (option === "AndumiaAction" || option === "BrisingamensAction") {
            caption += "".concat(data.props.G.actionsNum, " card").concat(data.props.G.actionsNum > 1 ? "s" : "", " from discard pile to \n            your board.");
            for (var j = 0; j < data.props.G.discardCardsDeck.length; j++) {
                (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.discardCardsDeck[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.discardCardsDeck[j].suit, "OnClickCardFromDiscard", j);
            }
        }
        else if (option === "BrisingamensEndGameAction") {
            caption += "one card to discard from your board.";
            boardCells.push(react_1["default"].createElement("td", { key: "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " discard card") }, (0, UIHelper_1.DrawPlayerBoardForCardDiscard)(data)));
        }
        else if (option === "HofudAction") {
            caption += "one warrior card to discard from your board.";
            boardCells.push(react_1["default"].createElement("td", { key: "Discard ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit, " suit \n                cardboard") }, (0, UIHelper_1.DrawPlayersBoardForSuitCardDiscard)(data, data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit)));
        }
        else if (option === "HoldaAction") {
            caption += "one card from camp to your board.";
            for (var j = 0; j < data.props.G.campNum; j++) {
                if (data.props.G.camp[j]) {
                    (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.camp[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], null, "OnClickCampCardHolda", j);
                }
            }
        }
        else if (option === "discardCard") {
            caption += "one card to discard from current tavern.";
            for (var j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[data.props.G.currentTavern][j]) {
                    (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.taverns[data.props.G.currentTavern][j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.taverns[data.props.G.currentTavern][j].suit, "OnClickCardToDiscard2Players", j);
                }
            }
        }
        else if (option === "getMjollnirProfit") {
            caption += "suit to get Mjöllnir profit from ranks on that suit.";
            var _loop_4 = function (j) {
                var suit = Object.keys(SuitData_1.suitsConfig)[j];
                boardCells.push(react_1["default"].createElement("td", { className: "".concat(SuitData_1.suitsConfig[suit].suitColor, " cursor-pointer"), key: "".concat(suit, " suit to get Mj\u00F6llnir profit"), onClick: function () { return data.OnClickSuitToGetMjollnirProfit(j); } },
                    react_1["default"].createElement("span", { style: StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suit].suit), className: "bg-suit-icon" },
                        react_1["default"].createElement("b", { className: "whitespace-nowrap text-white" }, data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j].reduce(ScoreHelpers_1.TotalRank, 0)
                            * 2))));
            };
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                _loop_4(j);
            }
        }
        else if (option === "startOrPassEnlistmentMercenaries") {
            caption = "Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.";
            for (var j = 0; j < 2; j++) {
                if (j === 0) {
                    (0, UIHelper_1.DrawButton)(data, boardCells, "start Enlistment Mercenaries", "Start", data.props.G.publicPlayers[data.props.ctx.currentPlayer], "OnClickStartEnlistmentMercenaries");
                }
                else if (data.props.G.publicPlayersOrder.length > 1) {
                    (0, UIHelper_1.DrawButton)(data, boardCells, "pass Enlistment Mercenaries", "Pass", data.props.G.publicPlayers[data.props.ctx.currentPlayer], "OnClickPassEnlistmentMercenaries");
                }
            }
        }
        else if (option === "enlistmentMercenaries") {
            caption += "mercenary to place it to your player board.";
            var mercenaries = data.props.G.publicPlayers[data.props.ctx.currentPlayer].campCards.filter(function (card) {
                return card.type === "наёмник";
            });
            for (var j = 0; j < mercenaries.length; j++) {
                (0, UIHelper_1.DrawCard)(data, boardCells, mercenaries[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], null, "OnClickGetEnlistmentMercenaries", j);
            }
        }
        else if (option === "placeEnlistmentMercenaries") {
            caption += "suit to place ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.name, " to \n            that suit.");
            var _loop_5 = function (j) {
                var suit = Object.keys(SuitData_1.suitsConfig)[j];
                if (suit === (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit]
                    && data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].suit)) {
                    boardCells.push(react_1["default"].createElement("td", { className: "".concat(SuitData_1.suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToPlaceMercenary(j); }, key: "Place ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.name, " ").concat(j, " \n                            on ").concat(SuitData_1.suitsConfig[suit].suitName) },
                        react_1["default"].createElement("span", { style: StyleData_1.Styles.Suits(SuitData_1.suitsConfig[suit].suit), className: "bg-suit-icon" },
                            react_1["default"].createElement("b", null, data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].points
                                !== null ?
                                data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].points
                                : ""))));
                }
            };
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                _loop_5(j);
            }
        }
        else if (option === "AddCoinToPouchVidofnirVedrfolnir") {
            caption += "".concat(data.props.G.actionsNum, " coin").concat(data.props.G.actionsNum > 1 ? "s" : "", " to add to your pouch \n            to fill it.");
            for (var j = 0; j < data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins.length; j++) {
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].buffs.everyTurn === "Uline" &&
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[j] !== null) {
                    (0, UIHelper_1.DrawCoin)(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToAddToPouch", j);
                }
            }
        }
        else {
            caption += "coin to upgrade up to \n            ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.value, ".");
            if (option === "VidofnirVedrfolnirAction") {
                for (var j = data.props.G.tavernsNum; j < data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                    var type = "board", isInitial = false;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j] &&
                        !data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading &&
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.coinId !== j) {
                        isInitial = data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isInitial;
                        (0, UIHelper_1.DrawCoin)(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToUpgradeVidofnirVedrfolnir", j, type, isInitial);
                    }
                }
            }
            else if (option === "upgradeCoin") {
                var handCoins_1 = data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins.filter(function (coin) {
                    return coin !== null;
                });
                var handCoinIndex_1 = -1;
                for (var j = 0; j < data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                    var type = "board", isInitial = false;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].buffs.everyTurn === "Uline" &&
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j] === null) {
                        handCoinIndex_1++;
                        isInitial = handCoins_1[handCoinIndex_1].isInitial;
                        var handCoinId = data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins
                            .findIndex(function (coin) { return (coin && coin.value) === handCoins_1[handCoinIndex_1].value && (coin &&
                            coin.isInitial) === handCoins_1[handCoinIndex_1].isInitial; });
                        if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId] &&
                            !data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId].isTriggerTrading) {
                            type = "hand";
                            isInitial = handCoins_1[handCoinIndex_1].isInitial;
                            (0, UIHelper_1.DrawCoin)(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToUpgrade", j, type, isInitial);
                        }
                    }
                    else if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j] &&
                        !data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                        isInitial = data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isInitial;
                        (0, UIHelper_1.DrawCoin)(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToUpgrade", j, type, isInitial);
                    }
                }
            }
        }
    };
    for (var i = 0; i < 1; i++) {
        _loop_2(i);
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("caption", null,
            react_1["default"].createElement("span", { style: StyleData_1.Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }),
            " ",
            react_1["default"].createElement("span", null, caption)),
        react_1["default"].createElement("tbody", null,
            react_1["default"].createElement("tr", null, boardCells))));
};
exports.DrawProfit = DrawProfit;
/**
 * <h3>Отрисовка карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @constructor
 */
var DrawCamp = function (data) {
    var boardCells = [];
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null || data.props.G.camp[j] === undefined) {
                boardCells.push(react_1["default"].createElement("td", { className: "bg-yellow-200", key: "Camp ".concat(j, " icon") },
                    react_1["default"].createElement("span", { style: StyleData_1.Styles.Camp(), className: "bg-camp-icon" })));
            }
            else {
                (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.camp[j], j, null, null, "OnClickCampCard", j);
            }
        }
    }
    return (react_1["default"].createElement("table", null,
        react_1["default"].createElement("caption", null,
            react_1["default"].createElement("span", { style: StyleData_1.Styles.Camp(), className: "bg-top-camp-icon" }),
            react_1["default"].createElement("span", null,
                "Camp ",
                data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length
                    ? data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1,
                "(",
                data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
                    data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0,
                data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? "/"
                    + data.props.G.campDecks.reduce(function (count, current) { return count + current.length; }, 0) : "",
                " cards left)")),
        react_1["default"].createElement("tbody", null,
            react_1["default"].createElement("tr", null, boardCells))));
};
exports.DrawCamp = DrawCamp;
/**
 * <h3>Отрисовка карт таверн.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @param gridClass Класс для отрисовки таверны.
 * @constructor
 */
var DrawTaverns = function (data, gridClass) {
    var tavernsBoards = [];
    for (var t = 0; t < data.props.G.tavernsNum; t++) {
        for (var i = 0; i < 1; i++) {
            var boardCells = [];
            for (var j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(react_1["default"].createElement("td", { key: "".concat(Tavern_1.tavernsConfig[t].name, " ").concat(j) },
                        react_1["default"].createElement("span", { style: StyleData_1.Styles.Taverns(t), className: "bg-tavern-icon" })));
                }
                else {
                    if (t === data.props.G.currentTavern) {
                        (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.taverns[t][j], j, null, data.props.G.taverns[t][j].suit, "OnClickCard", j);
                    }
                    else {
                        (0, UIHelper_1.DrawCard)(data, boardCells, data.props.G.taverns[t][j], j, null, data.props.G.taverns[t][j].suit);
                    }
                }
            }
            tavernsBoards.push(react_1["default"].createElement("table", { className: "".concat(gridClass, " justify-self-center"), key: "Tavern ".concat(Tavern_1.tavernsConfig[t].name, " board") },
                react_1["default"].createElement("caption", { className: "whitespace-nowrap" },
                    react_1["default"].createElement("span", { style: StyleData_1.Styles.Taverns(t), className: "bg-top-tavern-icon" }),
                    " ",
                    react_1["default"].createElement("b", null, Tavern_1.tavernsConfig[t].name)),
                react_1["default"].createElement("tbody", null,
                    react_1["default"].createElement("tr", null, boardCells))));
        }
    }
    return tavernsBoards;
};
exports.DrawTaverns = DrawTaverns;
