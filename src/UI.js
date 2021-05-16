import React from "react";
import {Scoring} from "./Game";
import {CountMarketCoins} from "./Coin";
import {suitsConfigArray} from  "./SuitData.js";

const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize));
    const boardCols = Math.ceil(objectsSize / boardRows);
    const lastBoardCol = objectsSize % boardCols;

    return {boardRows, boardCols, lastBoardCol};
}

const getSuitStyle = (color) => {
    return {background: color};
}

export const DrawMarketCoins = (data) => {
    const drawData = DrawBoard(data.props.G.marketCoinsUnique.length);
    const countMarketCoins = CountMarketCoins(data.props.G.marketCoins);
    const boardRows = [];
    for (let i = 0; i < drawData.boardRows; i++) {
        boardRows[i] = [];
        const boardCells = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            let increment = i * drawData.boardCols + j;
            if (countMarketCoins[data.props.G.marketCoinsUnique[increment]] === undefined) {
                boardCells.push(
                    <td key={j}>
                        {data.props.G.marketCoinsUnique[increment]}
                        <sup>0</sup>
                    </td>
                );
            } else {
                boardCells.push(
                    <td key={j}>
                        <b>{data.props.G.marketCoinsUnique[increment]}</b>
                        <sup>{countMarketCoins[data.props.G.marketCoinsUnique[increment]]}</sup>
                    </td>
                );
            }
            if ((i === drawData.boardRows - 1) && (j + 1 === drawData.lastBoardCol)) {
                break;
            }
        }
        boardRows[i].push(
            <tr key={i}>{boardCells}</tr>
        );
    }
    return (<div className="column">
        <table>
            <caption>Market coins</caption>
            <tbody>
            {boardRows}
            </tbody>
        </table>
    </div>);
}
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
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(
                        <td key={j} onClick={() => data.OnClick(t, j)}>
                            {data.props.G.taverns[t][j]}
                        </td>
                    );
                } else {
                    boardCells.push(
                        <td style={getSuitStyle(suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor)} key={j}
                            onClick={() => data.OnClick(t, j)}>
                            <b>{data.props.G.taverns[t][j].points}</b>
                        </td>
                    );
                }
            }
            tavernsBoards.push(<div key={t} className="column">
                <table>
                    <caption>Tavern {t + 1}</caption>
                    <tbody>
                    <tr>{boardCells}</tr>
                    </tbody>
                </table>
            </div>);
        }
    }
    return tavernsBoards;
}

export const DrawPlayersBoards = (data) => {
    const playersBoards = [];
    const playerHeaders = [];
    const playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let s = 0; s < data.props.G.suitsNum; s++) {
            playerHeaders[p].push(
                <th key={s} style={getSuitStyle(suitsConfigArray[s].suitColor)}>
                    {suitsConfigArray[s].suitName}
                </th>
            );
        }
        for (let i = 0; ; i++) {
            playerRows[p][i] = [];
            const playerCells = [];
            let isDrawRow = false;
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const id = i + j;
                if (data.props.G.players[p].cards[j] === undefined || (data.props.G.players[p].cards[j] && data.props.G.players[p].cards[j][i] === undefined)) {
                    playerCells.push(
                        <td key={id}>

                        </td>
                    );
                } else {
                    isDrawRow = true;
                    playerCells.push(
                        <td key={id} style={getSuitStyle(suitsConfigArray[data.props.G.players[p].cards[j][i].suit].suitColor)}>
                            <b>{data.props.G.players[p].cards[j][i].points}</b>
                        </td>
                    );
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={i}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(<div key={p} className="column">
            <table>
                <caption>Player {p + 1} cards, {Scoring(data.props.G.players[p].cards)} points</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        </div>);
    }
    return playersBoards;
}

export const DrawPlayersCoins = (data) => {
    const playersCoinsBoards = [];
    const playerCells = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersCoinsBoards[p] = [];
        playerCells[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.players[p].handCoins.length; j++) {
                playerCells[p].push(
                    <td className="rounded" key={j}>
                        <b>{data.props.G.players[p].handCoins[j].value}</b>
                    </td>
                );
            }
        }
        playersCoinsBoards[p].push(<div key={p} className="column">
            <table>
                <caption>Player {p + 1} coins</caption>
                <tbody>
                <tr>{playerCells[p]}</tr>
                </tbody>
            </table>
        </div>);
    }
    return playersCoinsBoards;
}
