import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { DrawDebugData } from "./ui/DebugUI";
import { DrawCamp, DrawCurrentPhaseStage, DrawCurrentPlayerTurn, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawMarketCoins, DrawProfit, DrawTaverns, DrawTierCards, DrawWinner } from "./ui/GameBoardUI";
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
        const gridClass = `col-span-4 justify-self-center`, classes = `col-span-3 text-center underline border`, tierCardsUI = DrawTierCards(this.props.G), currentPlayerTurnUI = DrawCurrentPlayerTurn(this.props.ctx), currentPhaseStageUI = DrawCurrentPhaseStage(this.props.ctx), winnerUI = DrawWinner(this.props.G, this.props.ctx), drawDiscardCards = DrawDiscardedCards(this.props.G, this.props.ctx, null, this.props), marketCoinsUI = DrawMarketCoins(this.props.G, this.props), drawHeroesUI = DrawHeroes(this.props.G, this.props.ctx, null, this.props), drawCampUI = this.props.G.expansions.thingvellir.active ?
            DrawCamp(this.props.G, this.props.ctx, null, this.props) : null, drawDistinctionsUI = DrawDistinctions(this.props.G, this.props.ctx, null, this.props), drawDistinctionProfitUI = this.props.G.drawProfit ?
            DrawProfit(this.props.G, this.props.ctx, this.props) : this.props.G.drawProfit, tavernsUI = DrawTaverns(this.props.G, this.props.ctx, null, this.props, gridClass), playersBoardsCoinsUI = DrawPlayersBoardsCoins(this.props.G, this.props.ctx, null, this.props), playersHandsCoinsUI = DrawPlayersHandsCoins(this.props.G, this.props.ctx, null, this.props), playersBoardsUI = DrawPlayersBoards(this.props.G, this.props.ctx, null, null, this.props), logUI = DrawLogData(this.props.G), debugUI = DrawDebugData(this.props.G, this.props.ctx);
        return (_jsxs("div", { className: "flex", children: [_jsxs("div", { className: "grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1", children: [_jsx("div", { className: classes, children: tierCardsUI }), _jsx("div", { className: classes, children: currentPhaseStageUI }), _jsx("div", { className: classes, children: currentPlayerTurnUI }), _jsx("div", { className: classes, children: winnerUI }), _jsx("div", { className: "col-span-12 justify-self-center", children: drawDiscardCards }), _jsx("div", { className: `${gridClass}`, children: marketCoinsUI }), _jsx("div", { className: `${gridClass}`, children: drawHeroesUI }), _jsxs("div", { className: `${gridClass} h-full flex flex-col justify-evenly`, children: [drawDistinctionsUI, drawCampUI, drawDistinctionProfitUI] }), tavernsUI, _jsxs("div", { className: "col-span-full flex flex-col gap-1", children: [_jsx("div", { className: "flex flex-col lg:flex-row gap-1", children: playersBoardsCoinsUI }), _jsx("div", { className: "flex flex-col lg:flex-row gap-1", children: playersHandsCoinsUI }), _jsx("div", { className: "flex items-start flex-col lg:flex-row gap-1", children: playersBoardsUI })] })] }), logUI, debugUI] }));
    }
}
//# sourceMappingURL=GameBoard.js.map