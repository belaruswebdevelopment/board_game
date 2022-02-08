import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { DrawDebugData } from "./ui/DebugUI";
import { DrawCamp, DrawCurrentPlayerTurn, DrawDistinctions, DrawHeroes, DrawMarketCoins, DrawProfit, DrawTaverns, DrawTierCards, DrawWinner } from "./ui/GameBoardUI";
import { DrawLogData } from "./ui/LogUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";
/**
 * <h3>Отображение игрового стола.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отображении игрового поля для игроков.</li>
 * </ol>
 */
export class GameBoard extends React.Component {
    render() {
        const gridClass = `col-span-4`, classes = `col-span-4 text-center underline border`, tierCardsUI = DrawTierCards(this.props), currentPlayerTurnUI = DrawCurrentPlayerTurn(this.props), winnerUI = DrawWinner(this.props), marketCoinsUI = DrawMarketCoins(this.props), drawHeroesUI = DrawHeroes(this.props), drawCampUI = this.props.G.expansions.thingvellir.active ? DrawCamp(this.props) :
            null, drawDistinctionsUI = DrawDistinctions(this.props), drawDistinctionProfitUI = this.props.G.drawProfit ? DrawProfit(this.props) :
            this.props.G.drawProfit, tavernsUI = DrawTaverns(this.props, gridClass), playersBoardsCoinsUI = DrawPlayersBoardsCoins(this.props), playersHandsCoinsUI = DrawPlayersHandsCoins(this.props), playersBoardsUI = DrawPlayersBoards(this.props), logUI = DrawLogData(this.props), debugUI = DrawDebugData(this.props);
        return (_jsxs("div", { className: "flex", children: [_jsxs("div", { className: "grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1", children: [_jsx("div", { className: classes, children: tierCardsUI }, void 0), _jsx("div", { className: classes, children: currentPlayerTurnUI }, void 0), _jsx("div", { className: classes, children: winnerUI }, void 0), _jsx("div", { className: `${gridClass} justify-self-center`, children: marketCoinsUI }, void 0), _jsx("div", { className: `${gridClass} justify-self-center`, children: drawHeroesUI }, void 0), _jsxs("div", { className: `${gridClass} justify-self-center h-full flex flex-col justify-evenly`, children: [drawDistinctionsUI, drawDistinctionProfitUI, drawCampUI] }, void 0), tavernsUI, _jsxs("div", { className: "col-span-full flex flex-col gap-1", children: [_jsx("div", { className: "flex flex-col lg:flex-row gap-1", children: playersBoardsCoinsUI }, void 0), _jsx("div", { className: "flex flex-col lg:flex-row gap-1", children: playersHandsCoinsUI }, void 0), _jsx("div", { className: "flex items-start flex-col lg:flex-row gap-1", children: playersBoardsUI }, void 0)] }, void 0)] }, void 0), logUI, debugUI] }, void 0));
    }
}
//# sourceMappingURL=GameBoard.js.map