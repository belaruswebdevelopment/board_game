import React from "react";
import {suitsConfigArray} from "../data/SuitData";
import {tavernsConfig} from "../Tavern";
import {CurrentScoring, FinalScoring} from "../Score";

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
                        <th key={tavernsConfig[j].name}>
                            <span style={{background: tavernsConfig[j].style}} className="bg-tavern">

                            </span>
                        </th>
                    );
                    // todo CLEANUP & Open only current taverns coins!
                    if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                        if (Number(data.props.ctx.currentPlayer) === p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={`player${p} tavernsConfig[j].${tavernsConfig[j].name} empty`}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <span
                                        style={{background: "url(/img/coins/CoinBack.png) no-repeat center center / 48px 48px"}}
                                        className="bg-coin">
                                        <span style={{background: tavernsConfig[j].style}} className="bg-tavern">

                                        </span>
                                    </span>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={`player${p} tavernsConfig[j].${tavernsConfig[j].name} coin`}>
                                    <span
                                        style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                        className="bg-coin">
                                        <span style={{background: tavernsConfig[j].style}} className="bg-tavern">

                                        </span>
                                    </span>
                                </td>
                            );
                        }
                    } else if (data.props.ctx.phase === "placeCoins" && Number(data.props.ctx.currentPlayer) !== p) {
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                <span style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                      className="bg-coin">

                                </span>
                            </td>
                        );
                    } else {
                        if (Number(data.props.ctx.currentPlayer) === p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j} onClick={() => data.OnClickBoardCoin(j)}>
                                    <span
                                        style={{background: `url(/img/coins/Coin${data.props.G.players[p].boardCoins[coinIndex].value}${data.props.G.players[p].boardCoins[coinIndex].isInitial
                                                ? "Initial" : ""}.jpg) no-repeat 0px 0px / 48px 48px`}}
                                        className="bg-coin">

                                    </span>
                                </td>
                            );
                        } else {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}>
                                    <span
                                        style={{background: `url(/img/coins/Coin${data.props.G.players[p].boardCoins[coinIndex].value}${data.props.G.players[p].boardCoins[coinIndex].isInitial
                                                ? "Initial" : ""}.jpg) no-repeat 0px 0px / 48px 48px`}}
                                        className="bg-coin">

                                    </span>
                                </td>
                            );
                        }
                    }
                    coinIndex++;
                }
            } else if (i === 1) {
                for (let j = data.props.G.taverns.length; j <= data.props.G.players[p].boardCoins.length; j++) {
                    if (j === data.props.G.players[p].boardCoins.length) {
                        playerFooters[p].push(
                            <th key={`${data.props.G.players[p].nickname} priority icon`}>
                                <span
                                    style={{background: "url(/img/priorities/Priority.png) no-repeat -35px -5px / 64px 36px"}}
                                    className="bg-tavern">

                                </span>
                            </th>
                        );
                        playerCells.push(
                            <td key={`${data.props.G.players[p].nickname} priority gem`}>
                                <span
                                    style={{background: `url(/img/priorities/Priority${data.props.G.players[p].priority.value}.png) 
                                    no-repeat 0px 0px / 32px 48px`}}
                                    className="bg-priority">

                                </span>
                            </td>
                        );
                    } else {
                        playerFooters[p].push(
                            <th key={`${data.props.G.players[p].nickname} exchange icon ${j}`}>
                                <span
                                    style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                                    className="bg-small-market-coin">

                                </span>
                            </th>
                        );
                        if (data.props.G.players[p].boardCoins[coinIndex] === null) {
                            if (Number(data.props.ctx.currentPlayer) === p) {
                                playerCells.push(
                                    <td className="cursor-pointer" key={`${data.props.G.players[p].nickname} exchange coin ${j}`}
                                        onClick={() => data.OnClickBoardCoin(j)}>
                                        <span
                                            style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                            className="bg-coin">
                                            <span
                                                style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                                                className="bg-small-market-coin">

                                            </span>
                                        </span>
                                    </td>
                                );
                            } else {
                                playerCells.push(
                                    <td key={j}>
                                        <span
                                            style={{background: "url(/img/coins/CoinBack.png) no-repeat 0px 0px / 48px 48px"}}
                                            className="bg-coin">
                                        <span
                                            style={{background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px"}}
                                            className="bg-small-market-coin">

                                        </span>
                                        </span>
                                    </td>
                                );
                            }
                        } else if (data.props.ctx.phase === "placeCoins" && Number(data.props.ctx.currentPlayer) !== p) {
                            playerCells.push(
                                <td className="cursor-pointer" key={j}
                                    onClick={() => data.OnClickBoardCoin(j)}>
                                    <span
                                        style={{background: "url(/img/coins/CoinBack.png) no-repeat center center / 48px 48px"}}
                                        className="bg-coin">

                                    </span>
                                </td>
                            );
                        } else {
                            if (Number(data.props.ctx.currentPlayer) === p) {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}
                                        onClick={() => data.OnClickBoardCoin(j)}>
                                        <span
                                            style={{background: `url(/img/coins/Coin${data.props.G.players[p].boardCoins[coinIndex].value}${data.props.G.players[p].boardCoins[coinIndex].isInitial
                                                    ? "Initial" : ""}.jpg) no-repeat 0px 0px / 48px 48px`}}
                                            className="bg-coin">

                                        </span>
                                    </td>
                                );
                            } else {
                                playerCells.push(
                                    <td className="cursor-pointer" key={j}>
                                        <span
                                            style={{background: `url(/img/coins/Coin${data.props.G.players[p].boardCoins[coinIndex].value}${data.props.G.players[p].boardCoins[coinIndex].isInitial
                                                    ? "Initial" : ""}.jpg) no-repeat 0px 0px / 48px 48px`}}
                                            className="bg-coin">

                                        </span>
                                    </td>
                                );
                            }
                        }
                        coinIndex++;
                    }
                }
            }
            playerRows[p][i].push(<tr key={`${data.props.G.players[p].nickname} board coins row ${i}`}>{playerCells}</tr>)
        }
        playersBoardsCoins[p].push(
            <table className="col-span-3" key={`${data.props.G.players[p].nickname} board coins`}>
                <caption>
                    Player {p + 1} ({data.props.G.players[p].nickname}) played coins
                </caption>
                <thead>
                <tr>{playerHeaders[p]}</tr>
                </thead>
                <tbody>
                {playerRows[p]}
                </tbody>
                <tfoot>
                <tr>{playerFooters[p]}</tr>
                </tfoot>
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
                if (data.props.G.players[p].handCoins[j] === null) {
                    playerCells.push(
                        <td key={j}>
                            <span className="bg-coin bg-yellow-300 border-2">

                            </span>
                        </td>
                    );
                } else {
                    if (Number(data.props.ctx.currentPlayer) === p) {
                        let coinClass = "border-2";
                        if (data.props.G.players[p].selectedCoin === j) {
                            coinClass = "border-2 border-green-400";
                        }
                        playerCells.push(
                            <td className="cursor-pointer" key={j} onClick={() => data.OnClickHandCoin(j)}>
                                <span
                                    style={{background: `url(/img/coins/Coin${data.props.G.players[p].handCoins[j].value}${data.props.G.players[p].handCoins[j].isInitial
                                            ? "Initial" : ""}.jpg) no-repeat 0px 0px / 48px 48px`}}
                                    className={`bg-coin ${coinClass}`}>

                                </span>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td className="cursor-pointer" key={j}>
                                <span
                                    style={{background: "url(/img/coins/CoinBack.png) no-repeat center center / 48px 48px"}}
                                    className="bg-coin">

                                </span>
                            </td>
                        );
                    }
                }
            }
        }
        playersHandsCoins[p].push(
            <table className="col-span-3" key={`${data.props.G.players[p].nickname} hand coins`}>
                <caption>Player {p + 1} ({data.props.G.players[p].nickname}) coins</caption>
                <tbody>
                <tr>{playerCells}</tr>
                </tbody>
            </table>
        );
    }
    return playersHandsCoins;
};

