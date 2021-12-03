"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBoard = void 0;
var react_1 = require("react");
var GameBoardUI_1 = require("./ui/GameBoardUI");
var PlayerUI_1 = require("./ui/PlayerUI");
var DebugUI_1 = require("./ui/DebugUI");
var LogUI_1 = require("./ui/LogUI");
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
        var gridClass = "col-span-4", classes = "col-span-4 text-center underline border", tierCardsUI = (0, GameBoardUI_1.DrawTierCards)(this), currentPlayerTurnUI = (0, GameBoardUI_1.DrawCurrentPlayerTurn)(this), winnerUI = (0, GameBoardUI_1.DrawWinner)(this), marketCoinsUI = (0, GameBoardUI_1.DrawMarketCoins)(this), drawHeroesUI = (0, GameBoardUI_1.DrawHeroes)(this), drawCampUI = this.props.G.expansions.thingvellir.active ? (0, GameBoardUI_1.DrawCamp)(this) : null, drawDistinctionsUI = (0, GameBoardUI_1.DrawDistinctions)(this), drawDistinctionProfitUI = this.props.G.drawProfit ? (0, GameBoardUI_1.DrawProfit)(this, this.props.G.drawProfit)
            : this.props.G.drawProfit, tavernsUI = (0, GameBoardUI_1.DrawTaverns)(this, gridClass), playersBoardsCoinsUI = (0, PlayerUI_1.DrawPlayersBoardsCoins)(this), playersHandsCoinsUI = (0, PlayerUI_1.DrawPlayersHandsCoins)(this), playersBoardsUI = (0, PlayerUI_1.DrawPlayersBoards)(this), logUI = (0, LogUI_1.DrawLogData)(this), debugUI = (0, DebugUI_1.DrawDebugData)(this);
        return (<div className="flex">
                <div className="grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1">
                    <div className={classes}>
                        {tierCardsUI}
                    </div>
                    <div className={classes}>
                        {currentPlayerTurnUI}
                    </div>
                    <div className={classes}>
                        {winnerUI}
                    </div>
                    <div className={gridClass + " justify-self-center"}>
                        {marketCoinsUI}
                    </div>
                    <div className={gridClass + " justify-self-center"}>
                        {drawHeroesUI}
                    </div>
                    <div className={gridClass + " justify-self-center h-full flex flex-col justify-evenly"}>
                        {drawDistinctionsUI}
                        {drawDistinctionProfitUI}
                        {drawCampUI}
                    </div>
                    {tavernsUI}
                    <div className="col-span-full flex flex-col gap-1">
                        <div className="flex flex-col lg:flex-row gap-1">{playersBoardsCoinsUI}</div>
                        <div className="flex flex-col lg:flex-row gap-1">{playersHandsCoinsUI}</div>
                        <div className="flex items-start flex-col lg:flex-row gap-1">{playersBoardsUI}</div>
                    </div>
                </div>
                {logUI}
                {debugUI}
            </div>);
    };
    return GameBoard;
}(react_1.default.Component));
exports.GameBoard = GameBoard;
