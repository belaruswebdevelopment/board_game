import React from 'react';
import {Scoring} from "./Game";

export class GameBoard extends React.Component {
    onClick(tavernId, cardId) {
        this.props.moves.clickBoard(tavernId, cardId);
    }

    DrawBoard(drawSize) {
        const boardRows = Math.round(Math.sqrt(drawSize));
        const boardCols = Math.ceil(drawSize / boardRows);
        const lastBoardCol = drawSize % boardRows;

        return [boardRows, boardCols, lastBoardCol];
    }

    render() {
        let winner = '';
        if (this.props.ctx.gameover) {
            winner = this.props.ctx.gameover.winner !== undefined ? (
                <div id="winner">Winner: Player {Number(this.props.ctx.gameover.winner) + 1}</div>
            ) : (
                <div id="winner">Draw!</div>
            );
        }

        const tavernsBoards = [];
        let boardCells = [];
        for (let t = 0; t < this.props.G.tavernsNum; t++) {
            for (let i = 0; i < 1; i++) {
                boardCells[i] = [];
                for (let j = 0; j < this.props.G.drawSize; j++) {
                    if (this.props.G.taverns[t][j] === null) {
                        boardCells[i].push(
                            <td key={j} onClick={() => this.onClick(t, j)}>
                                {this.props.G.taverns[t][j]}
                            </td>
                        );
                    } else {
                        boardCells[i].push(
                            <td style={this.props.G.colors[this.props.G.taverns[t][j].suit]} key={j}
                                onClick={() => this.onClick(t, j)}>
                                <b>{this.props.G.taverns[t][j]?.rank}</b>
                            </td>
                        );
                    }
                }
                tavernsBoards.push(<div key={t} className="column">
                    <table>
                        <caption>Tavern {t + 1}</caption>
                        <tbody><tr>{boardCells[i]}</tr></tbody>
                    </table>
                </div>);
            }
        }

        let playersBoards = [];
        let playerHeaders = [];
        let playerRows = [];
        let playerCells = [];
        for (let p = 0; p < this.props.ctx.numPlayers; p++) {
            playersBoards[p] = [];
            playerHeaders[p] = [];
            playerRows[p] = [];
            for (let s = 0; s < this.props.G.suitsNum; s++) {
                playerHeaders[p].push(
                    <th key={s} style={this.props.G.colors[s]}>
                        suitName
                    </th>
                );
            }
            for (let i = 0; ; i++) {
                playerRows[p][i] = [];
                playerCells[i] = [];
                let isDrawRow = false;
                for (let j = 0; j < this.props.G.suitsNum; j++) {
                    const id = i + j;
                    if (this.props.G.players[p].cards[j] === undefined || (this.props.G.players[p].cards[j] && this.props.G.players[p].cards[j][i] === undefined)) {
                        playerCells[i].push(
                            <td key={id}>

                            </td>
                        );
                    } else {
                        isDrawRow = true;
                        playerCells[i].push(
                            <td key={id} style={this.props.G.colors[this.props.G.players[p].cards[j][i].suit]}>
                                <b>{this.props.G.players[p].cards[j][i].rank}</b>
                            </td>
                        );
                    }
                }
                if (isDrawRow) {
                    playerRows[p][i].push(
                        <tr key={i}>{playerCells[i]}</tr>
                    );
                } else {
                    break;
                }
            }

            playersBoards[p].push(<div key={p} className="column">
                <table>
                    <caption>Player {p + 1} cards, {Scoring(this.props.G.players[p].cards)} points</caption>
                    <thead><tr>{playerHeaders[p]}</tr></thead>
                    <tbody>{playerRows[p]}</tbody>
                </table>
            </div>);
        }

        return (
            <div>
                <div className="row">
                    {tavernsBoards}
                    {winner}
                </div>
                <div className="row">
                    {playersBoards}
                </div>
            </div>
        );
    }
}
