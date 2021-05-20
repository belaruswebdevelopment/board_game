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
                            <summary><b><span className="text-pink-500">{key}</span>: </b><i>Array({length})</i>
                            </summary>
                            <ul className="list-none p-0 ml-5">
                                {data}
                            </ul>
                        </details>
                    </li>
                );
            } else {
                values.push(
                    <li key={key}>
                        <details>
                            <summary><b><span className="text-pink-500">{key}</span>: </b><i>Object</i></summary>
                            <ul className="list-none p-0 ml-5">
                                {data}
                            </ul>
                        </details>
                    </li>
                );
            }
        } else {
            values.push(
                <li key={key}>
                    <b><span className="text-pink-500">{key}</span>:</b> <span
                    className="text-purple-500">{value}</span>
                </li>
            );
        }
    }
    return (
        <div>
            <ul className="list-none p-0 ml-5">
                {values}
            </ul>
        </div>
    );
};

export const DrawDebugData = (data) => {
    const debugData = GetDebugData(data);
    if (debugData === null) {
        return null;
    } else {
        return (
            <div>
                <h3>Debug info data:</h3>
                {DrawObjectData(debugData)}
            </div>
        );
    }

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
                    <td key={j}>
                        <b className="coin bg-red-500">
                            {data.props.G.marketCoinsUnique[increment]}
                            <sup>0</sup>
                        </b>
                    </td>
                );
            } else {
                boardCells.push(
                    <td key={j}>
                        <b className="coin bg-yellow-500">
                            {data.props.G.marketCoinsUnique[increment]}
                            <sup>{countMarketCoins[data.props.G.marketCoinsUnique[increment]]}</sup>
                        </b>
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
        <table>
            <caption>Market coins</caption>
            <tbody>
            {boardRows}
            </tbody>
        </table>
    );
};

export const DrawWinner = (data) => {
    let winner;
    if (data.props.ctx.gameover) {
        winner = data.props.ctx.gameover.winner !== undefined ?
            "Winner: Player " + (Number(data.props.ctx.gameover.winner) + 1) :
            "Draw!";
    } else {
        winner = "Game is started";
    }
    return (
        <b>Game status: {winner}</b>
    );
};

export const DrawTierTurns = (data) => {
    return (
        <b>Tier: {data.props.G.decks.length - data.props.G.tierToEnd + 1} | Turn: {data.props.ctx.turn}</b>
    );
};

export const DrawCurrentPlayer = (data) => {
    return (
        <b>Current player: Player {Number(data.props.ctx.currentPlayer) + 1}</b>
    );
};

export const DrawTaverns = (data, gridClass) => {
    const tavernsBoards = [];
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(
                        <td key={j} onClick={() => data.OnClickCard(t, j)}>

                        </td>
                    );
                } else {
                    boardCells.push(
                        <td className="cursor-pointer"
                            style={GetSuitStyle(suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor)} key={j}
                            onClick={() => data.OnClickCard(t, j)}>
                            <b>{data.props.G.taverns[t][j].points}</b>
                        </td>
                    );
                }
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`} key={t}>
                    <caption>Tavern {t + 1}</caption>
                    <tbody>
                    <tr>{boardCells}</tr>
                    </tbody>
                </table>
            );
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
                <th style={GetSuitStyle(suitsConfigArray[s].suitColor)} key={s}>
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
        playersBoards[p].push(
            <table className="col-span-3" key={p}>
                <caption>Player {p + 1} cards, {Scoring(data.props.G.players[p])} points</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>{playerRows[p]}</tbody>
            </table>
        );
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
                            <td className="cursor-pointer" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b className="coin bg-red-500">?</b>
                            </td>
                        );
                    } else if (data.props.ctx.phase === 'placeCoins' && Number(data.props.ctx.currentPlayer) !== p) {
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <b className="coin bg-yellow-500">secret</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <b className="coin bg-yellow-500">{data.props.G.players[p].boardCoins[coinIndex].value}</b>
                            </td>
                        );
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = data.props.G.taverns.length; j < data.props.G.players[p].boardCoins.length; j++) {
                    if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                        playerCells.push(
                            <td className="cursor-pointer" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b className="coin bg-red-500">&#8596;</b>
                            </td>
                        );
                    } else if (data.props.ctx.phase === 'placeCoins' && Number(data.props.ctx.currentPlayer) !== p) {
                        playerCells.push(
                            <td className="cursor-pointer" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b className="coin bg-yellow-500">secret</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="cursor-pointer" key={j}
                                onClick={() => data.OnClickBoardCoin(j)}>
                                <b className="coin bg-yellow-500">{data.props.G.players[p].boardCoins[coinIndex].value}</b>
                            </td>
                        );
                    }
                    coinIndex++;
                }
            }
            playerRows[p][i].push(<tr key={i}>{playerCells}</tr>)
        }
        playersBoardsCoins[p].push(
            <table className="col-span-3" key={p}>
                <caption>Player {p + 1} played coins, Priority: {data.props.G.players[p].priority}</caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>
                {playerRows[p]}
                </tbody>
            </table>
        );
    }
    return playersBoardsCoins;
};

export const DrawPlayersHandsCoins = (data) => {
    const playersHandsCoins = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.players[p].handCoins.length; j++) {
                let coinClass = "border-black";
                if (data.props.G.players[p].selectedCoin === j) {
                    coinClass = "border-green-400";
                }
                if (data.props.G.players[p].handCoins[j] === null) {
                    playerCells.push(
                        <td key={j}>

                        </td>
                    );
                } else {
                    playerCells.push(
                        <td className="cursor-pointer" key={j} onClick={() => data.OnClickHandCoin(j)}>
                            <b className={`coin bg-yellow-500 ${coinClass}`}>
                                {data.props.G.players[p].handCoins[j].value}
                            </b>
                        </td>
                    );
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="col-span-3" key={p}>
                <caption>Player {p + 1} coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};
