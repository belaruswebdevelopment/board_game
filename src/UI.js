import React from "react";
import {Scoring} from "./Game";
import {CountMarketCoins} from "./Coin";
import {suitsConfigArray} from "./SuitData.js";

const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize)),
        boardCols = Math.ceil(objectsSize / boardRows),
        lastBoardCol = objectsSize % boardCols;

    return {boardRows, boardCols, lastBoardCol};
};

const GetSuitStyle = (color) => {
    return {background: color};
};

const GetDebugData = (data) => {
    if (data.props.G.debug) {
        let debugData = {
            G: {},
            ctx: {},
        };
        for (let [key, value] of Object.entries(data.props.G)) {
            debugData.G[key] = value;
        }
        for (let [key, value] of Object.entries(data.props.ctx)) {
            debugData.ctx[key] = value;
        }
        return debugData;
    }
    return null;
};

const DrawObjectData = (obj) => {
    const values = [];
    for (let [key, value] of Object.entries(obj)) {
        if (value instanceof Object) {
            const data = DrawObjectData(value);
            if (Array.isArray(value)) {
                const length = value.length;
                values.push(
                    <li key={key}>
                        <details>
                            <summary><b><span className="key">{key}</span>: </b><i>Array({length})</i></summary>
                            <ul>
                                {data}
                            </ul>
                        </details>
                    </li>
                );
            } else {
                values.push(
                    <li key={key}>
                        <details>
                            <summary><b><span className="key">{key}</span>: </b><i>Object</i></summary>
                            <ul>
                                {data}
                            </ul>
                        </details>
                    </li>
                );
            }
        } else {
            values.push(
                <li key={key}>
                    <b><span className="key">{key}</span>:</b> <span className="value">{value}</span>
                </li>
            );
        }
    }
    return (
        <ul>
            {values}
        </ul>
    );
};

export const DrawDebugData = (data) => {
    const debugData = GetDebugData(data),
        debugInfo = DrawObjectData(debugData);
    return (
        <div>
            <h4>Debug info data:</h4>
            {debugInfo}
        </div>
    );
};

export const DrawMarketCoins = (data) => {
    const boardRows = [],
        drawData = DrawBoard(data.props.G.marketCoinsUnique.length),
        countMarketCoins = CountMarketCoins(data.props.G.marketCoins);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j;
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
    return (
        <div className="column">
            <table>
                <caption>Market coins</caption>
                <tbody>
                {boardRows}
                </tbody>
            </table>
        </div>
    );
};

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
};

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
                        <td style={GetSuitStyle(suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor)} key={j}
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
};

export const DrawPlayersBoards = (data) => {
    const playersBoards = [],
        playerHeaders = [],
        playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let s = 0; s < data.props.G.suitsNum; s++) {
            playerHeaders[p].push(
                <th key={s} style={GetSuitStyle(suitsConfigArray[s].suitColor)}>
                    {suitsConfigArray[s].suitName}
                </th>
            );
        }
        for (let i = 0; ; i++) {
            const playerCells = [];
            let isDrawRow = false;
            playerRows[p][i] = [];
            for (let j = 0; j < data.props.G.suitsNum; j++) {
                const id = i + j,
                    isNotCard = data.props.G.players[p].cards[j] !== undefined && data.props.G.players[p].cards[j][i] === undefined;
                if (data.props.G.players[p].cards[j] === undefined || isNotCard) {
                    playerCells.push(
                        <td key={id}>

                        </td>
                    );
                } else {
                    isDrawRow = true;
                    playerCells.push(
                        <td key={id}
                            style={GetSuitStyle(suitsConfigArray[data.props.G.players[p].cards[j][i].suit].suitColor)}>
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
                <caption>Player {p + 1} cards, {Scoring(data.props.G.players[p])} points</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        </div>);
    }
    return playersBoards;
};

export const DrawPlayersBoardsCoins = (data) => {
    const playersBoardsCoins = [],
        playerHeaders = [],
        playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let i = 0; i < 2; i++) {
            const playerCells = [];
            playerRows[p][i] = [];
            if (i === 0) {
                for (let j = 0; j < data.props.G.taverns.length; j++) {
                    playerHeaders[p].push(
                        <th key={j}>
                            Tavern {j + 1}
                        </th>
                    );
                    if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                        playerCells.push(
                            <td className="rounded coin-tavern-inactive" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b>?</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="rounded coin-tavern-active" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <b>{data.props.G.players[p].boardCoins[coinIndex].value}</b>
                            </td>
                        );
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = data.props.G.taverns.length; j < data.props.G.players[p].boardCoins.length; j++) {
                    if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                        playerCells.push(
                            <td className="rounded coin-trading-inactive" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b>&#8596;</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="rounded coin-trading-active" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b>{data.props.G.players[p].boardCoins[coinIndex].value}</b>
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
                <caption>Player {p + 1} played coins, Priority: {data.props.G.players[p].priority}</caption>
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
};

export const DrawPlayersHandsCoins = (data) => {
    const playersHandsCoins = [];
    let coinClass = "rounded coin-active";
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.players[p].handCoins.length; j++) {
                if (data.props.G.players[p].selectedCoin === j) {
                    coinClass = "rounded coin-active selected";
                } else {
                    coinClass = "rounded coin-active";
                }
                playerCells.push(
                    <td className={coinClass} key={j} onClick={() => data.OnClickHandCoin(j)}>
                        <b>{data.props.G.players[p].handCoins[j]?.value}</b>
                    </td>
                );
            }
        }
        playersHandsCoins[p].push(<div key={p} className="column">
            <table>
                <caption>Player {p + 1} coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>
        </div>);
    }
    return playersHandsCoins;
};
