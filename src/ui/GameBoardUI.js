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
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { CountMarketCoins } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { tavernsConfig } from "../Tavern";
import { Styles } from "../data/StyleData";
import { DrawBoard, DrawButton, DrawCard, DrawCoin, DrawPlayerBoardForCardDiscard, DrawPlayersBoardForSuitCardDiscard } from "../helpers/UIHelper";
import { TotalRank } from "../helpers/ScoreHelpers";
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
export var DrawTierCards = function (data) { return (_jsxs("b", { children: ["Tier: ", _jsxs("span", __assign({ className: "italic" }, { children: [data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length
                    ? data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1, "/", data.props.G.decks.length, "(", data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
                    data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0, data.props.G.decks.length - data.props.G.tierToEnd === 0 ? "/"
                    + data.props.G.decks.reduce(function (count, current) { return count + current.length; }, 0)
                    : "", " cards left)"] }), void 0)] }, void 0)); };
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
export var DrawCurrentPlayerTurn = function (data) { return (_jsxs("b", { children: ["Current player: ", _jsxs("span", __assign({ className: "italic" }, { children: ["Player ", Number(data.props.ctx.currentPlayer) + 1] }), void 0), " | Turn: ", _jsx("span", __assign({ className: "italic" }, { children: data.props.ctx.turn }), void 0)] }, void 0)); };
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
export var DrawWinner = function (data) {
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
    return (_jsxs("b", { children: ["Game status: ", _jsx("span", __assign({ className: "italic" }, { children: winner.trim() }), void 0)] }, void 0));
};
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
export var DrawMarketCoins = function (data) {
    var boardRows = [], drawData = DrawBoard(data.props.G.marketCoinsUnique.length), countMarketCoins = CountMarketCoins(data.props.G);
    for (var i = 0; i < drawData.boardRows; i++) {
        var boardCells = [];
        boardRows[i] = [];
        for (var j = 0; j < drawData.boardCols; j++) {
            var increment = i * drawData.boardCols + j, tempCoinValue = data.props.G.marketCoinsUnique[increment].value, coinClassName = countMarketCoins[tempCoinValue] === 0 ? "text-red-500" : "text-blue-500";
            DrawCoin(data, boardCells, "market", data.props.G.marketCoinsUnique[increment], increment, null, coinClassName, countMarketCoins[tempCoinValue], "OnClickHandCoin", j);
            if (increment + 1 === data.props.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(_jsx("tr", { children: boardCells }, "Market coins row ".concat(i)));
    }
    return (_jsxs("table", { children: [_jsx("caption", { children: _jsxs("span", __assign({ className: "block" }, { children: [_jsx("span", { style: Styles.Exchange(), className: "bg-top-market-coin-icon" }, void 0), " Market coins (", data.props.G.marketCoins.length, " left)"] }), void 0) }, void 0), _jsx("tbody", { children: boardRows }, void 0)] }, void 0));
};
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
export var DrawHeroes = function (data) {
    var boardRows = [], drawData = DrawBoard(data.props.G.heroes.length);
    for (var i = 0; i < drawData.boardRows; i++) {
        var boardCells = [];
        boardRows[i] = [];
        for (var j = 0; j < drawData.boardCols; j++) {
            var increment = i * drawData.boardCols + j;
            DrawCard(data, boardCells, data.props.G.heroes[increment], increment, null, null, "OnClickHeroCard", increment);
            if (increment + 1 === data.props.G.heroes.length) {
                break;
            }
        }
        boardRows[i].push(_jsx("tr", { children: boardCells }, "Heroes row ".concat(i)));
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.HeroBack(), className: "bg-top-hero-icon" }, void 0), " ", _jsxs("span", { children: ["Heroes (", data.props.G.heroes.length, " left)"] }, void 0)] }, void 0), _jsx("tbody", { children: boardRows }, void 0)] }, void 0));
};
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
export var DrawDistinctions = function (data) {
    var boardCells = [];
    for (var i = 0; i < 1; i++) {
        var _loop_1 = function (j) {
            var suit = Object.keys(suitsConfig)[j];
            boardCells.push(_jsx("td", __assign({ className: "bg-green-500 cursor-pointer", onClick: function () { return data.OnClickDistinctionCard(j); }, title: suitsConfig[suit].distinction.description }, { children: _jsx("span", { style: Styles.Distinctions(suit), className: "bg-suit-distinction" }, void 0) }), "Distinction ".concat(suit, " card")));
        };
        for (var j = 0; j < data.props.G.suitsNum; j++) {
            _loop_1(j);
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }, void 0), " ", _jsx("span", { children: "Distinctions" }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
};
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
export var DrawProfit = function (data, option) {
    var boardCells = [];
    var caption = "Get ";
    var _loop_2 = function (i) {
        if (option === "placeCards") {
            caption += "suit to place ".concat(data.props.G.actionsNum ? data.props.G.actionsNum : 1, " \n            ").concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.drawName).concat(data.props.G.actionsNum
                > 1 ? "s" : "", " to ").concat(data.props.G.actionsNum > 1 ? "different" : "that", " suit.");
            var _loop_3 = function (j) {
                var suit = Object.keys(suitsConfig)[j];
                if (suit !== (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard &&
                    data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.suit)) {
                    boardCells.push(_jsx("td", __assign({ className: "".concat(suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToPlaceCard(j); } }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, { children: _jsx("b", { children: data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].variants[suit].points
                                    !== null ? data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].variants[suit].points
                                    : "" }, void 0) }), void 0) }), "Place ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.drawName, " \n                            on ").concat(suitsConfig[suit].suitName)));
                }
            };
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                _loop_3(j);
            }
        }
        else if (option === "explorerDistinction") {
            caption += "one card to your board.";
            for (var j = 0; j < 3; j++) {
                DrawCard(data, boardCells, data.props.G.decks[1][j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.decks[1][j].suit, "OnClickCardToPickDistinction", j);
            }
        }
        else if (option === "BonfurAction" || option === "DagdaAction") {
            caption += "".concat(data.props.G.actionsNum, " card").concat(data.props.G.actionsNum > 1 ? "s" : "", " to discard from your \n            board.");
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0] !== undefined &&
                    suitsConfig[data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0].suit].suit !==
                        data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit &&
                    !(option === "DagdaAction" && data.props.G.actionsNum === 1 &&
                        suitsConfig[data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][0].suit].suit ===
                            (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard &&
                                data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.suit))) {
                    var last = data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j].length - 1;
                    if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last].type !== "герой") {
                        DrawCard(data, boardCells, data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last], last, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j][last].suit, "OnClickCardToDiscard", j, last);
                    }
                }
            }
        }
        else if (option === "AndumiaAction" || option === "BrisingamensAction") {
            caption += "".concat(data.props.G.actionsNum, " card").concat(data.props.G.actionsNum > 1 ? "s" : "", " from discard pile to \n            your board.");
            for (var j = 0; j < data.props.G.discardCardsDeck.length; j++) {
                DrawCard(data, boardCells, data.props.G.discardCardsDeck[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.discardCardsDeck[j].suit, "OnClickCardFromDiscard", j);
            }
        }
        else if (option === "BrisingamensEndGameAction") {
            caption += "one card to discard from your board.";
            boardCells.push(_jsx("td", { children: DrawPlayerBoardForCardDiscard(data) }, "".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].nickname, " discard card")));
        }
        else if (option === "HofudAction") {
            caption += "one warrior card to discard from your board.";
            boardCells.push(_jsx("td", { children: DrawPlayersBoardForSuitCardDiscard(data, data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit) }, "Discard ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].stack[0].config.suit, " suit \n                cardboard")));
        }
        else if (option === "HoldaAction") {
            caption += "one card from camp to your board.";
            for (var j = 0; j < data.props.G.campNum; j++) {
                if (data.props.G.camp[j]) {
                    DrawCard(data, boardCells, data.props.G.camp[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], null, "OnClickCampCardHolda", j);
                }
            }
        }
        else if (option === "discardCard") {
            caption += "one card to discard from current tavern.";
            for (var j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[data.props.G.currentTavern][j]) {
                    DrawCard(data, boardCells, data.props.G.taverns[data.props.G.currentTavern][j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], data.props.G.taverns[data.props.G.currentTavern][j].suit, "OnClickCardToDiscard2Players", j);
                }
            }
        }
        else if (option === "getMjollnirProfit") {
            caption += "suit to get Mjöllnir profit from ranks on that suit.";
            var _loop_4 = function (j) {
                var suit = Object.keys(suitsConfig)[j];
                boardCells.push(_jsx("td", __assign({ className: "".concat(suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToGetMjollnirProfit(j); } }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, { children: _jsx("b", __assign({ className: "whitespace-nowrap text-white" }, { children: data.props.G.publicPlayers[data.props.ctx.currentPlayer].cards[j].reduce(TotalRank, 0)
                                * 2 }), void 0) }), void 0) }), "".concat(suit, " suit to get Mj\u00F6llnir profit")));
            };
            for (var j = 0; j < data.props.G.suitsNum; j++) {
                _loop_4(j);
            }
        }
        else if (option === "startOrPassEnlistmentMercenaries") {
            caption = "Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.";
            for (var j = 0; j < 2; j++) {
                if (j === 0) {
                    DrawButton(data, boardCells, "start Enlistment Mercenaries", "Start", data.props.G.publicPlayers[data.props.ctx.currentPlayer], "OnClickStartEnlistmentMercenaries");
                }
                else if (data.props.G.publicPlayersOrder.length > 1) {
                    DrawButton(data, boardCells, "pass Enlistment Mercenaries", "Pass", data.props.G.publicPlayers[data.props.ctx.currentPlayer], "OnClickPassEnlistmentMercenaries");
                }
            }
        }
        else if (option === "enlistmentMercenaries") {
            caption += "mercenary to place it to your player board.";
            var mercenaries = data.props.G.publicPlayers[data.props.ctx.currentPlayer].campCards.filter(function (card) {
                return card.type === "наёмник";
            });
            for (var j = 0; j < mercenaries.length; j++) {
                DrawCard(data, boardCells, mercenaries[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], null, "OnClickGetEnlistmentMercenaries", j);
            }
        }
        else if (option === "placeEnlistmentMercenaries") {
            caption += "suit to place ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.name, " to \n            that suit.");
            var _loop_5 = function (j) {
                var suit = Object.keys(suitsConfig)[j];
                if (suit === (data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit]
                    && data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].suit)) {
                    boardCells.push(_jsx("td", __assign({ className: "".concat(suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToPlaceMercenary(j); } }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, { children: _jsx("b", { children: data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].points
                                    !== null ?
                                    data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.stack[0].variants[suit].points
                                    : "" }, void 0) }), void 0) }), "Place ".concat(data.props.G.publicPlayers[data.props.ctx.currentPlayer].pickedCard.name, " ").concat(j, " \n                            on ").concat(suitsConfig[suit].suitName)));
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
                    DrawCoin(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToAddToPouch", j);
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
                        DrawCoin(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToUpgradeVidofnirVedrfolnir", j, type, isInitial);
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
                            DrawCoin(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].handCoins[handCoinId], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToUpgrade", j, type, isInitial);
                        }
                    }
                    else if (data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j] &&
                        !data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                        isInitial = data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j].isInitial;
                        DrawCoin(data, boardCells, "coin", data.props.G.publicPlayers[data.props.ctx.currentPlayer].boardCoins[j], j, data.props.G.publicPlayers[data.props.ctx.currentPlayer], "border-2", null, "OnClickCoinToUpgrade", j, type, isInitial);
                    }
                }
            }
        }
    };
    for (var i = 0; i < 1; i++) {
        _loop_2(i);
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.DistinctionsBack(), className: "bg-top-distinctions-icon" }, void 0), " ", _jsx("span", { children: caption }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
};
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
export var DrawCamp = function (data) {
    var boardCells = [];
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null || data.props.G.camp[j] === undefined) {
                boardCells.push(_jsx("td", __assign({ className: "bg-yellow-200" }, { children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }), "Camp ".concat(j, " icon")));
            }
            else {
                DrawCard(data, boardCells, data.props.G.camp[j], j, null, null, "OnClickCampCard", j);
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }, void 0), _jsxs("span", { children: ["Camp ", data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length
                                ? data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1, "(", data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
                                data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0, data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? "/"
                                + data.props.G.campDecks.reduce(function (count, current) { return count +
                                    current.length; }, 0) : "", " cards left)"] }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
};
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
export var DrawTaverns = function (data, gridClass) {
    var tavernsBoards = [];
    for (var t = 0; t < data.props.G.tavernsNum; t++) {
        for (var i = 0; i < 1; i++) {
            var boardCells = [];
            for (var j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Taverns(t), className: "bg-tavern-icon" }, void 0) }, "".concat(tavernsConfig[t].name, " ").concat(j)));
                }
                else {
                    if (t === data.props.G.currentTavern) {
                        DrawCard(data, boardCells, data.props.G.taverns[t][j], j, null, data.props.G.taverns[t][j].suit, "OnClickCard", j);
                    }
                    else {
                        DrawCard(data, boardCells, data.props.G.taverns[t][j], j, null, data.props.G.taverns[t][j].suit);
                    }
                }
            }
            tavernsBoards.push(_jsxs("table", __assign({ className: "".concat(gridClass, " justify-self-center") }, { children: [_jsxs("caption", __assign({ className: "whitespace-nowrap" }, { children: [_jsx("span", { style: Styles.Taverns(t), className: "bg-top-tavern-icon" }, void 0), " ", _jsx("b", { children: tavernsConfig[t].name }, void 0)] }), void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }), "Tavern ".concat(tavernsConfig[t].name, " board")));
        }
    }
    return tavernsBoards;
};
