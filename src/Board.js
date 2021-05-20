import React from 'react';
import {
    DrawTierTurns,
    DrawCurrentPlayer,
    DrawWinner,
    DrawMarketCoins,
    DrawCamp,
    DrawTaverns,
} from "./UI";
import {
    DrawPlayersBoardsCoins,
    DrawPlayersBoards,
    DrawPlayersHandsCoins,
} from "./PlayerUI";
import {DrawDebugData} from "./DebugUI";

export class GameBoard extends React.Component {
    OnClickCampCard = (cardId) => {
        this.props.moves.ClickCampCard(cardId);
    };
    OnClickCard = (tavernId, cardId) => {
        this.props.moves.ClickCard(tavernId, cardId);
    };
    OnClickBoardCoin = (coinId) => {
        this.props.moves.ClickBoardCoin(coinId);
    };
    OnClickHandCoin = (coinId) => {
        this.props.moves.ClickHandCoin(coinId);
    };

    render() {
        const gridClass = `col-span-${this.props.ctx.numPlayers}`,
            tierTurns = DrawTierTurns(this),
            currentPlayer = DrawCurrentPlayer(this),
            winnerUI = DrawWinner(this),
            marketCoinsUI = DrawMarketCoins(this),
            drawCamp = DrawCamp(this),
            tavernsUI = DrawTaverns(this, gridClass),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this),
            debugUI = DrawDebugData(this),
            classes = `col-span-${this.props.ctx.numPlayers} text-center underline border`;
        return (
            <div className="flex">
                <div className={`grid auto-rows-min grid-cols-1 lg:grid-cols-${this.props.ctx.numPlayers * 3} gap-2`}>
                    <div className={classes}>
                        {tierTurns}
                    </div>
                    <div className={classes}>
                        {currentPlayer}
                    </div>
                    <div className={classes}>
                        {winnerUI}
                    </div>
                    <div className={gridClass}>
                        {marketCoinsUI}
                    </div>
                    <div className={gridClass}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {drawCamp}
                    </div>
                    {tavernsUI}
                    {playersBoardsCoinsUI}
                    {playersBoardsUI}
                    {playersHandsCoinsUI}
                </div>
                {debugUI}
            </div>
        );
    }
}
