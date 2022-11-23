import React from "react";
import { GameModeNames } from "./typescript/enums";
import type { BoardProps, CanBeNullType, FnContext } from "./typescript/interfaces";
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
export class GameBoard extends React.Component<BoardProps> {
    render() {
        const gridClasses = `col-span-4 justify-self-center`,
            gridColClasses = `h-full flex flex-col justify-evenly`,
            classes = `col-span-3 text-center underline border`,
            playerClasses = `flex flex-col gap-1`,
            tierCardsUI: JSX.Element = DrawTierCards({ G: this.props.G } as FnContext),
            currentPlayerTurnUI: JSX.Element = DrawCurrentPlayerTurn({ ctx: this.props.ctx } as FnContext),
            currentPhaseStageUI: JSX.Element = DrawCurrentPhaseStage({ ctx: this.props.ctx } as FnContext),
            winnerUI: JSX.Element = DrawWinner({ G: this.props.G, ctx: this.props.ctx } as FnContext),
            drawDiscardCards: JSX.Element = DrawDiscardedCards({ G: this.props.G, ctx: this.props.ctx } as FnContext,
                null, this.props) as JSX.Element,
            marketCoinsUI: JSX.Element = DrawMarketCoins({ G: this.props.G } as FnContext, this.props),
            drawHeroesUI: JSX.Element = DrawHeroes({ G: this.props.G, ctx: this.props.ctx } as FnContext,
                null, this.props) as JSX.Element,
            drawStrategyForSoloBotAndvariUI: CanBeNullType<JSX.Element> =
                this.props.G.mode === GameModeNames.SoloAndvari
                    && this.props.G.heroesForSoloGameForStrategyBotAndvari !== null
                    && this.props.G.heroesForSoloGameForStrategyBotAndvari.length === 5 ?
                    DrawStrategyForSoloBotAndvariUI({ G: this.props.G, ctx: this.props.ctx } as FnContext,
                        this.props) as JSX.Element : null,
            drawHeroesForSoloBotUI: CanBeNullType<JSX.Element> = this.props.G.mode === GameModeNames.Solo ?
                DrawHeroesForSoloBotUI({ G: this.props.G, ctx: this.props.ctx } as FnContext, null,
                    this.props) as JSX.Element : null,
            drawCampUI: CanBeNullType<JSX.Element> = this.props.G.expansions.Thingvellir.active ?
                (DrawCamp({ G: this.props.G, ctx: this.props.ctx } as FnContext, null,
                    this.props) as JSX.Element) : null,
            drawDistinctionsUI: JSX.Element = DrawDistinctions({ G: this.props.G, ctx: this.props.ctx } as FnContext,
                null, this.props) as JSX.Element,
            drawDistinctionProfitUI: CanBeNullType<JSX.Element> = this.props.G.drawProfit ?
                DrawProfit({ G: this.props.G, ctx: this.props.ctx } as FnContext, this.props)
                : this.props.G.drawProfit,
            tavernsUI: JSX.Element[] = DrawTaverns({ G: this.props.G, ctx: this.props.ctx } as FnContext,
                null, this.props, gridClasses) as JSX.Element[],
            playersBoardsCoinsUI: JSX.Element[] =
                DrawPlayersBoardsCoins({ G: this.props.G, ctx: this.props.ctx } as FnContext, null, this.props) as
                JSX.Element[],
            playersHandsCoinsUI: JSX.Element[] =
                DrawPlayersHandsCoins({ G: this.props.G, ctx: this.props.ctx } as FnContext, null,
                    this.props) as JSX.Element[],
            playersBoardsUI: JSX.Element[] = DrawPlayersBoards({ G: this.props.G, ctx: this.props.ctx } as FnContext,
                null, null, this.props) as JSX.Element[],
            logUI: CanBeNullType<JSX.Element> = DrawLogData({ G: this.props.G } as FnContext),
            debugUI: CanBeNullType<JSX.Element> = DrawDebugData({ G: this.props.G, ctx: this.props.ctx } as FnContext);
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
                        {drawStrategyForSoloBotAndvariUI}
                    </div>
                    <div className={`${gridClasses} ${gridColClasses}`}>
                        {drawDistinctionsUI}
                        {drawCampUI}
                        {drawDistinctionProfitUI}
                    </div>
                    {tavernsUI}
                    <div className={`${playerClasses} col-span-full`}>
                        <div className={`${playerClasses} lg:flex-row`}>{playersBoardsCoinsUI}</div>
                        <div className={`${playerClasses} lg:flex-row`}>{playersHandsCoinsUI}</div>
                        <div className={`${playerClasses} items-start lg:flex-row`}>{playersBoardsUI}</div>
                    </div>
                </div>
                {logUI}
                {debugUI}
            </div>
        );
    }
}
