import React from "react";
import {Scoring} from "./Game";
import {CountMarketCoins} from "./Coin";
import {suitsConfigArray} from "./SuitData.js";

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
                    <td className="rounded coin-inactive" key={j}>
                        {data.props.G.marketCoinsUnique[increment]}
                        <sup>0</sup>
                    </td>
                );
            } else {
                boardCells.push(
                    <td className="rounded coin-active" key={j}>
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
                        <td key={j} onClick={() => data.OnClickCard(t, j)}>
                            {data.props.G.taverns[t][j]}
                        </td>
                    );
                } else {
                    boardCells.push(
                        <td style={getSuitStyle(suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor)} key={j}
                            onClick={() => data.OnClickCard(t, j)}>
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
                        <td key={id}
                            style={getSuitStyle(suitsConfigArray[data.props.G.players[p].cards[j][i].suit].suitColor)}>
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

export const DrawPlayersBoardsCoins = (data) => {
    const playersBoardsCoins = [];
    const playerHeaders = [];
    const playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let i = 0; i < 2; i++) {
            playerRows[p][i] = [];
            const playerCells = [];
            if (i === 0) {
                for (let j = 0; j < data.props.G.taverns.length; j++) {
                    playerHeaders[p].push(
                        <th key={j}>
                            Tavern {j}
                        </th>
                    );
                    if (data.props.G.players[p].boardCoins[coinIndex] !== undefined) {
                        playerCells.push(
                            <td className="rounded coin-tavern-active" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <b>{data.props.G.players[p].boardCoins[coinIndex].value}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="rounded coin-tavern-inactive" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <b>?</b>
                            </td>
                        );
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = 0; j < 2; j++) {
                    if (data.props.G.players[p].boardCoins[coinIndex] !== undefined) {
                        playerCells.push(
                            <td className="rounded coin-trading-active" key={j}>
                                <b>{data.props.G.players[p].boardCoins[coinIndex].value}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="rounded coin-trading-inactive" key={j}>
                                <b>&#8596;</b>
                            </td>
                        );
                    }
                    coinIndex++;
                }
            }
            playerRows[p][i].push(<tr key={i}>{playerCells}</tr>)
        }
        playersBoardsCoins[p].push(<div key={p} className="column">
            <table>
                <caption>Player {p + 1} played coins</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>
                {playerRows[p]}
                </tbody>
            </table>
        </div>);
    }
    return playersBoardsCoins;
}

export const DrawPlayersHandsCoins = (data) => {
    const playersHandsCoins = [];
    const playerCells = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersHandsCoins[p] = [];
        playerCells[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.players[p].handCoins.length; j++) {
                playerCells[p].push(
                    <td className="rounded coin-active" key={j} onClick={() => data.OnClickHandCoin(j)}>
                        <b>{data.props.G.players[p].handCoins[j].value}</b>
                    </td>
                );
            }
        }
        playersHandsCoins[p].push(<div key={p} className="column">
            <table>
                <caption>Player {p + 1} coins</caption>
                <tbody>
                <tr>{playerCells[p]}</tr>
                </tbody>
            </table>
        </div>);
    }
    return playersHandsCoins;
}