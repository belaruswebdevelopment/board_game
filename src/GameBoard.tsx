import type { BoardProps } from "boardgame.io/dist/types/packages/react";
import React from "react";
import type { IMyGameState } from "./typescript/interfaces";
import { DrawDebugData } from "./ui/DebugUI";
import { DrawCamp, DrawCurrentPlayerTurn, DrawDiscardedCards, DrawDistinctions, DrawHeroes, DrawMarketCoins, DrawProfit, DrawTaverns, DrawTierCards, DrawWinner } from "./ui/GameBoardUI";
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
        const gridClass = `col-span-4 justify-self-center`,
            classes = `col-span-4 text-center underline border`,
            tierCardsUI: JSX.Element = DrawTierCards(this.props.G),
            currentPlayerTurnUI: JSX.Element = DrawCurrentPlayerTurn(this.props.ctx),
            winnerUI: JSX.Element = DrawWinner(this.props.G, this.props.ctx),
            drawDiscardCards: JSX.Element =
                DrawDiscardedCards(this.props.G, this.props.ctx, null, this.props) as JSX.Element,
            marketCoinsUI: JSX.Element = DrawMarketCoins(this.props.G, this.props),
            drawHeroesUI: JSX.Element =
                DrawHeroes(this.props.G, this.props.ctx, null, this.props) as JSX.Element,
            drawCampUI: JSX.Element | null = this.props.G.expansions.thingvellir?.active ?
                (DrawCamp(this.props.G, this.props.ctx, null, this.props) as JSX.Element) : null,
            drawDistinctionsUI: JSX.Element =
                DrawDistinctions(this.props.G, this.props.ctx, null, this.props) as JSX.Element,
            drawDistinctionProfitUI: JSX.Element | string = this.props.G.drawProfit ?
                DrawProfit(this.props.G, this.props.ctx, this.props) : this.props.G.drawProfit,
            tavernsUI: JSX.Element[] =
                DrawTaverns(this.props.G, this.props.ctx, null, this.props, gridClass) as
                JSX.Element[],
            playersBoardsCoinsUI: JSX.Element[] =
                DrawPlayersBoardsCoins(this.props.G, this.props.ctx, null, this.props) as
                JSX.Element[],
            playersHandsCoinsUI: JSX.Element[] =
                DrawPlayersHandsCoins(this.props.G, this.props.ctx, null, this.props) as JSX.
                Element[],
            playersBoardsUI: JSX.Element[] =
                DrawPlayersBoards(this.props.G, this.props.ctx, null, null, this.props) as JSX.Element[],
            logUI: JSX.Element | null = DrawLogData(this.props.G),
            debugUI: JSX.Element | null = DrawDebugData(this.props.G, this.props.ctx);
        return (
            <div className="flex">
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
                    <div className="col-span-12 justify-self-center">
                        {drawDiscardCards}
                    </div>
                    <div className={`${gridClass}`}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClass}`}>
                        {drawHeroesUI}
                    </div>
                    <div className={`${gridClass} h-full flex flex-col justify-evenly`}>
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
