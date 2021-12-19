import { __assign } from "tslib";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { CountMarketCoins } from "../Coin";
import { suitsConfig } from "../data/SuitData";
import { tavernsConfig } from "../Tavern";
import { Styles } from "../data/StyleData";
import { DrawBoard, DrawCard, DrawCoin, DrawPlayerBoardForCardDiscard, DrawPlayersBoardForSuitCardDiscard } from "../helpers/UIHelpers";
import { isCardNotAction } from "../Card";
import { AddCoinToPouchProfit, DiscardCardFromBoardProfit, DiscardCardProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "../helpers/ProfitHelpers";
/**
 * <h3>Отрисовка игровой информации о текущей эпохе и количестве карт в деках.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о количестве карт по эпохам.
 */
export var DrawTierCards = function (data) { return (_jsxs("b", { children: ["Tier: ", _jsxs("span", __assign({ className: "italic" }, { children: [data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length ?
                    data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1, "/", data.props.G.decks.length, " (", data.props.G.decks.length - data.props.G.tierToEnd !== 2 ?
                    data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0, data.props.G.decks.length - data.props.G.tierToEnd === 0 ? "/"
                    + data.props.G.decks.reduce(function (count, current) {
                        return count + current.length;
                    }, 0) : "", " cards left)"] }), void 0)] }, void 0)); };
/**
 * <h3>Отрисовка игровой информации о текущем игроке и текущем ходе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле информации о текущем ходу.
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
 * @returns Поле информации о ходе/победителях игры.
 */
export var DrawWinner = function (data) {
    var winner;
    if (data.props.ctx.gameover !== undefined) {
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
 * @returns Поле рынка монет.
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
 * @returns Поле героев.
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
 * <h3>Отрисовка преимуществ по фракциям в конце эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Отрисовка игрового поля.</li>
 * </ol>
 *
 * @param data Глобальные параметры.
 * @returns Поле преимуществ в конце эпохи.
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
 * @returns Поле профита.
 */
export var DrawProfit = function (data, option) {
    var _a, _b, _c, _d, _e;
    var boardCells = [], config = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].stack[0].config;
    var caption = "Get ";
    var _loop_2 = function (i) {
        if (option === "placeCards") {
            if (config !== undefined) {
                caption += "suit to place ".concat((_a = data.props.G.actionsNum) !== null && _a !== void 0 ? _a : 1, " ").concat(config.drawName, " ").concat(data.props.G.actionsNum > 1 ? "s" : "", " to ").concat(data.props.G.actionsNum > 1 ? "different" : "that", " suit.");
                PlaceCardsProfit(data.props.G, data.props.ctx, data, boardCells);
            }
        }
        else if (option === "explorerDistinction") {
            caption += "one card to your board.";
            // todo Move to ProfitHelpers and add logic for bot or just use standard pick cards / upgrade coins
            for (var j = 0; j < 3; j++) {
                var card = data.props.G.decks[1][j];
                var suit = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, data.props.G.decks[1][j], j, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], suit, "OnClickCardToPickDistinction", j);
            }
        }
        else if (option === "BonfurAction" || option === "DagdaAction") {
            caption += "".concat(data.props.G.actionsNum, " card").concat(data.props.G.actionsNum > 1 ? "s" : "", " to discard from your board.");
            DiscardCardFromBoardProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "AndumiaAction" || option === "BrisingamensAction") {
            caption += "".concat(data.props.G.actionsNum, " card").concat(data.props.G.actionsNum > 1 ? "s" : "", " from discard pile to your board.");
            PickDiscardCardProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "BrisingamensEndGameAction") {
            caption += "one card to discard from your board.";
            boardCells.push(_jsx("td", { children: DrawPlayerBoardForCardDiscard(data) }, "".concat(data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].nickname, " discard card")));
        }
        else if (option === "HofudAction") {
            caption += "one warrior card to discard from your board.";
            if (config !== undefined && config.suit !== undefined) {
                boardCells.push(_jsx("td", { children: DrawPlayersBoardForSuitCardDiscard(data, config.suit) }, "Discard ".concat(config.suit, " suit cardboard")));
            }
        }
        else if (option === "HoldaAction") {
            caption += "one card from camp to your board.";
            PickCampCardHoldaProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "discardCard") {
            caption += "one card to discard from current tavern.";
            DiscardCardProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "getMjollnirProfit") {
            caption += "suit to get Mj\u00F6llnir profit from ranks on that suit.";
            GetMjollnirProfitProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "startOrPassEnlistmentMercenaries") {
            caption = "Press Start to begin 'Enlistment Mercenaries' or Pass to do it after all players.";
            StartEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "enlistmentMercenaries") {
            caption += "mercenary to place it to your player board.";
            GetEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else if (option === "placeEnlistmentMercenaries") {
            var card = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].pickedCard;
            if (card !== null) {
                caption += "suit to place ".concat(card.name, " to that suit.");
                PlaceEnlistmentMercenariesProfit(data.props.G, data.props.ctx, data, boardCells);
            }
        }
        else if (option === "AddCoinToPouchVidofnirVedrfolnir") {
            caption += "".concat(data.props.G.actionsNum, " coin").concat(data.props.G.actionsNum > 1 ? "s" : "", " to add to your pouch to fill it.");
            AddCoinToPouchProfit(data.props.G, data.props.ctx, data, boardCells);
        }
        else {
            if (config !== undefined) {
                caption += "coin to upgrade up to ".concat(config.value, ".");
                if (option === "VidofnirVedrfolnirAction") {
                    UpgradeCoinVidofnirVedrfolnirProfit(data.props.G, data.props.ctx, data, boardCells);
                }
                else if (option === "upgradeCoin") {
                    // todo Move to ProfitHelpers and add logic for bot or just use standard upgrade coins
                    var handCoins_1 = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].handCoins
                        .filter(function (coin) { return coin !== null; });
                    var handCoinIndex_1 = -1;
                    for (var j = 0; j <
                        data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins.length; j++) {
                        // todo Check .? for all coins!!! and delete AS
                        if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].buffs.everyTurn ===
                            "Uline" && data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]
                            === null) {
                            handCoinIndex_1++;
                            var handCoinId = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .handCoins.findIndex(function (coin) {
                                var _a, _b;
                                return (coin === null || coin === void 0 ? void 0 : coin.value) === ((_a = handCoins_1[handCoinIndex_1]) === null || _a === void 0 ? void 0 : _a.value)
                                    && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === ((_b = handCoins_1[handCoinIndex_1]) === null || _b === void 0 ? void 0 : _b.isInitial);
                            });
                            if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .handCoins[handCoinId]
                                && !((_b = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .handCoins[handCoinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
                                DrawCoin(data, boardCells, "coin", data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                    .handCoins[handCoinId], j, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], "border-2", null, "OnClickCoinToUpgrade", j, "hand", (_c = handCoins_1[handCoinIndex_1]) === null || _c === void 0 ? void 0 : _c.isInitial);
                            }
                        }
                        else if (data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]
                            && !((_d = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)].boardCoins[j]) === null || _d === void 0 ? void 0 : _d.isTriggerTrading)) {
                            DrawCoin(data, boardCells, "coin", data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .boardCoins[j], j, data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)], "border-2", null, "OnClickCoinToUpgrade", j, "board", (_e = data.props.G.publicPlayers[Number(data.props.ctx.currentPlayer)]
                                .boardCoins[j]) === null || _e === void 0 ? void 0 : _e.isInitial);
                        }
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
 * @returns Поле кэмпа.
 */
