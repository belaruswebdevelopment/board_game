import React from 'react';
import {
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
        const winnerUI = DrawWinner(this);
        const tavernsUI = DrawTaverns(this);
        const playersBoardsUI = DrawPlayersBoards(this);
        const marketCoinsUI = DrawMarketCoins(this);
        const playersHandsCoinsUI = DrawPlayersHandsCoins(this);
        const playersBoardsCoinsUI = DrawPlayersBoardsCoins(this);
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
            </div>
        );
    }
}