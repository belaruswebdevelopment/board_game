import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { GameModeNames } from "./typescript/enums";
import { DrawDebugData } from "./ui/DebugUI";
import { DrawCamp, DrawCurrentPhaseStage, DrawCurrentPlayerTurn, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawMarketCoins, DrawProfit, DrawStrategyForSoloBotAndvariUI, DrawTaverns, DrawTierCards, DrawWinner } from "./ui/GameBoardUI";
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
        const gridClasses = `col-span-4 justify-self-center`, gridColClasses = `h-full flex flex-col justify-evenly`, classes = `col-span-3 text-center underline border`, playerClasses = `flex flex-col gap-1`, tierCardsUI = DrawTierCards({ G: this.props.G }), currentPlayerTurnUI = DrawCurrentPlayerTurn({ ctx: this.props.ctx }), currentPhaseStageUI = DrawCurrentPhaseStage({ ctx: this.props.ctx }), winnerUI = DrawWinner({ G: this.props.G, ctx: this.props.ctx }), drawDiscardCards = DrawDiscardedCards({ G: this.props.G, ctx: this.props.ctx }, null, this.props), marketCoinsUI = DrawMarketCoins({ G: this.props.G }, this.props), drawHeroesUI = DrawHeroes({ G: this.props.G, ctx: this.props.ctx }, null, this.props), drawStrategyForSoloBotAndvariUI = this.props.G.mode === GameModeNames.SoloAndvari
            && this.props.G.heroesForSoloGameForStrategyBotAndvari !== null
            && this.props.G.heroesForSoloGameForStrategyBotAndvari.length === 5 ?
            DrawStrategyForSoloBotAndvariUI({ G: this.props.G, ctx: this.props.ctx }, this.props) : null, drawHeroesForSoloBotUI = this.props.G.mode === GameModeNames.Solo ?
            DrawHeroesForSoloBotUI({ G: this.props.G, ctx: this.props.ctx }, null, this.props) : null, drawCampUI = this.props.G.expansions.Thingvellir.active ?
            DrawCamp({ G: this.props.G, ctx: this.props.ctx }, null, this.props) : null, drawDistinctionsUI = DrawDistinctions({ G: this.props.G, ctx: this.props.ctx }, null, this.props), drawDistinctionProfitUI = this.props.G.drawProfit ?
            DrawProfit({ G: this.props.G, ctx: this.props.ctx }, this.props)
            : this.props.G.drawProfit, tavernsUI = DrawTaverns({ G: this.props.G, ctx: this.props.ctx }, null, this.props, gridClasses), playersBoardsCoinsUI = DrawPlayersBoardsCoins({ G: this.props.G, ctx: this.props.ctx }, null, this.props), playersHandsCoinsUI = DrawPlayersHandsCoins({ G: this.props.G, ctx: this.props.ctx }, null, this.props), playersBoardsUI = DrawPlayersBoards({ G: this.props.G, ctx: this.props.ctx }, null, null, this.props), logUI = DrawLogData({ G: this.props.G }), debugUI = DrawDebugData({ G: this.props.G, ctx: this.props.ctx });
        return (_jsxs("div", { className: "flex", children: [_jsxs("div", { className: "grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1", children: [_jsx("div", { className: classes, children: tierCardsUI }), _jsx("div", { className: classes, children: currentPhaseStageUI }), _jsx("div", { className: classes, children: currentPlayerTurnUI }), _jsx("div", { className: classes, children: winnerUI }), _jsx("div", { className: "col-span-12 justify-self-center", children: drawDiscardCards }), _jsx("div", { className: `${gridClasses}`, children: marketCoinsUI }), _jsxs("div", { className: `${gridClasses} ${gridColClasses}`, children: [drawHeroesUI, drawHeroesForSoloBotUI, drawStrategyForSoloBotAndvariUI] }), _jsxs("div", { className: `${gridClasses} ${gridColClasses}`, children: [drawDistinctionsUI, drawCampUI, drawDistinctionProfitUI] }), tavernsUI, _jsxs("div", { className: `${playerClasses} col-span-full`, children: [_jsx("div", { className: `${playerClasses} lg:flex-row`, children: playersBoardsCoinsUI }), _jsx("div", { className: `${playerClasses} lg:flex-row`, children: playersHandsCoinsUI }), _jsx("div", { className: `${playerClasses} items-start lg:flex-row`, children: playersBoardsUI })] })] }), logUI, debugUI] }));
    }
}
//# sourceMappingURL=GameBoard.js.map