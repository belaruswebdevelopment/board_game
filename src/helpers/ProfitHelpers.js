import { __assign } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import { DrawCard } from "./UIHelpers";
import { GameBoard } from "../GameBoard";
import { suitsConfig } from "../data/SuitData";
import { Styles } from "../data/StyleData";
import { isCardNotAction } from "../Card";
export var HoldaActionProfit = function (G, ctx, data, boardCells) {
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
