import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import React from "react";
import type { CanBeNull, IMyGameState } from "./typescript/interfaces";
import { DrawDebugData } from "./ui/DebugUI";
import { DrawCamp, DrawCurrentPhaseStage, DrawCurrentPlayerTurn, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawHeroesForSoloBotUI, DrawMarketCoins, DrawProfit, DrawTaverns, DrawTierCards, DrawWinner } from "./ui/GameBoardUI";
import { DrawLogData } from "./ui/LogUI";
import { DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins } from "./ui/PlayerUI";

/**
 * <h3>Отображение игрового стола.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отображении игрового поля для игроков.</li>
 * </ol>
 */
export class GameBoard extends React.Component<BoardProps<IMyGameState>> {
    render() {
        const gridClasses = `col-span-4 justify-self-center`,
            gridColClasses = `h-full flex flex-col justify-evenly`,
            classes = `col-span-3 text-center underline border`,
            tierCardsUI: JSX.Element = DrawTierCards(this.props.G),
            currentPlayerTurnUI: JSX.Element = DrawCurrentPlayerTurn(this.props.ctx),
            currentPhaseStageUI: JSX.Element = DrawCurrentPhaseStage(this.props.ctx),
            winnerUI: JSX.Element = DrawWinner(this.props.G, this.props.ctx),
            drawDiscardCards: JSX.Element =
                DrawDiscardedCards(this.props.G, this.props.ctx, null, this.props) as JSX.Element,
            marketCoinsUI: JSX.Element = DrawMarketCoins(this.props.G, this.props),
            drawHeroesUI: JSX.Element =
                DrawHeroes(this.props.G, this.props.ctx, null, this.props) as JSX.Element,
            drawHeroesForSoloBotUI: CanBeNull<JSX.Element> = this.props.G.solo ?
                DrawHeroesForSoloBotUI(this.props.G, this.props.ctx, null, this.props) as
                JSX.Element : null,
            drawCampUI: CanBeNull<JSX.Element> = this.props.G.expansions.thingvellir.active ?
                (DrawCamp(this.props.G, this.props.ctx, null, this.props) as JSX.Element) : null,
            drawDistinctionsUI: JSX.Element =
                DrawDistinctions(this.props.G, this.props.ctx, null, this.props) as JSX.Element,
            drawDistinctionProfitUI: JSX.Element | `` = this.props.G.drawProfit ?
                DrawProfit(this.props.G, this.props.ctx, this.props) : this.props.G.drawProfit,
            tavernsUI: JSX.Element[] =
                DrawTaverns(this.props.G, this.props.ctx, null, this.props,
                    gridClasses) as JSX.Element[],
            playersBoardsCoinsUI: JSX.Element[] =
                DrawPlayersBoardsCoins(this.props.G, this.props.ctx, null, this.props) as
                JSX.Element[],
            playersHandsCoinsUI: JSX.Element[] =
                DrawPlayersHandsCoins(this.props.G, this.props.ctx, null, this.props) as
                JSX.Element[],
            playersBoardsUI: JSX.Element[] =
                DrawPlayersBoards(this.props.G, this.props.ctx, null, null,
                    this.props) as JSX.Element[],
            logUI: CanBeNull<JSX.Element> = DrawLogData(this.props.G),
            debugUI: CanBeNull<JSX.Element> = DrawDebugData(this.props.G, this.props.ctx);
        return (
            <div className="flex">
                <div className="grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1">
                    <div className={classes}>
                        {tierCardsUI}
                    </div>
                    <div className={classes}>
                        {currentPhaseStageUI}
                    </div>
                    <div className={classes}>
                        {currentPlayerTurnUI}
                    </div>
                    <div className={classes}>
                        {winnerUI}
                    </div>
                    <div className="col-span-12 justify-self-center">
                        {drawDiscardCards}
                    </div>
                    <div className={`${gridClasses}`}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClasses} ${gridColClasses}`}>
                        {drawHeroesUI}
                        {drawHeroesForSoloBotUI}
                    </div>
                    <div className={`${gridClasses} ${gridColClasses}`}>
                        {drawDistinctionsUI}
                        {drawCampUI}
                        {drawDistinctionProfitUI}
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
            </div>
        );
    }
}
