import React from "react";
import {GetSuitStyle} from "./UI";
import {Scoring} from "./Game";
import {suitsConfigArray} from "./SuitData";

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
                    <img className="block m-auto w-8" src={`/img/${suitsConfigArray[s].suitName}.png`} alt={suitsConfigArray[s].suitName} />
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

export const DrawPlayersHandsCoins = (data) => {
    const playersHandsCoins = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        const playerCells = [];
        playersHandsCoins[p] = [];
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < data.props.G.players[p].handCoins.length; j++) {
                let coinClass = "bg-yellow-500";
                if (data.props.G.players[p].selectedCoin === j) {
                    coinClass = "bg-green-400";
                }
                if (data.props.G.players[p].handCoins[j] === null) {
                    playerCells.push(
                        <td key={j}>

                        </td>
                    );
                } else {
                    playerCells.push(
                        <td className="cursor-pointer" key={j} onClick={() => data.OnClickHandCoin(j)}>
                            <b className={`coin ${coinClass}`}>
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
