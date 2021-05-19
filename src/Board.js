import React from 'react';
import {
    DrawDebugData,
    DrawMarketCoins,
    DrawPlayersBoards,
    DrawPlayersBoardsCoins,
    DrawPlayersHandsCoins,
    DrawTaverns,
    DrawWinner
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
        const debugUI = DrawDebugData(this),
            marketCoinsUI = DrawMarketCoins(this),
            winnerUI = DrawWinner(this),
            tavernsUI = DrawTaverns(this),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this);
        return (
            <div>
                {marketCoinsUI}
                {winnerUI}
                <div className="row">
                    {tavernsUI}
                </div>
                <div className="row">
                    {playersBoardsCoinsUI}
                </div>
                <div className="row">
                    {playersBoardsUI}
                </div>
                <div className="row">
                    {playersHandsCoinsUI}
                </div>
                {debugUI}
            </div>
        );
    }
}
