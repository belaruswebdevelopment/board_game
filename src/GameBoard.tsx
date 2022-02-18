import { BoardProps } from "boardgame.io/react";
import React from "react";
import { IMyGameState } from "./typescript_interfaces/game_data_interfaces";
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
export class GameBoard extends React.Component<BoardProps<IMyGameState>> {
    render() {
        const gridClass = `col-span-4`,
            classes = `col-span-4 text-center underline border`,
            tierCardsUI: JSX.Element = DrawTierCards(this.props),
            currentPlayerTurnUI: JSX.Element = DrawCurrentPlayerTurn(this.props),
            winnerUI: JSX.Element = DrawWinner(this.props),
            marketCoinsUI: JSX.Element = DrawMarketCoins(this.props),
            drawHeroesUI: JSX.Element = DrawHeroes(this.props),
            drawCampUI: JSX.Element | null = this.props.G.expansions.thingvellir.active ? DrawCamp(this.props) :
                null,
            drawDistinctionsUI: JSX.Element = DrawDistinctions(this.props),
            drawDistinctionProfitUI: JSX.Element | string = this.props.G.drawProfit ? DrawProfit(this.props) :
                this.props.G.drawProfit,
            tavernsUI: JSX.Element[] = DrawTaverns(this.props, gridClass),
            playersBoardsCoinsUI: JSX.Element[][] = DrawPlayersBoardsCoins(this.props),
            playersHandsCoinsUI: JSX.Element[][] = DrawPlayersHandsCoins(this.props),
            playersBoardsUI: JSX.Element[][] = DrawPlayersBoards(this.props),
            logUI: JSX.Element | null = DrawLogData(this.props),
            debugUI: JSX.Element | null = DrawDebugData(this.props);
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
                    <div className={`${gridClass} justify-self-center`}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {drawHeroesUI}
                    </div>
                    <div className={`${gridClass} justify-self-center h-full flex flex-col justify-evenly`}>
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
            </div>
        );
    }
}
