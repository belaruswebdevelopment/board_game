import React from 'react';
import {Scoring} from "./Game";

export class GameBoard extends React.Component {
    onClick(id) {
        this.props.moves.clickBoard(id);
    }

    drawBoard(drawSize) {
        const fullBoardRows = Math.round(Math.sqrt(drawSize));
        const boardCols = Math.floor(drawSize / fullBoardRows);
        const lastBoardCol = drawSize % fullBoardRows;
        const boardRows = lastBoardCol ? fullBoardRows + 1: fullBoardRows;

        return [boardRows, boardCols, lastBoardCol];
    }

    render() {
        let winner = '';
        if (this.props.ctx.gameover) {
            winner = this.props.ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: Player {this.props.ctx.gameover.winner}</div>
            ) : (
                <div id="winner">Draw!</div>
            );
        }

        const boardData = this.drawBoard(this.props.G.drawSize)
        let mainBoard = [];
        let boardCells = [];
        for (let i = 0; i < boardData[0]; i++) {
            boardCells[i] = [];
            const boardColsNum = boardData[2] && (i === boardData[0] - 1) ? boardData[2] : boardData[1];
            for (let j = 0; j < boardColsNum; j++) {
                const id = boardData[1] * i + j;
                if (this.props.G.board[id] === null) {
                    boardCells[i].push(
                        <td key={id} onClick={() => this.onClick(id)}>
                            {this.props.G.board[id]}
                        </td>
                    );
                } else {
                    boardCells[i].push(
                        <td style={this.props.G.colors[this.props.G.board[id]?.suit]} key={id}
                            onClick={() => this.onClick(id)}>
                            <b>{this.props.G.board[id].rank}</b>
                        </td>
                    );
                }
            }
            mainBoard.push(<tr key={i}>{boardCells[i]}</tr>);
        }

        let playersBoards = [];
        let playerRows = [];
        let playerCells = [];
        for (let p = 0; p < this.props.ctx.numPlayers; p++) {
            playersBoards[p] = [];
            playerRows[p] = [];
            for (let i = 0; i < 3; i++) {
                playerRows[p][i] = [];
                playerCells[i] = [];
                for (let j = 0; j < 5; j++) {
                    const id = 5 * i + j;
                    if (this.props.G.players[p][id] === undefined) {
                        playerCells[i].push(
                            <td key={id}>
                                {this.props.G.players[p][id]}
                            </td>
                        );
                    } else {
                        playerCells[i].push(
                            <td key={id} style={this.props.G.colors[this.props.G.players[p][id]?.suit]}>
                                <b>{this.props.G.players[p][id].rank}</b>
                            </td>
                        );
                    }
                }
                playerRows[p][i].push(
                    <tr key={i}>{playerCells[i]}</tr>
                );
            }

            playersBoards[p].push(<div key={p} className="column">
                player {p} cards, {Scoring(this.props.G.players[p])} points
                <table>
                    <tbody>{playerRows[p]}</tbody>
                </table>
            </div>);
        }

        return (
            <div>
                <table id="board">
                    <tbody>{mainBoard}</tbody>
                </table>
                {winner}

                <div className="row">
                    {playersBoards}
                </div>
            </div>
        );
    }
}