export var DrawCamp = function (data) {
    var boardCells = [];
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < data.props.G.campNum; j++) {
            var campCard = data.props.G.camp[j];
            if (campCard === null || data.props.G.camp[j] === undefined) {
                boardCells.push(_jsx("td", __assign({ className: "bg-yellow-200" }, { children: _jsx("span", { style: Styles.Camp(), className: "bg-camp-icon" }, void 0) }), "Camp ".concat(j, " icon")));
            }
            else {
                DrawCard(data, boardCells, campCard, j, null, null, "OnClickCampCard", j);
            }
        }
    }
    return (_jsxs("table", { children: [_jsxs("caption", { children: [_jsx("span", { style: Styles.Camp(), className: "bg-top-camp-icon" }, void 0), _jsxs("span", { children: ["Camp ", data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length ?
                                data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1, "(", data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
                                data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0, data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? "/"
                                + data.props.G.campDecks
                                    .reduce(function (count, current) {
                                    return count + current.length;
                                }, 0) : "", " cards left)"] }, void 0)] }, void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }, void 0));
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
 * @returns Поле таверн.
 */
export var DrawTaverns = function (data, gridClass) {
    var tavernsBoards = [];
    for (var t = 0; t < data.props.G.tavernsNum; t++) {
        for (var i = 0; i < 1; i++) {
            var boardCells = [];
            for (var j = 0; j < data.props.G.drawSize; j++) {
                var tavernCard = data.props.G.taverns[t][j];
                if (tavernCard === null) {
                    boardCells.push(_jsx("td", { children: _jsx("span", { style: Styles.Taverns(t), className: "bg-tavern-icon" }, void 0) }, "".concat(tavernsConfig[t].name, " ").concat(j)));
                }
                else {
                    var tavernCardSuit = null;
                    if (isCardNotAction(tavernCard)) {
                        tavernCardSuit = tavernCard.suit;
                    }
                    if (t === data.props.G.currentTavern) {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit, "OnClickCard", j);
                    }
                    else {
                        DrawCard(data, boardCells, tavernCard, j, null, tavernCardSuit);
                    }
                }
            }
            tavernsBoards.push(_jsxs("table", __assign({ className: "".concat(gridClass, " justify-self-center") }, { children: [_jsxs("caption", __assign({ className: "whitespace-nowrap" }, { children: [_jsx("span", { style: Styles.Taverns(t), className: "bg-top-tavern-icon" }, void 0), " ", _jsx("b", { children: tavernsConfig[t].name }, void 0)] }), void 0), _jsx("tbody", { children: _jsx("tr", { children: boardCells }, void 0) }, void 0)] }), "Tavern ".concat(tavernsConfig[t].name, " board")));
        }
    }
    return tavernsBoards;
};
