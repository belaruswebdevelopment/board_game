var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React from "react";
import { DrawCamp, DrawCurrentPlayerTurn, DrawDistinctions, DrawHeroes, DrawMarketCoins, DrawProfit, DrawTaverns, DrawTierCards, DrawWinner, } from "./ui/GameBoardUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins, } from "./ui/PlayerUI";
import { DrawDebugData } from "./ui/DebugUI";
import { DrawLogData } from "./ui/LogUI";
/**
 * <h3>Отрисовка игрового стола.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отрисовке игрового поля для игроков.</li>
 * </ol>
 */
var GameBoard = /** @class */ (function (_super) {
    __extends(GameBoard, _super);
    function GameBoard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.OnClickDistinctionCard = function (cardId) {
            _this.props.moves.ClickDistinctionCard(cardId);
        };
        _this.OnClickSuitToPlaceCard = function (suitId) {
            _this.props.moves.PlaceCard(suitId);
        };
        _this.OnClickSuitToPlaceMercenary = function (suitId) {
            _this.props.moves.PlaceEnlistmentMercenaries(suitId);
        };
        _this.OnClickSuitToGetMjollnirProfit = function (suitId) {
            _this.props.moves.GetMjollnirProfit(suitId);
        };
        return _this;
    }
    GameBoard.prototype.render = function () {
        var gridClass = "col-span-4", classes = "col-span-4 text-center underline border", tierCardsUI = DrawTierCards(this), currentPlayerTurnUI = DrawCurrentPlayerTurn(this), winnerUI = DrawWinner(this), marketCoinsUI = DrawMarketCoins(this), drawHeroesUI = DrawHeroes(this), drawCampUI = this.props.G.expansions.thingvellir.active ? DrawCamp(this) : null, drawDistinctionsUI = DrawDistinctions(this), drawDistinctionProfitUI = this.props.G.drawProfit ?
            DrawProfit(this, this.props.G.drawProfit) : this.props.G.drawProfit, tavernsUI = DrawTaverns(this, gridClass), playersBoardsCoinsUI = DrawPlayersBoardsCoins(this), playersHandsCoinsUI = DrawPlayersHandsCoins(this), playersBoardsUI = DrawPlayersBoards(this), logUI = DrawLogData(this), debugUI = DrawDebugData(this);
        return (_jsxs("div", __assign({ className: "flex" }, { children: [_jsxs("div", __assign({ className: "grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1" }, { children: [_jsx("div", __assign({ className: classes }, { children: tierCardsUI }), void 0), _jsx("div", __assign({ className: classes }, { children: currentPlayerTurnUI }), void 0), _jsx("div", __assign({ className: classes }, { children: winnerUI }), void 0), _jsx("div", __assign({ className: "".concat(gridClass, " justify-self-center") }, { children: marketCoinsUI }), void 0), _jsx("div", __assign({ className: "".concat(gridClass, " justify-self-center") }, { children: drawHeroesUI }), void 0), _jsxs("div", __assign({ className: "".concat(gridClass, " justify-self-center h-full flex flex-col justify-evenly") }, { children: [drawDistinctionsUI, drawDistinctionProfitUI, drawCampUI] }), void 0), tavernsUI, _jsxs("div", __assign({ className: "col-span-full flex flex-col gap-1" }, { children: [_jsx("div", __assign({ className: "flex flex-col lg:flex-row gap-1" }, { children: playersBoardsCoinsUI }), void 0), _jsx("div", __assign({ className: "flex flex-col lg:flex-row gap-1" }, { children: playersHandsCoinsUI }), void 0), _jsx("div", __assign({ className: "flex items-start flex-col lg:flex-row gap-1" }, { children: playersBoardsUI }), void 0)] }), void 0)] }), void 0), logUI, debugUI] }), void 0));
    };
    return GameBoard;
}(React.Component));
export { GameBoard };
