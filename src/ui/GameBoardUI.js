import React from "react";
import {CountMarketCoins} from "../Coin";
import {suitsConfigArray} from "../data/SuitData.js";
import {tavernsConfig} from "../Tavern";
import {Styles} from "../data/StyleData";

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
            ({data.props.G.decks.length - data.props.G.tierToEnd !== 2 ? data.props.G.decks[data.props.G.decks.length - data.props.G.tierToEnd].length : 0}
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
        winner = data.props.ctx.gameover.winner !== null ?
            "Winner: Player " + (data.props.G.winner + 1) :
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
        countMarketCoins = CountMarketCoins(data.props.G);
    for (let i = 0; i < drawData.boardRows; i++) {
        const boardCells = [];
        boardRows[i] = [];
        for (let j = 0; j < drawData.boardCols; j++) {
            const increment = i * drawData.boardCols + j,
                tempCoinValue = data.props.G.marketCoinsUnique[increment].value;
            boardCells.push(
                <td className="bg-yellow-300" key={tempCoinValue}>
                    <span style={Styles.Coin(tempCoinValue, false)} className="bg-market-coin">
                        <span className={countMarketCoins[tempCoinValue] === 0 ? "text-red-500" : "text-blue-500"}>
                            {countMarketCoins[tempCoinValue]}
                        </span>
                    </span>
                </td>
            );
            if (increment + 1 === data.props.G.marketCoinsUnique.length) {
                break;
            }
        }
        boardRows[i].push(
            <tr key={`Market coins row ${i}`}>{boardCells}</tr>
        );
    }
    return (
        <table>
            <caption>
                <span className="block">
                    <span style={Styles.Exchange()} className="bg-top-market-coin-icon">

                    </span> Market coins ({data.props.G.marketCoins.length} left)</span>
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
            if (data.props.G.heroes[increment] === null) {
                boardCells.push(
                    <td className="bg-gray-600" key={j}>

                    </td>
                );
            } else {
                boardCells.push(
                    <td className="bg-gray-600 cursor-pointer" key={`Hero ${data.props.G.heroes[increment].name} card`}
                        onClick={() => data.OnClickHeroCard(increment)}>
                        <span
                            style={Styles.Heroes(data.props.G.heroes[increment].game, data.props.G.heroes[increment].name)}
                            title={data.props.G.heroes[increment].description}
                            className="bg-hero">

                        </span>
                    </td>
                );
            }
            if (increment + 1 === data.props.G.heroes.length) {
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
                <span style={Styles.HeroBack()} className="bg-top-hero-icon">

                </span> <span>Heroes ({data.props.G.heroes.length} left)</span>
            </caption>
            <tbody>
            {boardRows}
            </tbody>
        </table>
    );
};

export const DrawDistinctions = (data) => {
    const boardCells = [];
    let j = 0;
    for (let i = 0; i < 1; i++) {
        for (const suit in suitsConfigArray) {
            // todo currentPlayer
            boardCells.push(
                <td className="bg-green-500 cursor-pointer" key={`Distinction ${suit} card`}
                    onClick={() => data.OnClickDistinctionCard(j)}
                    title={suitsConfigArray[suit].distinction.description}>
                    <span style={Styles.Distinctions(suit)} className="bg-suit-distinction">

                    </span>
                </td>
            );
            i++;
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.DistinctionsBack()} className="bg-top-distinctions-icon">

                </span> <span>Distinctions</span>
            </caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

export const DrawProfit = (data, option) => {
    const boardCells = [];
    let caption = "Get ";
    for (let i = 0; i < 1; i++) {
        if (option === 3) {
            caption += "coin to upgrade up to 5.";
            for (let j = 0; j < data.props.G.players[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                if (!data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                    // todo currentPlayer
                    boardCells.push(
                        <td className="cursor-pointer" key={j} onClick={() => data.OnClickCoinToUpgradeDistinction(j)}>
                            <span
                                style={Styles.Coin(data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].value,
                                    data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isInitial)}
                                className={`bg-coin border-2`}>

                            </span>
                        </td>
                    );
                }
            }
        } else if (option === 4) {
            caption += "one card to your board.";
            const deck = [];
            for (let j = 0; j < 3; j++) {
                // todo currentPlayer
                deck.push(data.props.G.decks[1][j]);
                if (data.props.G.decks[1][j].suit !== undefined) {
                    boardCells.push(
                        <td className={`${suitsConfigArray[data.props.G.decks[1][j].suit].suitColor} cursor-pointer`}
                            key={j} onClick={() => data.OnClickCardToPickDistinction(j, deck)}>
                            <b>{deck[j].points}</b>
                        </td>
                    );
                } else if (data.props.G.decks[1][j].value !== undefined) {
                    boardCells.push(
                        <td className="cursor-pointer" key={j}
                            onClick={() => data.OnClickCardToPickDistinction(j, deck)}>
                            <b>{deck[j].value}</b>
                        </td>
                    );
                }
            }
        } else if (option === "upgradeCoin") {
            caption += "coin to upgrade up to " + data.props.G.players[data.props.ctx.currentPlayer].pickedCard.value + ".";
            for (let j = 0; j < data.props.G.players[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                if (!data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                    // todo currentPlayer
                    boardCells.push(
                        <td className="cursor-pointer" key={j} onClick={() => data.OnClickCoinToUpgrade(j)}>
                            <span
                                style={Styles.Coin(data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].value,
                                    data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isInitial)}
                                className={`bg-coin border-2`}>

                            </span>
                        </td>
                    );
                }
            }
        } else if (option === "upgradeCoinDistinction") {
            caption += "coin to upgrade up to " + data.props.G.players[data.props.ctx.currentPlayer].pickedCard.value + ".";
            for (let j = 0; j < data.props.G.players[data.props.ctx.currentPlayer].boardCoins.length; j++) {
                if (!data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isTriggerTrading) {
                    // todo currentPlayer
                    boardCells.push(
                        <td className="cursor-pointer" key={j} onClick={() => data.OnClickCoinToUpgradeInDistinction(j,
                            data.props.G.players[data.props.ctx.currentPlayer].pickedCard.value)}>
                            <span
                                style={Styles.Coin(data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].value,
                                    data.props.G.players[data.props.ctx.currentPlayer].boardCoins[j].isInitial)}
                                className={`bg-coin border-2`}>

                            </span>
                        </td>
                    );
                }
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.DistinctionsBack()} className="bg-top-distinctions-icon">

                </span> <span>{caption}</span>
            </caption>
            <tbody>
            <tr>{boardCells}</tr>
            </tbody>
        </table>
    );
};

export const DrawCamp = (data) => {
    const boardCells = [];
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < data.props.G.campNum; j++) {
            if (data.props.G.camp[j] === null || data.props.G.camp[j] === undefined) {
                boardCells.push(
                    <td key={j}>
                        <span style={Styles.Camp()} className="bg-camp-icon">

                        </span>
                    </td>
                );
            } else {
                // todo currentPlayer
                boardCells.push(
                    <td className="bg-yellow-200 cursor-pointer" key={`Camp ${data.props.G.camp[j].name} card`}
                        onClick={() => data.OnClickCampCard(j)}>
                        <span style={Styles.CampCards(data.props.G.camp[j].tier, data.props.G.camp[j].name)}
                              title={data.props.G.camp[j].description} className="bg-camp">

                        </span>
                    </td>
                );
            }
        }
    }
    return (
        <table>
            <caption>
                <span style={Styles.Camp()} className="bg-top-camp-icon">

                </span>
                <span>Camp {data.props.G.campDecks.length - data.props.G.tierToEnd + 1 > data.props.G.campDecks.length
                    ? data.props.G.campDecks.length : data.props.G.campDecks.length - data.props.G.tierToEnd + 1}
                    ({data.props.G.campDecks.length - data.props.G.tierToEnd !== 2 ?
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
                            <span style={Styles.Taverns(t)} className="bg-tavern-icon">

                            </span>
                        </td>
                    );
                } else {
                    // todo currentPlayer
                    if (data.props.G.taverns[t][j].suit !== undefined) {
                        boardCells.push(
                            <td className={`${suitsConfigArray[data.props.G.taverns[t][j].suit].suitColor} cursor-pointer`}
                                onClick={() => data.OnClickCard(t, j)}>
                                <b>{data.props.G.taverns[t][j].points}</b>
                            </td>
                        );
                    } else if (data.props.G.taverns[t][j].value !== undefined) {
                        boardCells.push(
                            <td className="cursor-pointer" onClick={() => data.OnClickCard(t, j)}>
                                <b>{data.props.G.taverns[t][j].value}</b>
                            </td>
                        );
                    }
                }
            }
            tavernsBoards.push(
                <table className={`${gridClass} justify-self-center`} key={`Tavern ${tavernsConfig[t].name} board`}>
                    <caption>
                        <span style={Styles.Taverns(t)} className="bg-tavern-icon">

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
