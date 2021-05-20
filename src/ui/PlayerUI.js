import React from "react";
import {GetSuitStyle} from "./GameBoardUI";
import {Scoring} from "../Game";
import {suitsConfigArray} from "../data/SuitData";

export const DrawPlayersBoardsCoins = (data) => {
    const playersBoardsCoins = [],
        playerHeaders = [],
        playerFooters = [],
        playerRows = [];
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        let coinIndex = 0;
        playersBoardsCoins[p] = [];
        playerHeaders[p] = [];
        playerFooters[p] = [];
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
                                <img className="coin" src={`/img/coins/CoinBack.png`} alt="Coin Back"/>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <img className="coin"
                                     src={`/img/coins/Coin${data.props.G.players[p].handCoins[j].value}${data.props.G.players[p].handCoins[j].isInitial ? "Initial" : ""}.jpg`}
                                     alt={data.props.G.players[p].handCoins[j].value}/>
                            </td>
                        );
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = data.props.G.taverns.length; j <= data.props.G.players[p].boardCoins.length; j++) {
                    if (j === data.props.G.players[p].boardCoins.length) {
                        playerFooters[p].push(
                            <th key={j}>
                                Priority
                            </th>
                        );
                        playerCells.push(
                            <td key={j}>
                                <img className="priority"
                                     src={`/img/priorities/Priority${data.props.G.players[p].priority}.png`}
                                     alt={`Priority ${data.props.G.players[p].priority}`}/>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={j}>
                                Exchange {j + 1}
                            </th>
                        );
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
                                    <img className="coin" src={`/img/coins/CoinBack.png`} alt="Coin Back"/>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <img className="coin"
                                         src={`/img/coins/Coin${data.props.G.players[p].handCoins[j].value}${data.props.G.players[p].handCoins[j].isInitial ? "Initial" : ""}.jpg`}
                                         alt={data.props.G.players[p].handCoins[j].value}/>
                                </td>
                            );
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr key={i}>{playerCells}</tr>)
        }
        playersBoardsCoins[p].push(
            <table className="col-span-3" key={p}>
                <caption>
                    Player {p + 1} played coins
                </caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>
                {playerRows[p]}
                </tbody>
                <tfoot>
                {playerFooters[p]}
                </tfoot>
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
                    <img className="block m-auto w-8" src={`/img/suits/${suitsConfigArray[s].suitName}.png`}
                         alt={suitsConfigArray[s].suitName}/>
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
                            <img className="coin"
                                 src={`/img/coins/Coin${data.props.G.players[p].handCoins[j].value}${data.props.G.players[p].handCoins[j].isInitial ? "Initial" : ""}.jpg`}
                                 alt={data.props.G.players[p].handCoins[j].value}/>
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
