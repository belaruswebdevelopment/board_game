import React from "react";
import {CountMarketCoins} from "../Coin";
import {suitsConfigArray} from "../data/SuitData.js";
import {tavernsConfig} from "../Tavern";

const DrawBoard = (objectsSize) => {
    const boardRows = Math.floor(Math.sqrt(objectsSize)),
        boardCols = Math.ceil(objectsSize / boardRows),
        lastBoardCol = objectsSize % boardCols;

    return {boardRows, boardCols, lastBoardCol};
};

export const DrawTierCards = (data) => {
    return (
        <b>Tier: <span className="italic">
            {data.props.G.decks.length - data.props.G.tierToEnd + 1 > data.props.G.decks.length
                ? data.props.G.decks.length : data.props.G.decks.length - data.props.G.tierToEnd + 1}
            /{data.props.G.decks.length}
            ({data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd] !== undefined ?
            data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0}
            {data.props.G.decks.length - data.props.G.tierToEnd === 0 ? "/"
                + data.props.G.decks.reduce((count, current) => count + current.length, 0) : ""} cards left)
        </span></b>
    );
};

export const DrawCurrentPlayerTurn = (data) => {
    return (
        <b>Current player: <span className="italic">Player {Number(data.props.ctx.currentPlayer) + 1}</span> |
            Turn: <span className="italic">{data.props.ctx.turn}</span></b>
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
        <b>Game status: <span className="italic">{winner}</span></b>
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
            if (countMarketCoins[data.props.G.marketCoinsUnique[increment].value] === undefined) {
                boardCells.push(
                    <td className="bg-yellow-300" key={data.props.G.marketCoinsUnique[increment].value}>
                        <span
                            style={{background: `url(/img/coins/Coin${data.props.G.marketCoinsUnique[increment].value}.jpg) no-repeat 0px 0px / 48px 48px`}}
                            className="bg-market-coin">
                            <span className="text-red-500">0</span>
                        </span>
                    </td>
                );
            } else {
                boardCells.push(
                    <td className="bg-yellow-300" key={data.props.G.marketCoinsUnique[increment].value}>
                        <span
                            style={{background: `url(/img/coins/Coin${data.props.G.marketCoinsUnique[increment].value}.jpg) no-repeat 0px 0px / 48px 48px`}}
                            className="bg-market-coin">
                            <span className="text-blue-500">{countMarketCoins[data.props.G.marketCoinsUnique[increment].value]}</span>
                        </span>
                    </td>
                );
            }
            if ((i === drawData.boardRows - 1) && (j + 1 === drawData.lastBoardCol)) {
                break;
            }
        }
        boardRows[i].push(
            <tr key={`Market coins row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption className="m-auto">
                <span
                    style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                    className="bg-small-market-coin">

                </span> <span className="font-black">Market coins ({data.props.G.marketCoins.length} left)</span>
            </caption>
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
            // todo currentPlayer
            boardCells.push(
                <td className="bg-gray-600 cursor-pointer" key={j} onClick={() => data.OnClickHeroCard(increment)}>
                    <span className="text-white">{data.props.G.heroes[increment]}</span>
                </td>
            );
            if ((i === drawData.boardRows - 1) && (j + 1 === drawData.lastBoardCol)) {
                break;
            }
        }
        boardRows[i].push(
            <tr key={`Heroes row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span
                    style={{background: `url(/img/cards/heroes/HeroBack.png) no-repeat 0px 0px / 16px 24px`}}
                    className="bg-hero">

                </span> <span className="font-black">Heroes ({data.props.G.heroes.length} left)</span>
            </caption>
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
            if (data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd][j] === null) {
                boardCells.push(
                    <td key={j}>

                    </td>
                );
            } else {
                // todo currentPlayer
                boardCells.push(
                    <td className="bg-yellow-200 cursor-pointer" key={j} onClick={() => data.OnClickCampCard(j)}>
                        <b>{data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd][j].points}</b>
                    </td>
                );
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={{background: "url(/img/cards/camp/Camp.png) no-repeat 0px 0px / 32px 21px"}}
                      className="bg-camp">

                </span> <span className="font-black">Camp {data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length
                ? data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1}
                ({data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd] !== undefined ?
                data.props.G.campDecks[data.props.G.campDecks.length - data.props.G.tierToEnd].length : 0}
                {data.props.G.campDecks.length - data.props.G.tierToEnd === 0 ? "/"
                    + data.props.G.campDecks.reduce((count, current) => count + current.length, 0) : ""} cards left)</span>
            </caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
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
                        <td key={j}>
                            <span style={{background: tavernsConfig[t].style}} className="bg-tavern">

                            </span>
                        </td>
                    );
                } else {
                    // todo currentPlayer
                    boardCells.push(
                        <td className={`${suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor} cursor-pointer`}
                            onClick={() => data.OnClickCard(t, j)}>
                            <b>{data.props.G.taverns[t][j].points}</b>
                        </td>
                    );
                }
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`} key={`Tavern ${tavernsConfig[t].name} board`}>
                    <caption>
                        <span style={{background: tavernsConfig[t].style}} className="bg-tavern">

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