export const DrawPlayersBoards = (data) => {
    const playersBoards = [],
        playerHeaders = [],
        playerRows = [],
        expansion = data.props.G.expansions.thingvellir.active ? 1 : 0;
    for (let p = 0; p < data.props.ctx.numPlayers; p++) {
        playersBoards[p] = [];
        playerHeaders[p] = [];
        playerRows[p] = [];
        for (let s = 0; s < data.props.G.suitsNum + 1 + expansion; s++) {
            if (s < data.props.G.suitsNum) {
                playerHeaders[p].push(
                    <th className={`${suitsConfigArray[s].suitColor}`} key={`${data.props.G.players[p].nickname} ${suitsConfigArray[s].suitName} icon`}>
                        <span
                            style={{background: `url(/img/suits/${suitsConfigArray[s].suitName}.png) no-repeat 0px 0px / 24px 24px`}}
                            className="bg-suit">

                        </span>
                    </th>
                );
            } else if (s === data.props.G.suitsNum) {
                playerHeaders[p].push(
                    <th className="bg-gray-600" key={`${data.props.G.players[p].nickname} icon`}>
                        <span
                            style={{background: `url(/img/cards/heroes/HeroBack.png) no-repeat 0px 0px / 16px 24px`}}
                            className="bg-hero">

                        </span>
                    </th>
                );
            } else if (expansion && s < data.props.G.suitsNum + 1 + expansion) {
                playerHeaders[p].push(
                    <th className="bg-yellow-200" key={`${data.props.G.players[p].nickname}`}>
                        <span style={{background: "url(/img/cards/camp/Camp.png) no-repeat 0px 3px / 24px 18px"}}
                              className="bg-camp">

                        </span>
                    </th>
                );
            }
        }
        for (let i = 0; ; i++) {
            const playerCells = [];
            let isDrawRow = false;
            playerRows[p][i] = [];
            for (let j = 0; j < data.props.G.suitsNum + 1 + expansion; j++) {
                const id = i + j;
                if (j < data.props.G.suitsNum) {
                    // todo fix 1 row cards
                    if (data.props.G.players[p].cards[j] !== undefined && data.props.G.players[p].cards[j][i] !== undefined) {
                        isDrawRow = true;
                        playerCells.push(
                            <td key={id}
                                className={suitsConfigArray[j].suitColor}>
                                <b>{data.props.G.players[p].cards[j][i].points}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    }
                } else if (j === data.props.G.suitsNum) {
                    if (data.props.G.players[p].heroes[i] !== undefined) {
                        isDrawRow = true;
                        playerCells.push(
                            <td key={id}
                                className="bg-gray-600">
                                <b>{data.props.G.players[p].heroes[i]}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    }
                } else if (expansion && j === data.props.G.suitsNum + expansion) {
                    if (data.props.G.players[p].campCards[i] !== undefined) {
                        isDrawRow = true;
                        playerCells.push(
                            <td className="bg-yellow-200" key={id}>
                                <b>{data.props.G.players[p].campCards[i].points}</b>
                            </td>
                        );
                    } else {
                        playerCells.push(
                            <td key={id}>

                            </td>
                        );
                    }
                }
            }
            if (isDrawRow) {
                playerRows[p][i].push(
                    <tr key={`${data.props.G.players[p].nickname} board row ${i}`}>{playerCells}</tr>
                );
            } else {
                break;
            }
        }
        playersBoards[p].push(
            <div className="col-span-3" key={`${data.props.G.players[p].nickname} board`}>
                <table>
                    <caption>Player {p + 1} ({data.props.G.players[p].nickname}) cards,
                        {data.props.G.winner !== null ?
                            "Final: " + FinalScoring(data.props.G, data.props.ctx, data.props.G.players[p], CurrentScoring(data.props.G.players[p])) :
                            CurrentScoring(data.props.G.players[p])} points</caption>
                    <thead>
                    <tr>{playerHeaders[p]}</tr>
                    </thead>
                    <tbody>{playerRows[p]}</tbody>
                </table>
            </div>
        );
    }
    return playersBoards;
};
