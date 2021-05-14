import React from 'react';
import {DrawPlayersBoards, DrawTaverns, DrawWinner} from "./UI";

export class GameBoard extends React.Component {
    OnClick = (tavernId, cardId) => {
        this.props.moves.ClickBoard(tavernId, cardId);
    }

    render() {
        const winnerUI = DrawWinner(this);
        const tavernsUI = DrawTaverns(this);
        const playersBoardsUI = DrawPlayersBoards(this);

        return (
            <div>
                <div className="row">
                    {tavernsUI}
                    {winnerUI}
                </div>
                <div className="row">
                    {playersBoardsUI}
                </div>
            </div>
        );
    }
}
