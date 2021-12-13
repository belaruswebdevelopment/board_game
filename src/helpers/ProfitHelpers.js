import { __assign } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import { DrawButton, DrawCard, DrawCoin } from "./UIHelpers";
import { GameBoard } from "../GameBoard";
import { suitsConfig } from "../data/SuitData";
import { Styles } from "../data/StyleData";
import { isCardNotAction } from "../Card";
import { TotalRank } from "./ScoreHelpers";
export var PickCampCardHoldaProfit = function (G, ctx, data, boardCells) {
    for (var j = 0; j < G.campNum; j++) {
        var card = G.camp[j];
        if (card !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], null, "OnClickCampCardHolda", j);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export var PlaceCardsProfit = function (G, ctx, data, boardCells) {
    var _a, _b;
    var _loop_1 = function (j) {
        var suit = Object.keys(suitsConfig)[j], pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                if (config !== undefined) {
                    // todo Move logic to DrawCard?
                    boardCells.push(_jsx("td", __assign({ className: "".concat(suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToPlaceCard(j); } }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, { children: _jsx("b", { children: (_b = (_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants) === null || _a === void 0 ? void 0 : _a[suit].points) !== null && _b !== void 0 ? _b : "" }, void 0) }), void 0) }), "Place ".concat(config.drawName, " on ").concat(suitsConfig[suit].suitName)));
                }
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    };
    for (var j = 0; j < G.suitsNum; j++) {
        _loop_1(j);
    }
};
export var DiscardCardProfit = function (G, ctx, data, boardCells) {
    for (var j = 0; j < G.drawSize; j++) {
        var card = G.taverns[G.currentTavern][j];
        if (card !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                var suit = null;
                if (isCardNotAction(card)) {
                    suit = card.suit;
                }
                DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, "OnClickCardToDiscard2Players", j);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export var PickDiscardCardProfit = function (G, ctx, data, boardCells) {
    for (var j = 0; j < G.discardCardsDeck.length; j++) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            var card = G.discardCardsDeck[j];
            var suit = null;
            if (isCardNotAction(card)) {
                suit = card.suit;
            }
            DrawCard(data, boardCells, card, j, G.publicPlayers[Number(ctx.currentPlayer)], suit, "OnClickCardFromDiscard", j);
        }
        else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};
export var DiscardCardFromBoardProfit = function (G, ctx, data, boardCells) {
    var _a;
    var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config, pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (config !== undefined) {
        for (var j = 0; j < G.suitsNum; j++) {
            var suit = (_a = G.publicPlayers[Number(ctx.currentPlayer)].cards[j][0]) === null || _a === void 0 ? void 0 : _a.suit;
            if (suit !== undefined && suit !== null && suitsConfig[suit].suit !== config.suit
                && !(G.drawProfit === "DagdaAction" && G.actionsNum === 1 && pickedCard !== null
                    && "suit" in pickedCard && suitsConfig[suit].suit === pickedCard.suit)) {
                var last = G.publicPlayers[Number(ctx.currentPlayer)].cards[j].length - 1;
                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[j][last].type !== "герой") {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        DrawCard(data, boardCells, G.publicPlayers[Number(ctx.currentPlayer)].cards[j][last], last, G.publicPlayers[Number(ctx.currentPlayer)], G.publicPlayers[Number(ctx.currentPlayer)].cards[j][last].suit, "OnClickCardToDiscard", j, last);
                    }
                    else if (Array.isArray(data)) {
                        data.push([j]);
                    }
                }
            }
        }
    }
};
export var DiscardSuitCardFromPlayerBoardProfit = function (G, ctx, data, boardCells) {
};
export var UpgradeCoinVidofnirVedrfolnirProfit = function (G, ctx, data, boardCells) {
    var config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
    if (config !== undefined) {
        for (var j = G.tavernsNum; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
            var coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
            if (coin !== null) {
                if (!coin.isTriggerTrading && config.coinId !== j) {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        DrawCoin(data, boardCells, "coin", G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], "border-2", null, "OnClickCoinToUpgradeVidofnirVedrfolnir", j, "board", coin.isInitial);
                    }
                    else if (Array.isArray(data)) {
                        data.push([j, "board", coin.isInitial]);
                    }
                }
            }
        }
    }
};
export var AddCoinToPouchProfit = function (G, ctx, data, boardCells) {
    for (var j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
        if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === "Uline"
            && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawCoin(data, boardCells, "coin", G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j], j, G.publicPlayers[Number(ctx.currentPlayer)], "border-2", null, "OnClickCoinToAddToPouch", j);
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export var PlaceEnlistmentMercenariesProfit = function (G, ctx, data, boardCells) {
    var _a;
    var _loop_2 = function (j) {
        var card = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
        if (card !== null && "stack" in card) {
            var suit = Object.keys(suitsConfig)[j];
            if (card.stack[0].variants !== undefined) {
                if (suit === card.stack[0].variants[suit].suit) {
                    if (data instanceof GameBoard && boardCells !== undefined) {
                        // todo Move logic to DrawCard?
                        boardCells.push(_jsx("td", __assign({ className: "".concat(suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToPlaceMercenary(j); } }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, { children: _jsx("b", { children: (_a = card.stack[0].variants[suit].points) !== null && _a !== void 0 ? _a : "" }, void 0) }), void 0) }), "Place ".concat(card.name, " ").concat(j, " on ").concat(suitsConfig[suit].suitName)));
                    }
                    else if (Array.isArray(data)) {
                        data.push([j]);
                    }
                }
            }
        }
    };
    for (var j = 0; j < G.suitsNum; j++) {
        _loop_2(j);
    }
};
export var GetEnlistmentMercenariesProfit = function (G, ctx, data, boardCells) {
    var mercenaries = G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter(function (card) { return card.type === "наёмник"; });
    for (var j = 0; j < mercenaries.length; j++) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            DrawCard(data, boardCells, mercenaries[j], j, G.publicPlayers[Number(ctx.currentPlayer)], null, "OnClickGetEnlistmentMercenaries", j);
        }
        else if (Array.isArray(data)) {
            data.push([j]);
        }
    }
};
export var StartEnlistmentMercenariesProfit = function (G, ctx, data, boardCells) {
    for (var j = 0; j < 2; j++) {
        if (j === 0) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawButton(data, boardCells, "start Enlistment Mercenaries", "Start", G.publicPlayers[Number(ctx.currentPlayer)], "OnClickStartEnlistmentMercenaries");
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
        else if (G.publicPlayersOrder.length > 1) {
            if (data instanceof GameBoard && boardCells !== undefined) {
                DrawButton(data, boardCells, "pass Enlistment Mercenaries", "Pass", G.publicPlayers[Number(ctx.currentPlayer)], "OnClickPassEnlistmentMercenaries");
            }
            else if (Array.isArray(data)) {
                data.push([j]);
            }
        }
    }
};
export var GetMjollnirProfitProfit = function (G, ctx, data, boardCells) {
    var _loop_3 = function (j) {
        if (data instanceof GameBoard && boardCells !== undefined) {
            var suit = Object.keys(suitsConfig)[j];
            // todo Move logic to DrawCard?
            boardCells.push(_jsx("td", __assign({ className: "".concat(suitsConfig[suit].suitColor, " cursor-pointer"), onClick: function () { return data.OnClickSuitToGetMjollnirProfit(j); } }, { children: _jsx("span", __assign({ style: Styles.Suits(suitsConfig[suit].suit), className: "bg-suit-icon" }, { children: _jsx("b", __assign({ className: "whitespace-nowrap text-white" }, { children: G.publicPlayers[Number(ctx.currentPlayer)].cards[j].reduce(TotalRank, 0) * 2 }), void 0) }), void 0) }), "".concat(suit, " suit to get Mj\u00F6llnir profit")));
        }
        else if (Array.isArray(data)) {
            data.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[j].reduce(TotalRank, 0));
        }
    };
    for (var j = 0; j < G.suitsNum; j++) {
        _loop_3(j);
    }
};