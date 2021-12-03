import React from "react";
import {
    DrawCamp,
    DrawCurrentPlayerTurn,
    DrawDistinctions,
    DrawHeroes,
    DrawMarketCoins,
    DrawProfit,
    DrawTaverns,
    DrawTierCards,
    DrawWinner,
} from "./ui/GameBoardUI";
import {DrawPlayersBoards, DrawPlayersBoardsCoins, DrawPlayersHandsCoins,} from "./ui/PlayerUI";
import {DrawDebugData} from "./ui/DebugUI";
import {DrawLogData} from "./ui/LogUI";
import type {BoardProps} from 'boardgame.io/react';

/**
 * <h3>Отрисовка игрового стола.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При отрисовке игрового поля для игроков.</li>
 * </ol>
 */
export class GameBoard extends React.Component<BoardProps> {
    OnClickDistinctionCard = (cardId: number): void => {
        this.props.moves.ClickDistinctionCard(cardId);
    };
    OnClickSuitToPlaceCard = (suitId: number): void => {
        this.props.moves.PlaceCard(suitId);
    };
    OnClickSuitToPlaceMercenary = (suitId: number): void => {
        this.props.moves.PlaceEnlistmentMercenaries(suitId);
    };
    OnClickSuitToGetMjollnirProfit = (suitId: number): void => {
        this.props.moves.GetMjollnirProfit(suitId);
    };

    render() {
        const gridClass: string = "col-span-4",
            classes: string = "col-span-4 text-center underline border",
            tierCardsUI: JSX.Element = DrawTierCards(this),
            currentPlayerTurnUI: JSX.Element = DrawCurrentPlayerTurn(this),
            winnerUI: JSX.Element = DrawWinner(this),
            marketCoinsUI: JSX.Element = DrawMarketCoins(this),
            drawHeroesUI: JSX.Element = DrawHeroes(this),
            drawCampUI: JSX.Element | null = this.props.G.expansions.thingvellir.active ? DrawCamp(this) : null,
            drawDistinctionsUI: JSX.Element = DrawDistinctions(this),
            drawDistinctionProfitUI: JSX.Element | string = this.props.G.drawProfit ?
                DrawProfit(this, this.props.G.drawProfit) : this.props.G.drawProfit,
            tavernsUI: JSX.Element[] = DrawTaverns(this, gridClass),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            logUI: JSX.Element | null = DrawLogData(this),
            debugUI: JSX.Element | null = DrawDebugData(this);
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
