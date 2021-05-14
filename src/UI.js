import React from "react";
import {Scoring} from "./Game";

export const DrawWinner = (data) => {
    let winner = '';
    if (data.props.ctx.gameover) {
        winner = data.props.ctx.gameover.winner !== undefined ? (
            <h1>Winner: Player {Number(data.props.ctx.gameover.winner) + 1}</h1>
        ) : (
            <h1>Draw!</h1>
        );
    }
    return winner;
}

export const DrawTaverns = (data) => {
    const tavernsBoards = [];
    let boardCells = [];
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            boardCells[i] = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells[i].push(
                        <td key={j} onClick={() => data.OnClick(t, j)}>
                            {data.props.G.taverns[t][j]}
                        </td>
                    );
                } else {
                    boardCells[i].push(
                        <td style={data.props.G.colors[data.props.G.taverns[t][j].suit]} key={j}
                            onClick={() => data.OnClick(t, j)}>
                            <b>{data.props.G.taverns[t][j].points}</b>
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
    return tavernsBoards;
}

export const DrawPlayersBoards = (data) => {
    let playersBoards = [];
    let playerHeaders = [];
    let playerRows = [];
    let playerCells = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let s = 0; s < data.props.G.suitsNum; s++) {
            playerHeaders[p].push(
                <th key={s} style={data.props.G.colors[s]}>
                    suitName
                </th>
            );
        }
        for (let i = 0; ; i++) {
            playerRows[p][i] = [];
            playerCells[i] = [];
            let isDrawRow = false;
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const id = i + j;
                if (data.props.G.players[p].cards[j] === undefined || (data.props.G.players[p].cards[j] && data.props.G.players[p].cards[j][i] === undefined)) {
                    playerCells[i].push(
                        <td key={id}>

                        </td>
                    );
                } else {
                    isDrawRow = true;
                    playerCells[i].push(
                        <td key={id} style={data.props.G.colors[data.props.G.players[p].cards[j][i].suit]}>
                            <b>{data.props.G.players[p].cards[j][i].points}</b>
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
                <caption>Player {p + 1} cards, {Scoring(data.props.G.players[p].cards)} points</caption>
                <thead><tr>{playerHeaders[p]}</tr></thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        </div>);
    }

    return playersBoards;
}