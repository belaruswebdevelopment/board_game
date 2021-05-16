import React from 'react';
import {DrawMarketCoins, DrawPlayersBoards, DrawPlayersCoins, DrawTaverns, DrawWinner} from "./UI";

export class GameBoard extends React.Component {
    OnClick = (tavernId, cardId) => {
        this.props.moves.ClickBoard(tavernId, cardId);
    }

    render() {
        const winnerUI = DrawWinner(this);
        const tavernsUI = DrawTaverns(this);
        const playersBoardsUI = DrawPlayersBoards(this);
        const marketCoinsUI = DrawMarketCoins(this);
        const playersCoinsUI = DrawPlayersCoins(this);
        return (
            <div>
                {marketCoinsUI}
                {winnerUI}
                <div className="row">
                    {tavernsUI}
                </div>
                <div className="row">
                    {playersBoardsUI}
                </div>
                <div className="row">
                    {playersCoinsUI}
                </div>
            </div>
        );
    }
}