import React from 'react';
import {
    DrawMarketCoins,
    DrawTaverns,
    DrawPlayersBoardsCoins,
    DrawPlayersBoards,
    DrawPlayersHandsCoins,
    DrawDebugData, DrawWinner, DrawTierTurns, DrawCurrentPlayer,
} from "./UI";

export class GameBoard extends React.Component {
    OnClickCard = (tavernId, cardId) => {
        this.props.moves.ClickCard(tavernId, cardId);
    }
    OnClickBoardCoin = (coinId) => {
        this.props.moves.ClickBoardCoin(coinId);
    }
    OnClickHandCoin = (coinId) => {
        this.props.moves.ClickHandCoin(coinId);
    }

    render() {
        const tierTurns = DrawTierTurns(this),
            currentPlayer = DrawCurrentPlayer(this),
            winnerUI = DrawWinner(this),
            marketCoinsUI = DrawMarketCoins(this),
            tavernsUI = DrawTaverns(this),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this),
            debugUI = DrawDebugData(this);
        return (
            <div>
                <div className="flex">
                    <div
                        className={`grid auto-rows-min grid-cols-1 lg:grid-cols-${this.props.ctx.numPlayers * 3} gap-2`}>
                        <div className={`col-span-${this.props.ctx.numPlayers}`}>
                            {tierTurns}
                        </div>
                        <div className={`col-span-${this.props.ctx.numPlayers}`}>
                            {currentPlayer}
                        </div>
                        <div className={`col-span-${this.props.ctx.numPlayers}`}>
                            {winnerUI}
                        </div>
                        <div className={`col-span-${this.props.ctx.numPlayers} justify-self-center`}>
                            {marketCoinsUI}
                        </div>
                        <div className={`col-span-${this.props.ctx.numPlayers} justify-self-center`}>
                            {marketCoinsUI}
                        </div>
                        <div className={`col-span-${this.props.ctx.numPlayers} justify-self-center`}>
                            {marketCoinsUI}
                        </div>
                        {tavernsUI}
                        {playersBoardsCoinsUI}
                        {playersBoardsUI}
                        {playersHandsCoinsUI}
                    </div>
                    <div>
                        {debugUI}
                    </div>
                </div>
            </div>
        );
    }
}
