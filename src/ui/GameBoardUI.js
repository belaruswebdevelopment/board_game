import React from "react";
import {CountMarketCoins} from "../Coin";
import {suitsConfigArray} from "../data/SuitData.js";

const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize)),
        boardCols = Math.ceil(objectsSize / boardRows),
        lastBoardCol = objectsSize % boardCols;

    return {boardRows, boardCols, lastBoardCol};
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
                        <img className="coin"
                             src={`/img/coins/Coin${data.props.G.marketCoinsUnique[increment]}.jpg`}
                             alt={data.props.G.marketCoinsUnique[increment]}/>
                        <b><sup>0</sup></b>
                    </td>
                );
            } else {
                boardCells.push(
                    <td key={j}>
                        <img className="coin"
                             src={`/img/coins/Coin${data.props.G.marketCoinsUnique[increment]}.jpg`}
                             alt={data.props.G.marketCoinsUnique[increment]}/>
                        <b><sup>{countMarketCoins[data.props.G.marketCoinsUnique[increment]]}</sup></b>
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

export const DrawHeroes = (data) => {
    const boardRows = [],
        drawData = DrawBoard(data.props.G.heroes.length);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j;
            boardCells.push(
                <td className="cursor-pointer" key={j} onClick={() => data.OnClickHeroCard(increment)}>
                    {data.props.G.heroes[increment]}
                </td>
            );
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
            <caption>Heroes</caption>
            <tbody>
            {boardRows}
            </tbody>
        </table>
    );
};

export const DrawCamp = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null) {
                boardCells.push(
                    <td key={j}>

                    </td>
                );
            } else {
                boardCells.push(
                    <td className="cursor-pointer" key={j} onClick={() => data.OnClickCampCard(j)}>
                        <b>{data.props.G.camp[j].points}</b>
                    </td>
                );
            }
        }
    }
    return (
        <table>
            <caption>Camp</caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

export const DrawTaverns = (data, gridClass) => {
    const tavernsBoards = [];
    let background = "";
    for (let t = 0; t < data.props.G.tavernsNum; t++) {
        for (let i = 0; i < 1; i++) {
            const boardCells = [];
            for (let j = 0; j < data.props.G.drawSize; j++) {
                if (data.props.G.taverns[t][j] === null) {
                    boardCells.push(
                        <td key={j}>

                        </td>
                    );
                } else {
                    boardCells.push(
                        <td className={`${suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor} cursor-pointer`}
                            onClick={() => data.OnClickCard(t, j)}>
                            <b>{data.props.G.taverns[t][j].points}</b>
                        </td>
                    );
                }
            }
            if (t === 0) {
                background = "url(/img/taverns/Taverns.png) no-repeat -2px -4px / 74px 42px";
            } else if (t === 1) {
                background = "url(/img/taverns/Taverns.png) no-repeat -25px -17px / 74px 42px";
            } else if (t === 2) {
                background = "url(/img/taverns/Taverns.png) no-repeat -49px -9px / 74px 42px";
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`} key={t}>
                    <caption>
                        <span style={{background: background}} className="tavern">

                        </span>
                    </caption>
                    <tbody>
                    <tr>{boardCells}</tr>
                    </tbody>
                </table>
            );
        }
    }
    return tavernsBoards;
};
